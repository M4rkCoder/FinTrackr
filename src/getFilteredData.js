import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://psffemeattsqyxabuswc.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZmZlbWVhdHRzcXl4YWJ1c3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3OTc4NDAsImV4cCI6MjA1NjM3Mzg0MH0.cx57YxI-PuGvsFMA_bm8Qv8fbNAoJHgWq4G-k_V4EeA";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const fetchTransactions = async (
  year,
  month,
  filterType = "*",
  filterValue = "*"
) => {
  try {
    const { data: result, error } = await supabase.rpc(
      "get_transactions_summary",
      {
        year,
        month,
        filter_type: filterType,
        filter_value: filterValue,
      }
    );

    if (error) throw new Error(error.message);

    return {
      data: result[0]?.transactions || [],
      totalAmount: result[0]?.total_amount || 0,
      error: null,
    };
  } catch (err) {
    return {
      data: [],
      totalAmount: 0,
      error: err.message,
    };
  }
};

// 디버깅용 테스트
const test = async () => {
  const result = await fetchTransactions(
    2024,
    1,
    "main_category",
    "비고정 소비지출"
  );
  console.log("Result:", result);
};

test();
