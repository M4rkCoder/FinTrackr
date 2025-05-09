import { CategorySetting } from "@/components/Settings/CategorySetting";

export default function Settings() {
  return (
    <div className="p-5">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        설정
      </h2>

      <CategorySetting />
    </div>
  );
}
