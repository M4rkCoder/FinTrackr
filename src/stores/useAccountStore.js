import { create } from "zustand";
import { supabase } from "@/utils/supabase";

export const useAccountStore = create((set, get) => ({
  account: null,
  isLoading: false,

  fetchAccount: async (user) => {
    console.log("fetchAccount 시작");
    const { isLoading, account } = get();

    if (!user || isLoading || account) {
      console.log("로딩 중 또는 account 있음. fetchAccount 스킵");
      return;
    }

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from("users")
        .select("account_id(id, name, owner_id)")
        .eq("id", user.id)
        .maybeSingle();

      console.log("쿼리 결과 - data:", data, "error:", error);

      if (error) {
        console.error("계정 정보 로드 실패:", error.message);
        set({ account: null });
      } else {
        set({ account: data?.account_id ?? null });
      }
    } catch (e) {
      console.error("fetchAccount 예외:", e.message);
      set({ account: null });
    } finally {
      console.log("fetchAccount 끝 - isLoading false로 변경");
      set({ isLoading: false });
    }
  },
}));
