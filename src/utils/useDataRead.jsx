import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://psffemeattsqyxabuswc.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZmZlbWVhdHRzcXl4YWJ1c3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3OTc4NDAsImV4cCI6MjA1NjM3Mzg0MH0.cx57YxI-PuGvsFMA_bm8Qv8fbNAoJHgWq4G-k_V4EeA";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const useDataRead = (year, month, filterType="*", filterValue="*") => {
  const [data, setData] = useState([]); // 데이터 저장
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
          const { data: result, error } = await supabase.rpc("get_transactions_summary", {
            year,
            month,
            filter_type: filterType,
            filter_value: filterValue,
          });
          
        if (error) throw new Error(error.message);

        if (isMounted) {
          setData(result[0]?.transactions || []);
          setTotalAmount(result[0]?.total_amount || 0);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // 메모리 누수 방지
    };
  }, [year, month, filterType, filterValue]);

  return { data, totalAmount, loading, error };
};

export default useDataRead;
