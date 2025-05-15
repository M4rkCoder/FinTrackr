import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/utils/useAuthStore.jsx";

export default function AccountSetting() {
  const user = useAuthStore((state) => state.user);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">가계부 사용자 설정</CardTitle>
        <CardDescription>가계부 사용자 초대 및 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <label>가계부 이름</label>
        <input></input>
        <label>가계부 멤버</label>
        <ul>
          <li>낙현</li>
          <li>가영</li>
        </ul>
        <button>가계부 멤버 초대</button>
      </CardContent>
    </Card>
  );
}
