import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Entry {
  id: string;
  created_at: string;
  source_type: string;
  source_app: string | null;
  source_url: string | null;
  content_text: string;
  content_summary: string | null;
  screenshot_url: string;
  title: string;
  category: string;
  tags: string[] | null;
  metadata: Record<string, any>;
  ai_confidence: number | null;
  ai_analysis: Record<string, any> | null;
}
