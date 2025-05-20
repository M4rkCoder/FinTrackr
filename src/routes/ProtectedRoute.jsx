import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
}
