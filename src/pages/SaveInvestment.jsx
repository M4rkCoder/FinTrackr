import AssetBalanceTable from "@/components/SaveInvestment/AssetBalanceTable";
import { Separator } from "@/components/ui/separator";

export default function SaveInvestment() {
  return (
    <div className="flex flex-col w-[80%] justify-between mx-auto mt-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-semibold tracking-tight pb-2 text-left">
          저축/투자
        </h2>
      </div>
      <Separator className="mt-4" />
      <AssetBalanceTable />
    </div>
  );
}
