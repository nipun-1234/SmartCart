
-- Allow stripe provider in payments
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_provider_check;
ALTER TABLE payments ADD CONSTRAINT payments_provider_check 
  CHECK (provider IN ('stripe', 'payhere', 'cash_on_delivery'));

-- Add coupon support to orders
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
  min_spend NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default coupon codes
INSERT INTO coupons (code, discount_type, discount_value, min_spend, is_active)
VALUES 
  ('SMART10', 'percentage', 10.00, 3000.00, TRUE),
  ('WELCOME500', 'fixed', 500.00, 2500.00, TRUE),
  ('SUPER20', 'percentage', 20.00, 15000.00, TRUE)
ON CONFLICT (code) DO NOTHING;
