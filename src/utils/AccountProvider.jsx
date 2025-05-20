import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useAccountStore } from "../stores/useAccountStore";

export default function AccountProvider({ children }) {
  const user = useAuthStore((state) => state.user);
  const { account, isLoading, fetchAccount } = useAccountStore();

  useEffect(() => {
    if (user && !account && !isLoading) {
      console.log("AccountProvider에서 fetch");
      fetchAccount(user);
    }
  }, [user, account, isLoading]);

  return <>{children}</>;
}
