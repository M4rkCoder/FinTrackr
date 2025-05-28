import AssetBalanceTable from "@/components/SaveInvestment/AssetBalanceTable";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/PageWrapper";

export default function SaveInvestment() {
  return (
    <PageWrapper title="저축/투자">
      <AssetBalanceTable />
    </PageWrapper>
  );
}
