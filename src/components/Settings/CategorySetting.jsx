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
import useSupabase from "@/utils/useSupabase.js";
import SubCategorySetting from "./SubCategorySetting";

function CategorySetting() {
  const { data: categories, loading, fetchData } = useSupabase("category_view");
  // const { update } = useSupabase("categories");
  const [selectedTab, setSelectedTab] = useState("income");

  // 1) supabase에서 카테고리 전체 데이터 로드
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>로딩 중...</p>;
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
            <TabsTrigger value="income" className="text-lg font-extrabold">
              수입
            </TabsTrigger>
            <TabsTrigger value="expense" className="text-lg font-extrabold">
              지출
            </TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <SubCategorySetting
              categories={categories}
              typeId={1}
              loading={loading}
              fetchData={fetchData}
            />
          </TabsContent>
          <TabsContent value="expense">
            <SubCategorySetting
              categories={categories}
              typeId={2}
              loading={loading}
              fetchData={fetchData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between" />
    </Card>
  );
}

export default CategorySetting;
