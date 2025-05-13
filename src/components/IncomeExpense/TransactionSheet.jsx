import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  ChartNoAxesCombined,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabase.js";
import useSupabase from "@/utils/useSupabase.js";

const formSchema = z.object({
  date: z.coerce.date({ message: "날짜를 선택해주세요" }),
  category: z.object({
    sub_category: z.string().min(1, "카테고리를 선택해주세요"),
    id: z.string().min(1, "카테고리 ID 오류"),
  }),
  amount: z.string().min(1, "금액을 입력해주세요"),
  description: z.string().optional(),
  remarks: z.string().optional(),
});

const defaultValues = {
  date: new Date().toISOString().split("T")[0],
  category: { sub_category: "", id: "" },
  amount: "",
  description: "",
  remarks: "",
};

export default function TransactionSheet({
  open,
  onOpenChange,
  editRow = null,
  onAddOrUpdate,
  update,
}) {
  const [formattedAmount, setFormattedAmount] = useState("");
  const { data: categories, fetchData } = useSupabase("categories");
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedType, setSelectedType] = useState("지출");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    fetchData({
      select: `id, sub_category, emoji, main_categories(id, main_category), types(id, type)`,
    });
  }, []);

  useEffect(() => {
    if (open && editRow) {
      form.reset({
        date: new Date(editRow.date).toISOString().split("T")[0],
        category: {
          sub_category: editRow.sub_category,
          id: editRow.category_id,
        },
        amount: String(editRow.amount),
        description: editRow.description || "",
        remarks: editRow.remarks || "",
      });
      setFormattedAmount(Number(editRow.amount).toLocaleString());
    }
  }, [open, editRow, form]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setFormattedAmount("");
    }
  }, [open]);

  const onSubmit = async (data) => {
    const payload = {
      date: data.date,
      category_id: data.category.id,
      amount: Number(data.amount.replace(/,/g, "")),
      description: data.description || null,
      remarks: data.remarks || null,
    };

    let error = null;

    if (editRow) {
      const id = editRow.id;
      const res = await update(id, payload);
      error = res?.error;
    } else {
      const res = await supabase.from("transactions").insert([payload]);
      error = res?.error;
    }

    if (error) {
      console.error("저장 실패:", error);
      alert("가계부 입력 오류");
      return;
    }

    alert(editRow ? "수정 완료" : "저장 완료");
    onAddOrUpdate?.();
    onOpenChange(false);
  };

  // const handleClose = () => {
  //   form.reset(defaultValues);
  //   setFormattedAmount("");
  //   onOpenChange(false);
  // };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {editRow ? "가계부 수정" : "가계부 기록"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              가계부를 입력하거나 수정합니다.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              {/* ── 1. Type 선택 (ToggleGroup) ── */}
              <ToggleGroup
                type="single"
                value={selectedType}
                onValueChange={(v) => v && setSelectedType(v)}
                className="grid grid-cols-3 gap-3 w-full max-w-[400px] mx-auto"
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
                      className="flex flex-col items-center justify-center gap-2 px-2 py-2 rounded min-h-[80px] text-lg border border-gray-300"
                    >
                      <Icon className="!w-7 !h-7 shrink-0" />
                      {/* 아이콘 컴포넌트를 직접 렌더링 */}
                      <span className="text-base font-semibold">{type.id}</span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
              {/* 카테고리 */}
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      카테고리
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setShowCategoryList((prev) => !prev)}
                        >
                          {field.value?.sub_category
                            ? `${
                                categories.find(
                                  (cat) =>
                                    cat.sub_category ===
                                    field.value.sub_category
                                )?.emoji || ""
                              } ${field.value.sub_category}`
                            : "카테고리를 선택하세요"}
                        </Button>

                        {showCategoryList && (
                          <div className="absolute top-full mt-2 z-50 w-full bg-white border rounded-md shadow-md max-h-60 ">
                            <Command>
                              <CommandInput placeholder="카테고리 검색..." />
                              <CommandList>
                                <CommandEmpty>
                                  해당 카테고리가 없습니다.
                                </CommandEmpty>
                                {categories.map((cat) => (
                                  <CommandItem
                                    key={cat.id}
                                    onSelect={() => {
                                      field.onChange({
                                        sub_category: cat.sub_category,
                                        id: cat.id,
                                      });
                                      setShowCategoryList(false);
                                    }}
                                    className="flex flex-col items-start px-3 py-2 hover:bg-muted cursor-pointer"
                                  >
                                    <span className="font-medium">
                                      {cat.emoji || ""} {cat.sub_category}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {cat.types?.type}・
                                      {cat.main_categories?.main_category}
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between mx-auto">
                {/* 날짜 */}
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        날짜
                      </FormLabel>
                      <FormControl>
                        <div>
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 금액 */}
                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        금액
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="예: 12000"
                          value={formattedAmount}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            setFormattedAmount(Number(raw).toLocaleString());
                            field.onChange(raw);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* 내역 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      내역
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="예: 점심식사, 택시요금" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 메모 */}
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      메모
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="선택 사항" rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mb-5">
                {editRow ? "수정하기" : "저장하기"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
