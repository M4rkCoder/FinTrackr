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
import { CirclePlus, SmilePlus } from "lucide-react";
import useSupabase from "@/utils/useSupabase.js";
import CategorySheet from "./CategorySheet";

export default function SubCategorySetting({
  categories,
  typeId,
  loading,
  fetchData,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { update } = useSupabase("categories");

  // type별 category 필터
  const filteredCategories = categories.filter(
    (item) => item.type_id === typeId
  );

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
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

    fetchData();
    alert("수정 완료");
    setModalOpen(false);
  };
  if (loading) return <p>로딩 중...</p>;
  return (
    <>
      <div className="grid grid-cols-5 gap-4 mt-10">
        {filteredCategories.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => handleEdit(item)}
            className="flex flex-col justify-items-center p-12"
          >
            <span className="text-3xl">
              {item.emoji || (
                <SmilePlus
                  color="gray"
                  size={50}
                  className="scale-[2.3] my-2"
                />
              )}
            </span>
            <span className="text-lg">{item.sub_category}</span>
          </Button>
        ))}
        <Button variant="secondary" className="text-lg flex flex-col p-12">
          <CirclePlus size={50} className="scale-[2.3] my-2" />
          <span className="text-lg">추가</span>
        </Button>
      </div>
      <CategorySheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        selectedType={typeId}
      />
    </>
  );
}
