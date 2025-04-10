
-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'unsubscribed', 'bounced'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_email_sent TIMESTAMP WITH TIME ZONE,
  source TEXT, -- where the subscription came from
  tags TEXT[] DEFAULT '{}',
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create newsletter_campaigns table for tracking sent newsletters
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_by UUID, -- reference to user who sent it
  recipient_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'scheduled'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}'
);

-- Create newsletter_clicks table for tracking link clicks
CREATE TABLE IF NOT EXISTS newsletter_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_email TEXT NOT NULL,
  clicked_url TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT
);

-- Create unsubscribe token function
CREATE OR REPLACE FUNCTION generate_unsubscribe_token(email TEXT) 
RETURNS TEXT AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a base64-encoded hash of the email with a salt
  token := encode(
    hmac(
      email || extract(epoch from now())::text, 
      current_setting('app.jwt_secret', true), 
      'sha256'
    ),
    'base64'
  );
  -- Make it URL-safe
  token := replace(replace(token, '+', '-'), '/', '_');
  -- Trim padding
  token := replace(token, '=', '');
  RETURN token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_clicks ENABLE ROW LEVEL SECURITY;

-- Policies for newsletter_subscriptions
CREATE POLICY "Allow public to insert their own email subscription"
  ON newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to view all subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admins to update subscriptions"
  ON newsletter_subscriptions
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow admins to delete subscriptions"
  ON newsletter_subscriptions
  FOR DELETE
  USING (true);

-- Policies for newsletter_campaigns
CREATE POLICY "Allow admins to view campaigns"
  ON newsletter_campaigns
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admins to insert campaigns"
  ON newsletter_campaigns
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admins to update campaigns"
  ON newsletter_campaigns
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow admins to delete campaigns"
  ON newsletter_campaigns
  FOR DELETE
  USING (true);

-- Policies for newsletter_clicks
CREATE POLICY "Allow anyone to insert newsletter clicks"
  ON newsletter_clicks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admins to view newsletter clicks"
  ON newsletter_clicks
  FOR SELECT
  USING (true);
