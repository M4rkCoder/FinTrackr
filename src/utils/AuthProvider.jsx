import { useEffect } from "react";
import { supabase } from "@/utils/supabase.js";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        const user = data.session.user;
        setUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata.name,
          avatar_url: user.user_metadata.avatar_url,
        });
      } else {
        setUser(null);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const user = session.user;
          setUser({
            id: user.id,
            email: user.email,
            name: user.user_metadata.name,
            avatar_url: user.user_metadata.avatar_url,
          });
        } else {
          setUser(null);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  if (isLoading) {
    return <p>로딩 중....</p>;
  }

  return <>{children}</>;
}
