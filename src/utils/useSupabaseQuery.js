import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";

export function useSupabaseQuery({
  table,
  filters = {},
  select = "*",
  orderBy,
}) {
  const queryKey = ["supabase", table, filters, orderBy];

  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(table).select(select);

      const { dateRange, ...rest } = filters;

      for (const [key, value] of Object.entries(rest)) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      }

      if (dateRange?.from) query = query.gte("date", dateRange.from);
      if (dateRange?.to) query = query.lte("date", dateRange.to);

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}
