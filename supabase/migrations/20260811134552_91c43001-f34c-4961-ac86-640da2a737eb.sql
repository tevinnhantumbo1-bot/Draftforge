CREATE TABLE public.wallet_nonces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nonce TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.wallet_nonces TO service_role;
ALTER TABLE public.wallet_nonces ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wallet_address TEXT,
  ADD COLUMN IF NOT EXISTS wallet_provider TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_wallet_address_key ON public.profiles (lower(wallet_address)) WHERE wallet_address IS NOT NULL;

ALTER TABLE public.design_requests
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_tx TEXT,
  ADD COLUMN IF NOT EXISTS payer_address TEXT,
  ADD COLUMN IF NOT EXISTS payment_network TEXT,
  ADD COLUMN IF NOT EXISTS paid_amount_usdc NUMERIC(18,6);