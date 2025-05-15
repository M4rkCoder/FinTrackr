import { useAuthStore } from "@/utils/useAuthStore.jsx";

export default function Welcome() {
  const user = useAuthStore((state) => state.user);
  console.log(user);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h2 className="text-3xl font-semibold tracking-tight text-center">
        {user.user_metadata.name} 님 반갑습니다!
      </h2>
    </div>
  );
}
