-- Create demo_requests table
CREATE TABLE demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  job_title VARCHAR(255),
  company_size VARCHAR(50),
  industry VARCHAR(100),
  use_case TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_demo_requests_email ON demo_requests(email);
CREATE INDEX idx_demo_requests_company ON demo_requests(company_name);
CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for demo requests
-- Allow anyone to insert demo requests
CREATE POLICY "Anyone can create demo requests" ON demo_requests
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read demo requests (for confirmation pages, etc.)
CREATE POLICY "Anyone can read demo requests" ON demo_requests
  FOR SELECT USING (true);

-- Only authenticated users can update demo requests
CREATE POLICY "Authenticated users can update demo requests" ON demo_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create newsletter_subscriptions table
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  industry VARCHAR(100),
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for newsletter subscriptions
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_created_at ON newsletter_subscriptions(created_at DESC);

-- Enable Row Level Security for newsletter subscriptions
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter subscriptions
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read newsletter subscriptions" ON newsletter_subscriptions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update newsletter subscriptions" ON newsletter_subscriptions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT ON demo_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON demo_requests TO authenticated;

GRANT SELECT, INSERT ON newsletter_subscriptions TO anon;
GRANT SELECT, INSERT, UPDATE ON newsletter_subscriptions TO authenticated;