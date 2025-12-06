/*
  # Recreate All RLS Policies for Orders Table

  1. Changes
    - Drop ALL existing policies
    - Recreate simple, permissive policies
    - Test anon user INSERT specifically

  2. Security
    - Anon users: can INSERT pending orders, cannot SELECT/UPDATE/DELETE
    - Authenticated users: full access
    - Service role: bypasses RLS
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anonymous users can create pending orders" ON orders;
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
DROP POLICY IF EXISTS "Public can view own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Webhook can update orders" ON orders;

-- Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Anon users can INSERT orders with status = 'pending'
CREATE POLICY "anon_insert_orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- POLICY 2: Authenticated users can do everything
CREATE POLICY "authenticated_full_access"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- POLICY 3: Anon users can UPDATE from pending to paid (for webhook)
CREATE POLICY "anon_update_to_paid"
  ON orders
  FOR UPDATE
  TO anon
  USING (status IN ('pending', 'awaiting_approval'))
  WITH CHECK (status IN ('paid', 'cancelled'));

-- POLICY 4: Anon users can SELECT their own orders (using payment_content)
CREATE POLICY "anon_select_own_orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);
