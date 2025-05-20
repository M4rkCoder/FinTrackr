import { create } from "zustand";
import { supabase } from "@/utils/supabase";

export const useUserStore = create((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    set({ isLoading: true });

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("세션 에러:", error.message);
        set({ user: null });
      } else {
        set({ user: session?.user ?? null });
      }
    } catch (e) {
      console.error("fetchUser 예외:", e.message);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
