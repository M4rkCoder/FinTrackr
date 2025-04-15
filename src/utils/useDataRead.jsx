import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const useDataRead = (year, month, filterType = "*", filterValue = "*") => {
  const [data, setData] = useState([]); // 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const selectedMonth = `${year}-${month.toString().padStart(2, "0")}-01`;
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let query = supabase
        .from("monthly_transaction")
        .select("*")
        .eq("month", selectedMonth);

      if (filterType !== "*" && filterValue !== "*") {
        query = query.eq(filterType, filterValue);
      }

      try {
        const { data, error } = await query;

        if (error) throw new Error(error.message);

        if (isMounted) {
          setData(data);
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

  return { data, loading, error };
};

export default useDataRead;
