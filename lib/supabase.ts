// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjulguxvkirbdsrcygfy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdWxndXh2a2lyYmRzcmN5Z2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDk1NDksImV4cCI6MjA2MzQ4NTU0OX0.hcFuQ3fHhFXUtbW-XYNZBGGqyZWTm5bU4KrXZ-jvlII';

export const supabase = createClient(supabaseUrl, supabaseKey);
