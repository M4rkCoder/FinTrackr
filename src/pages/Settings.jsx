import AccountSetting from "@/components/Settings/AccountSetting";
import CategorySetting from "@/components/Settings/CategorySetting";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="w-4/5 max-w-4xl mx-auto p-5 flex flex-col gap-6">
      <h2 className="text-3xl font-semibold tracking-tight text-left">설정</h2>
      <Separator />
      <AccountSetting />
      <CategorySetting />
    </div>
  );
}
