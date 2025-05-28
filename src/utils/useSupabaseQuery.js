import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAccountStore } from "../stores/useAccountStore";

export function useSupabaseQuery({
  table,
  filters = {},
  select = "*",
  orderBy,
  requireAccountId = true, // 기본값: account_id 필터링 활성화
}) {
  const account = useAccountStore((state) => state.account);
  const accountId = account?.id;

  const queryKey = ["supabase", table, filters, orderBy, accountId];

  return useQuery({
    queryKey,
    enabled: !requireAccountId || !!accountId, // accountId 준비되었을 때만 실행
    queryFn: async () => {
      let query = supabase.from(table).select(select);

      // ✅ account_id 필터링 조건 추가
      if (requireAccountId && accountId) {
        query = query.eq("account_id", accountId);
      }

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
