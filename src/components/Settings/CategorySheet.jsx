import { useState, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SmilePlus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function CategorySheet({
  open,
  onClose,
  onSave,
  category = null,
  selectedType,
  handleRemove,
}) {
  const [selectedTypeId, setSelectedTypeId] = useState(
    category?.type_id?.toString() || selectedType.toString()
  );
  const [subCategory, setSubCategory] = useState(category?.sub_category || "");
  const [emoji, setEmoji] = useState(category?.emoji || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setSelectedTypeId(category?.type_id?.toString());
      setSubCategory(category?.sub_category);
      setEmoji(category?.emoji);
    }
  }, [category]);

  const types = [
    { id: 1, name: "수입", icon: ArrowUpCircle },
    { id: 2, name: "지출", icon: ArrowDownCircle },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="max-w-md">
        <div className="h-full overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              카테고리 {category ? "수정" : "입력"}
            </SheetTitle>
            <SheetDescription>
              {/* {types[selectedTypeId - 1].name}・{subCategory} */}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <ToggleGroup
              type="single"
              value={selectedTypeId}
              onValueChange={(v) => v && setSelectedTypeId(v)}
              className="grid grid-cols-2 gap-3 w-full max-w-[400px] mx-auto"
            >
              {types.map((type) => {
                const Icon = type.icon;
                return (
                  <ToggleGroupItem
                    key={type.id}
                    value={String(type.id)}
                    className="flex flex-col items-center justify-center gap-2 px-2 py-2 rounded min-h-[80px] text-lg border border-gray-300"
                  >
                    <Icon className="!w-7 !h-7 shrink-0" />
                    {/* 아이콘 컴포넌트를 직접 렌더링 */}
                    <span className="text-base font-semibold">{type.name}</span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            <Label htmlFor="category" className="text-lg font-semibold">
              카테고리 이름
            </Label>
            <Input
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              id="category"
              placeholder={
                category
                  ? "수정할 이름을 입력하세요"
                  : "카테고리 이름을 입력하세요"
              }
              className="!text-lg text-center mb-4"
            />
          </div>
          <div className="space-y-4" onWheel={(e) => e.stopPropagation()}>
            <Label className="text-lg font-semibold">아이콘</Label>
            <div
              className="border rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer text-4xl select-none hover:bg-gray-100"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {emoji || <SmilePlus size={41} color="gray" />}
              <span className="text-sm text-muted-foreground ml-2 mt-2">
                {category ? "변경하려면 클릭!" : "입력하려면 클릭!"}
              </span>
            </div>
            {showEmojiPicker && (
              <Picker
                data={data}
                onEmojiSelect={(e) => {
                  setEmoji(e.native);
                  setShowEmojiPicker(false);
                }}
                locale="ko"
              />
            )}
          </div>
          <SheetFooter className="pt-4">
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={() =>
                onSave({
                  id: category ? category.id : undefined,
                  type_id: parseInt(selectedTypeId, 10),
                  emoji,
                  sub_category: subCategory,
                })
              }
            >
              저장
            </Button>
            {category && (
              <Button
                variant="destructive"
                onClick={() => handleRemove(category.id)}
              >
                삭제
              </Button>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
