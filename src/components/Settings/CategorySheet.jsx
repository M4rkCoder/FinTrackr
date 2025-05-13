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
import { Smile } from "lucide-react";

export default function CategorySheet({ open, onClose, onSave, category }) {
  const [subCategory, setSubCategory] = useState(category?.sub_category || "");
  const [emoji, setEmoji] = useState(category?.emoji || "💡");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setSubCategory(category?.sub_category);
    setEmoji(category?.emoji);
  }, [category]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="max-w-md">
        <div className="h-full overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle className="text-2xl">카테고리 수정</SheetTitle>
            <SheetDescription>
              {category?.types.type}・{category?.main_categories.main_category}
              ・{subCategory}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <Label htmlFor="category" className="text-lg font-semibold">
              카테고리 이름
            </Label>
            <Input
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              id="category"
              placeholder="수정할 이름을 입력하세요"
              className="!text-lg text-center mb-4"
            />
          </div>
          <div className="space-y-4" onWheel={(e) => e.stopPropagation()}>
            <Label className="text-lg font-semibold">아이콘</Label>
            <div
              className="border rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer text-4xl select-none hover:bg-gray-100"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {emoji || <Smile size={41} />}
              <span className="text-sm text-muted-foreground ml-2 mt-2">
                변경하려면 클릭!
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
                  id: category.id,
                  emoji,
                  sub_category: subCategory,
                })
              }
            >
              저장
            </Button>
            <Button variant="secondary">삭제</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
