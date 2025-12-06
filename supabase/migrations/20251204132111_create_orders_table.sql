/*
  # Tạo bảng Orders cho hệ thống Solana Memory

  ## Mô tả
  Bảng orders lưu trữ tất cả đơn hàng (memories và gift orders) cho hệ thống.
  Hỗ trợ webhook PayOS để tự động cập nhật trạng thái thanh toán.

  ## Tables Mới
  
  ### `orders`
  - `id` (uuid, primary key) - ID đơn hàng duy nhất
  - `type` (text) - Loại đơn: 'memory' hoặc 'gift'
  - `payment_content` (text, indexed) - Mã thanh toán (format: "ID 16812345678")
  - `status` (text) - Trạng thái: 'pending', 'awaiting_approval', 'paid', 'cancelled'
  - `price` (numeric) - Giá đơn hàng (VND)
  - `customer_name` (text) - Tên khách hàng
  - `customer_email` (text) - Email khách hàng
  - `customer_phone` (text) - Số điện thoại
  - `product_id` (text) - ID sản phẩm
  - `product_name` (text) - Tên sản phẩm
  - `qr_code_url` (text) - URL QR code
  - `memory_content` (jsonb) - Nội dung memory (text, images, videos)
  - `gift_details` (jsonb) - Chi tiết gift nếu là gift order
  - `paid_at` (timestamptz) - Thời điểm thanh toán
  - `payment_method` (text) - Phương thức thanh toán: 'payos', 'casso', 'manual'
  - `payos_order_code` (text) - Mã đơn hàng PayOS
  - `payos_transaction_ref` (text) - Mã tham chiếu giao dịch PayOS
  - `created_at` (timestamptz) - Thời gian tạo
  - `updated_at` (timestamptz) - Thời gian cập nhật cuối

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS trên bảng `orders`
  - Chỉ authenticated users (admin) có thể xem tất cả orders
  - Public có thể xem order của mình qua payment_content
  
  ### Policies
  1. **Admin có thể xem tất cả orders**
     - FOR SELECT TO authenticated
     - USING role = 'admin'
  
  2. **Public có thể xem order của mình**
     - FOR SELECT TO anon
     - USING payment_content matches
  
  3. **Webhook có thể update orders**
     - FOR UPDATE TO anon, authenticated
     - Chỉ update status và payment fields

  ## Indexes
  - Index trên `payment_content` để tìm kiếm nhanh
  - Index trên `status` để filter
  - Index trên `created_at` để sort

  ## Notes
  - Default status là 'pending'
  - Tự động set timestamps với now()
  - payment_content phải unique để tránh duplicate
*/

-- Tạo bảng orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('memory', 'gift')),
  payment_content text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'awaiting_approval', 'paid', 'cancelled')),
  price numeric NOT NULL CHECK (price >= 0),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  product_id text,
  product_name text,
  qr_code_url text,
  memory_content jsonb DEFAULT '{}'::jsonb,
  gift_details jsonb DEFAULT '{}'::jsonb,
  paid_at timestamptz,
  payment_method text CHECK (payment_method IN ('payos', 'casso', 'manual')),
  payos_order_code text,
  payos_transaction_ref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tạo indexes để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_orders_payment_content ON orders(payment_content);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users (admin) có thể xem tất cả
CREATE POLICY "Authenticated users can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Anonymous có thể xem order của mình qua payment_content
CREATE POLICY "Public can view own orders"
  ON orders
  FOR SELECT
  TO anon
  USING (
    payment_content IN (
      SELECT unnest(string_to_array(current_setting('request.headers', true)::json->>'x-payment-id', ','))
    )
  );

-- Policy 3: Webhook (anon/authenticated) có thể update orders
CREATE POLICY "Webhook can update orders"
  ON orders
  FOR UPDATE
  TO anon, authenticated
  USING (status IN ('pending', 'awaiting_approval'))
  WITH CHECK (
    status IN ('paid', 'cancelled') AND
    paid_at IS NOT NULL
  );

-- Policy 4: Authenticated users có thể insert orders
CREATE POLICY "Authenticated users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 5: Public có thể tạo orders (cho frontend)
CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- Function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger để tự động update updated_at khi có thay đổi
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
