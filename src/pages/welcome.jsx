import { useEffect } from "react";
import { useAuthStore } from "@/utils/useAuthStore";
import { useAccountStore } from "@/utils/useAccountStore";

export default function Welcome() {
  const user = useAuthStore((state) => state.user);
  const { fetchAccount, account } = useAccountStore();

  useEffect(() => {
    if (user) {
      fetchAccount(user);
    }
  }, [user]);
  console.log(user);
  console.log(account);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl font-semibold tracking-tight text-center">
        {user.user_metadata.name} 님 반갑습니다!
      </h2>
      <h3>
        {account
          ? `${account.name} 가계부를 시작합니다!`
          : "계정 정보를 불러오는 중입니다..."}
      </h3>
    </div>
  );
}
