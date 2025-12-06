/*
  # Fix RLS Policy for Anonymous Users

  1. Changes
    - Drop restrictive INSERT policy for anon users
    - Create new permissive policy that allows anon to create orders
    - Keep all other policies unchanged

  2. Security
    - Anon users can only create orders (not read/update/delete without proper auth)
    - Status must be 'pending' when created by anon users
*/

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Public can create orders" ON orders;

-- Create new permissive policy for anon INSERT
CREATE POLICY "Anonymous users can create pending orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (
    status = 'pending' 
    AND type IN ('memory', 'gift')
    AND price >= 0
  );
