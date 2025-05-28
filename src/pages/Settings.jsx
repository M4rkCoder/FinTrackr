import AccountSetting from "@/components/Settings/AccountSetting";
import CategorySetting from "@/components/Settings/CategorySetting";
import PageWrapper from "@/components/PageWrapper";

export default function Settings() {
  return (
    <PageWrapper title="설정">
      <div className="gap-2 mt-4">
        <AccountSetting />
        <CategorySetting />
      </div>
    </PageWrapper>
  );
}
