import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kvsueqqvhjacxxkrepjl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c3VlcXF2aGphY3h4a3JlcGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjQ1NzksImV4cCI6MjA4MzM0MDU3OX0.u2bSYxm0K1vGVKom7nPpZ-IR9Ssf-hylNLzTxifegr4";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
