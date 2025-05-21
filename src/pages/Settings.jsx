import AccountSetting from "@/components/Settings/AccountSetting";
import CategorySetting from "@/components/Settings/CategorySetting";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="flex flex-col w-[80%] justify-between mx-auto mt-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-semibold tracking-tight pb-2 text-left">
          설정
        </h2>
      </div>
      <Separator className="my-4" />
      <div className="gap-2">
        <AccountSetting />
        <CategorySetting />
      </div>
    </div>
  );
}
