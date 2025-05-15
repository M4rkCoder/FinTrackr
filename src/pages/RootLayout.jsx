import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import { useAuthStore } from "@/utils/useAuthStore.jsx";
import { supabase } from "@/utils/supabase.js";

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };

    init();

    // 로그인 상태 실시간 반영
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [fetchUser, setUser]);

  if (loading) return <div>로딩 중...</div>;
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
