import { useState, useEffect } from "react";
// import EmojiPicker from "emoji-picker-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

export default function EditCategoryModal({ open, onClose, onSave, category }) {
  const [subCategory, setSubCategory] = useState(category?.sub_category || "");
  const [emoji, setEmoji] = useState(category?.emoji || "💡");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setSubCategory(category?.sub_category);
    setEmoji(category?.emoji);
  }, [category]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>카테고리 수정</DialogTitle>
          <DialogDescription>
            {category?.types.type}・{category?.main_categories.main_category}・
            {subCategory}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Label htmlFor="category" className="text-lg font-semibold">
            카테고리 이름
          </Label>
          <Input
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            id="category"
            placeholder="수정할 이름을 입력하세요"
            className="!text-lg text-center"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-lg font-semibold">아이콘</Label>
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <div
                className="border rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer text-4xl select-none hover:bg-gray-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {emoji || <Smile size={41} />}
                <span className="text-sm text-muted-foreground ml-2 mt-2">
                  변경하려면 클릭!
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-full"
              onWheel={(e) => e.stopPropagation()}
            >
              <Picker
                data={data}
                onEmojiSelect={(e) => {
                  setEmoji(e.native);
                  setShowEmojiPicker(false);
                }}
                locale="ko"
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter className="pt-4">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
