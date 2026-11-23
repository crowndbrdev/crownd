-- Product name chosen at checkout (the Stripe webhook has no access to the buyer's cookies).
ALTER TABLE payments ADD COLUMN name TEXT;
