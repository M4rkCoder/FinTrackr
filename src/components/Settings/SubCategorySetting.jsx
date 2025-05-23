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
import { useSupabaseMutation } from "@/utils/useSupabaseMutation";
import CategorySheet from "./CategorySheet";

export default function SubCategorySetting({
  categories,
  typeId,
  loading,
  fetchData,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { create, update, remove } = useSupabaseMutation("categories", [
    "supabase",
    "categories",
    typeId,
  ]);

  // type별 category 필터
  const filteredCategories = categories.filter(
    (item) => item.type_id === typeId
  );

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };
  let error = null;
  const handleSave = async (payload) => {
    if (payload.id) {
      const res = await update.mutateAsync({
        id: payload.id,
        updates: payload,
      });
      error = res?.error;
    } else {
      const res = await create.mutateAsync(payload);
      error = res?.error;
    }

    if (error) {
      console.error("저장 실패:", error);
      alert("입력 오류");
      return;
    }
    const alertMsg = payload.id ? "수정 완료" : "입력 완료";
    fetchData();
    alert(alertMsg);
    setModalOpen(false);
  };

  const handleRemove = async (id) => {
    if (id) {
      const res = await remove.mutateAsync(id);
      error = res?.error;
    }

    if (error) {
      console.error("삭제 실패", error);
      alert("삭제 오류");
      return;
    }
    fetchData();
    alert("삭제 완료");
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
        <Button
          variant="secondary"
          className="text-lg flex flex-col p-12"
          onClick={setModalOpen}
        >
          <CirclePlus size={50} className="scale-[2.3] my-2" />
          <span className="text-lg">추가</span>
        </Button>
      </div>
      <CategorySheet
        open={modalOpen}
        onClose={() => {
          setSelectedCategory(null);
          setModalOpen(false);
        }}
        onSave={handleSave}
        category={selectedCategory}
        selectedType={typeId}
        handleRemove={handleRemove}
      />
    </>
  );
}
