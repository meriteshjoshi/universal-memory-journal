-- Universal Memory Journal - Initial Database Schema
-- Run this in Supabase Dashboard > SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Source metadata
  source_type TEXT NOT NULL,  -- 'youtube', 'twitter', 'instagram', 'other'
  source_app TEXT,
  source_url TEXT,

  -- Content
  content_text TEXT NOT NULL,
  content_summary TEXT,
  screenshot_url TEXT NOT NULL,

  -- AI-generated
  title TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'video', 'social', 'article', 'other'
  tags TEXT[],

  -- Source-specific metadata (JSONB for flexibility)
  metadata JSONB DEFAULT '{}',

  -- AI processing info
  ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  ai_analysis JSONB
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_category ON entries(category);
CREATE INDEX IF NOT EXISTS idx_entries_source_type ON entries(source_type);

-- Create storage bucket for screenshots (run separately if needed)
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies (drop if exists, then create)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'screenshots');

DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'screenshots');

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
END $$;
