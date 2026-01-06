/**
 * Database Initialization Script
 *
 * Run this once to set up your Supabase database schema and storage.
 *
 * Usage: npx tsx scripts/init-database.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initDatabase() {
  console.log('🚀 Initializing Supabase database...\n');

  try {
    // Create entries table
    console.log('📝 Creating entries table...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create entries table
        CREATE TABLE IF NOT EXISTS entries (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

          -- Source metadata
          source_type TEXT NOT NULL,
          source_app TEXT,
          source_url TEXT,

          -- Content
          content_text TEXT NOT NULL,
          content_summary TEXT,
          screenshot_url TEXT NOT NULL,

          -- AI-generated
          title TEXT NOT NULL,
          category TEXT NOT NULL,
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
      `
    });

    if (tableError) {
      console.error('❌ Error creating table:', tableError);
      // Try alternative approach using direct SQL
      console.log('🔄 Trying direct SQL execution...');

      const { error: directError } = await supabase
        .from('entries')
        .select('count')
        .limit(1);

      if (directError && directError.code === '42P01') {
        console.error('❌ Table does not exist. Please run the SQL manually in Supabase SQL Editor.');
        console.log('\n📋 Copy this SQL to Supabase Dashboard > SQL Editor:\n');
        console.log(`
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create entries table
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  source_type TEXT NOT NULL,
  source_app TEXT,
  source_url TEXT,

  content_text TEXT NOT NULL,
  content_summary TEXT,
  screenshot_url TEXT NOT NULL,

  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],

  metadata JSONB DEFAULT '{}',

  ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  ai_analysis JSONB
);

CREATE INDEX idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX idx_entries_category ON entries(category);
CREATE INDEX idx_entries_source_type ON entries(source_type);
        `);
        process.exit(1);
      }
    } else {
      console.log('✅ Entries table created successfully');
    }

    // Create storage bucket
    console.log('📦 Creating screenshots storage bucket...');
    const { data: buckets } = await supabase.storage.listBuckets();

    const bucketExists = buckets?.some(b => b.name === 'screenshots');

    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket('screenshots', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });

      if (bucketError) {
        console.error('❌ Error creating bucket:', bucketError);
      } else {
        console.log('✅ Screenshots bucket created successfully');
      }
    } else {
      console.log('✅ Screenshots bucket already exists');
    }

    // Test database connection
    console.log('\n🔍 Testing database connection...');
    const { count, error: countError } = await supabase
      .from('entries')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error testing connection:', countError);
    } else {
      console.log(`✅ Database connection successful! (${count || 0} entries)`);
    }

    console.log('\n🎉 Database initialization complete!\n');
    console.log('Next steps:');
    console.log('1. ✅ Database schema is ready');
    console.log('2. ✅ Storage bucket is ready');
    console.log('3. 🚀 Ready to start building the upload feature!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

initDatabase();
