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
import EditCategoryModal from "../EditCategoryModal";

export default function CategorySetting() {
  const [selectedType, setSelectedType] = useState("지출");
  const [selectedMainCategory, setSelectedMainCategory] = useState("전체");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: categories, fetchData, update } = useSupabase("categories");

  // 1) supabase에서 카테고리 전체 데이터 로드
  useEffect(() => {
    fetchData({
      select:
        "id, sub_category, emoji, main_category_id, main_categories(id, main_category), types(id, type)",
      orderBy: { column: "main_category_id", ascending: true },
    });
  }, []);

  // 2) 타입이 바뀔 때 main_category 기본을 "전체"로 리셋
  useEffect(() => {
    setSelectedMainCategory("전체");
  }, [selectedType]);

  // 3) 해당 타입에 대한 고유 main_category 리스트 (맨 앞에 "전체")
  const mainCategoryOptions = [
    "전체",
    ...Array.from(
      new Set(
        categories
          .filter((item) => item.types?.type === selectedType)
          .map((item) => item.main_categories?.main_category)
      )
    ),
  ];

  // 4) sub_category 필터
  const filteredSubCategories = categories.filter(
    (item) =>
      item.types?.type === selectedType &&
      (selectedMainCategory === "전체" ||
        item.main_categories.main_category === selectedMainCategory)
  );

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
    fetchData({
      select:
        "id, sub_category, emoji, main_category_id, main_categories(id, main_category), types(id, type)",
      orderBy: { column: "main_category_id", ascending: true },
    });
  };
  let error = null;
  const handleSave = async (updated) => {
    console.log(updated);
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

    await fetchData({
      select:
        "id, sub_category, emoji, main_category_id, main_categories(id, main_category), types(id, type)",
      orderBy: { column: "main_category_id", ascending: true },
    });
    alert("수정 완료");
    setModalOpen(false);
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>카테고리 설정</CardTitle>
        <CardDescription>카테고리를 편집합니다.</CardDescription>
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

        {/* ── 2. Main Category 버튼 리스트 ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {mainCategoryOptions.map((cat) => (
            <Button
              key={cat}
              variant={selectedMainCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedMainCategory(cat)}
            >
              {cat}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="opacity-50 hover:opacity-100 transition-colors"
          >
            <SquarePen />
          </Button>
        </div>

        {/* ── 3. Sub Category 버튼 그리드 ── */}
        <div className="grid grid-cols-4 gap-4">
          {filteredSubCategories.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              onClick={() => handleEdit(item)}
            >
              {item.emoji} {item.sub_category}
            </Button>
          ))}
          <Button variant="secondary">
            <CirclePlus />
          </Button>
        </div>
      </CardContent>
      <EditCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
      />
      <CardFooter className="flex justify-between" />
    </Card>
  );
}
