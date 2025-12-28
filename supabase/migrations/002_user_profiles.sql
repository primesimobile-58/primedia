-- Create user_profiles table used by segmentation service
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  segments TEXT[] DEFAULT ARRAY[]::TEXT[],
  segment_scores JSONB DEFAULT '{}'::jsonb,
  behavior_score NUMERIC DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  conversion_probability NUMERIC DEFAULT 0,
  churn_risk NUMERIC DEFAULT 0,
  lifetime_value NUMERIC DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attributes JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_segments ON user_profiles USING GIN(segments);
CREATE INDEX IF NOT EXISTS idx_user_profiles_segment_scores ON user_profiles USING GIN(segment_scores);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow service role and authenticated upserts/selects
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Allow authenticated select'
  ) THEN
    CREATE POLICY "Allow authenticated select" ON user_profiles
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Allow authenticated upsert own profile'
  ) THEN
    CREATE POLICY "Allow authenticated upsert own profile" ON user_profiles
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Allow authenticated update own profile'
  ) THEN
    CREATE POLICY "Allow authenticated update own profile" ON user_profiles
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

GRANT SELECT ON user_profiles TO anon;
