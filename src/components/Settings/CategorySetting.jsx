import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/linetabs";
import useSupabase from "@/utils/useSupabase.js";
import SubCategorySetting from "./subCategorySetting";

function CategorySetting() {
  const { data: categories, loading, fetchData } = useSupabase("category_view");
  const { update } = useSupabase("categories");

  // 1) supabase에서 카테고리 전체 데이터 로드
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  return (
    <Tabs defaultValue="category" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="category" className="text-lg font-extrabold">
          카테고리 설정
        </TabsTrigger>
        <TabsTrigger value="group" className="text-lg font-extrabold">
          카테고리 그룹 설정
        </TabsTrigger>
      </TabsList>
      <TabsContent value="category">
        <SubCategorySetting
          categories={categories}
          loading={loading}
          fetchData={() => fetchData}
        />
      </TabsContent>
      <TabsContent value="group"></TabsContent>
    </Tabs>
  );
}

export default CategorySetting;
