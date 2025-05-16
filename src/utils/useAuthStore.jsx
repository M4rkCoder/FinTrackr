import { create } from "zustand";
import { supabase } from "@/utils/supabase";

export const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user, isLoading: false }),
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),

  fetchUser: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? null });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
