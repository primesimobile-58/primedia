-- Demo Requests Table
CREATE TABLE IF NOT EXISTS demo_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    use_case VARCHAR(100) NOT NULL,
    team_size INTEGER,
    timeline VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at DESC);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'demo_requests' AND policyname = 'Allow public demo request creation'
  ) THEN
    CREATE POLICY "Allow public demo request creation" ON demo_requests
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'demo_requests' AND policyname = 'Allow authenticated users to view demo requests'
  ) THEN
    CREATE POLICY "Allow authenticated users to view demo requests" ON demo_requests
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    interests TEXT[],
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(is_active);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'newsletter_subscriptions' AND policyname = 'Allow public newsletter subscription'
  ) THEN
    CREATE POLICY "Allow public newsletter subscription" ON newsletter_subscriptions
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'newsletter_subscriptions' AND policyname = 'Allow users to manage their subscriptions'
  ) THEN
    CREATE POLICY "Allow users to manage their subscriptions" ON newsletter_subscriptions
      FOR UPDATE USING (email = auth.email());
  END IF;
END $$;

GRANT SELECT, INSERT ON demo_requests TO anon;
GRANT SELECT, INSERT ON newsletter_subscriptions TO anon;

GRANT ALL PRIVILEGES ON demo_requests TO authenticated;
GRANT ALL PRIVILEGES ON newsletter_subscriptions TO authenticated;
