import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CirclePlus,
  ArrowUpCircle,
  ArrowDownCircle,
  ChartNoAxesCombined,
  SquarePen,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useSupabase from "@/utils/useSupabase.js";
import CategorySheet from "./CategorySheet";

export default function GroupCategorySetting({
  categories,
  loading,
  fetchData,
}) {
  const [selectedType, setSelectedType] = useState("지출");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { update } = useSupabase("categories");

  const mainCategoryOptions = Array.from(
    new Map(
      categories
        .filter((item) => item.type === selectedType)
        .map((item) => [
          item.main_category_id,
          { id: item.main_category_id, name: item.main_category },
        ])
    ).values()
  );

  const handleEdit = (category) => {
    setModalOpen(true);
    //...update
    //fetchData();
  };
  let error = null;
  const handleSave = async (updated) => {
    if (updated) {
      const id = updated.id;
      const res = await update(updated.id, updated);
      error = res?.error;
    }

    if (error) {
      console.error("저장 실패:", error);
      alert("입력 오류");
      return;
    }

    await fetchData();
    alert("수정 완료");
    setModalOpen(false);
  };
  if (loading) return <p>로딩 중...</p>;
  return (
    <Card className="w-full my-6">
      <CardHeader>
        <CardTitle className="text-2xl">카테고리 그룹 설정</CardTitle>
        <CardDescription>카테고리 그룹을 편집합니다.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── 1. Type 선택 (ToggleGroup) ── */}
        <ToggleGroup
          type="single"
          value={selectedType}
          onValueChange={(v) => v && setSelectedType(v)}
          className="grid grid-cols-3 gap-10 w-full max-w-[400px] mx-auto"
        >
          {[
            { id: "지출", icon: ArrowDownCircle },
            { id: "수입", icon: ArrowUpCircle },
            { id: "저축&투자", icon: ChartNoAxesCombined },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <ToggleGroupItem
                key={type.id}
                value={type.id}
                className="flex flex-col items-center justify-center gap-2 px-6 py-6 rounded min-h-[100px] text-lg border border-gray-300"
              >
                <Icon className="!w-8 !h-8 shrink-0" />
                {/* 아이콘 컴포넌트를 직접 렌더링 */}
                <span className="text-base font-semibold">{type.id}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {/* ── 2. Main Category 버튼 그리드 ── */}
        <div className="grid grid-cols-4 gap-4">
          {mainCategoryOptions.map((item) => (
            <Button
              key={item.id}
              variant={
                selectedMainCategoryId === item.id ? "default" : "outline"
              }
              onClick={() => setSelectedMainCategoryId(item.id)}
              className="text-lg"
            >
              {item.name}
            </Button>
          ))}
          <Button variant="secondary">
            <CirclePlus />
          </Button>
        </div>
      </CardContent>
      <CategorySheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={selectedMainCategoryId}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <CardFooter className="flex justify-between" />
    </Card>
  );
}
