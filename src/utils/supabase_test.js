import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://psffemeattsqyxabuswc.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZmZlbWVhdHRzcXl4YWJ1c3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3OTc4NDAsImV4cCI6MjA1NjM3Mzg0MH0.cx57YxI-PuGvsFMA_bm8Qv8fbNAoJHgWq4G-k_V4EeA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const selectedMonth = "2024-01-01";

const test = async () => {
  const { data, error } = await supabase
    .from("monthly_summary")
    .select("*")
    .eq("month", selectedMonth);

  console.log(data);
};

test();
