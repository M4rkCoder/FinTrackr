import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button"; // ✨ 버튼 스타일도 함께 추가
import { useAuthStore } from "@/stores/useAuthStore";
import { useAccountStore } from "@/stores/useAccountStore";
import { useState } from "react";

export default function AccountSetting() {
  const user = useAuthStore((state) => state.user);
  const account = useAccountStore((state) => state.account);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(account?.name || "");

  const handleEditClick = () => {
    setIsEditing(true);
    setName(account?.name || "");
  };

  const handleSaveClick = () => {
    // 여기에서 Supabase에 업데이트 로직 추가 가능
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">가계부 사용자 설정</CardTitle>
        <CardDescription>가계부 사용자 초대 및 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="accountName" className="text-lg font-bold">
            가계부 이름
          </Label>
          {isEditing ? (
            <div className="flex items-center space-x-2 mt-1 w-1/3">
              <Input
                id="accountName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="!text-lg font-medium w-full"
              />
              <Button size="sm" onClick={handleSaveClick}>
                저장
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 mt-1 mr-3 w-1/3 px-3 py-1">
              <span className="text-lg font-medium w-full trncate">
                {account?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                수정
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label className="text-lg font-bold mt-5">가계부 멤버</Label>
          <div className="flex flex-row items-center p-2">
            <Avatar className="mr-2">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user.user_metadata?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{user.user_metadata.name}</span>
          </div>
          <Button variant="secondary">가계부 멤버 초대</Button>
        </div>
      </CardContent>
    </Card>
  );
}
