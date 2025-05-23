import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/linetabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import SubCategorySetting from "./SubCategorySetting";
import { useSupabaseQuery } from "@/utils/useSupabaseQuery";

function CategorySetting() {
  const {
    data: categories,
    isLoading,
    refetch,
  } = useSupabaseQuery({
    table: "categories",
  });
  // const { data: categories, loading, fetchData } = useSupabase("categories");
  // const { update } = useSupabase("categories");
  const [selectedTab, setSelectedTab] = useState("1");

  // 1) supabase에서 카테고리 전체 데이터 로드
  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <p>로딩 중...</p>;
  return (
    <Card className="w-full my-6">
      <CardHeader>
        <CardTitle className="text-2xl">수입/지출 카테고리 설정</CardTitle>
        <CardDescription>카테고리를 편집합니다.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1" className="text-lg font-extrabold">
              수입
            </TabsTrigger>
            <TabsTrigger value="2" className="text-lg font-extrabold">
              지출
            </TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <SubCategorySetting
              categories={categories}
              typeId={1}
              loading={isLoading}
              fetchData={refetch}
            />
          </TabsContent>
          <TabsContent value="2">
            <SubCategorySetting
              categories={categories}
              typeId={2}
              loading={isLoading}
              fetchData={refetch}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between" />
    </Card>
  );
}

export default CategorySetting;
