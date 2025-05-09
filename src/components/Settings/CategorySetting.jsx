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
import useSupabase from "@/utils/useSupabase";
import { CirclePlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/utils/supabase";

export function CategorySetting() {
  const [categories, setCategories] = useState([]);

  const [selectedType, setSelectedType] = useState("지출");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select(
          `id, sub_category, emoji, main_categories(id, main_category), types(id, type)`
        );
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // 타입이 바뀔 때는 기본으로 "전체" 선택
    setSelectedMainCategory("전체");
  }, [selectedType]);

  // type에 따른 main_category 리스트 필터링
  const mainCategoryOptions = [
    "전체",
    ...Array.from(
      new Set(
        categories
          .filter((item) => item.types.type === selectedType)
          .map((item) => item.main_categories.main_category)
      )
    ),
  ];

  // 최종 보여줄 sub_category 필터링
  const filteredSubCategories = categories.filter(
    (item) =>
      item.types.type === selectedType &&
      (selectedMainCategory === "전체" ||
        item.main_categories.main_category === selectedMainCategory)
  );

  return (
    <Card className="w-[80%] mx-auto">
      <CardHeader>
        <CardTitle>카테고리 설정</CardTitle>
        <CardDescription>카테고리를 편집합니다.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 필터 선택 영역 */}
        <div className="flex gap-4">
          {/* Type 선택 */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="지출">지출</SelectItem>
              <SelectItem value="수입">수입</SelectItem>
            </SelectContent>
          </Select>

          {/* Main Category 선택 */}
          <Select
            value={selectedMainCategory}
            onValueChange={setSelectedMainCategory}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="대분류 선택" />
            </SelectTrigger>
            <SelectContent>
              {mainCategoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Category 버튼 그리드 */}
        <div className="grid grid-cols-4 gap-4">
          {filteredSubCategories.map((item) => (
            <Button key={item.id} variant="outline">
              {item.emoji} {item.sub_category}
            </Button>
          ))}
          <Button variant="outline">
            <CirclePlus />
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between" />
    </Card>
  );
}
