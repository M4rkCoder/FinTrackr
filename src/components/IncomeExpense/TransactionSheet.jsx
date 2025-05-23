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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "../ui/date-input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAccountStore } from "@/stores/useAccountStore";
import { useSupabaseQuery } from "@/utils/useSupabaseQuery";

const formSchema = z
  .object({
    date: z.coerce.date({ message: "날짜를 선택해주세요" }),
    category: z.object({
      sub_category: z.string().min(1, "카테고리를 선택해주세요"),
      id: z.string().min(1, "카테고리 ID 오류"),
    }),
    amount: z.string().min(1, "금액을 입력해주세요"),
    description: z.string().optional(),
    remarks: z.string().optional(),
  })
  .refine((data) => data.category.sub_category && data.category.id, {
    message: "카테고리를 선택해주세요",
    path: ["category"],
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
  create,
  onRemove,
}) {
  const [formattedAmount, setFormattedAmount] = useState("");
  const { data: categories } = useSupabaseQuery({
    table: "categories",
  });
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedType, setSelectedType] = useState(2);
  const user = useAuthStore((state) => state.user);
  const account = useAccountStore((state) => state.account);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  //  useEffect(() => {
  //    fetchData();
  //  }, []);

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

  useEffect(() => {
    form.setValue("category", defaultValues.category);
  }, [selectedType]);

  const onSubmit = async (data) => {
    const payload = {
      user_id: user.id,
      account_id: account.id,
      date: format(data.date, "yyyy-MM-dd"),
      category_id: data.category.id,
      amount: Number(data.amount.replace(/,/g, "")),
      description: data.description || null,
      remarks: data.remarks || null,
    };
    console.log(form.formState.errors);
    let error = null;

    if (editRow) {
      const id = editRow.id;
      const res = await update.mutateAsync({ id, updates: payload });
      error = res?.error;
    } else {
      const res = await create.mutateAsync(payload);
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
  // console.log(categories);
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
                variant="black"
                onValueChange={(v) => v && setSelectedType(v)}
                className="flex flex-row gap-5 w-4/5 max-w-[400px] mx-auto"
              >
                {[
                  { id: 1, name: "수입", icon: ArrowUpCircle },
                  { id: 2, name: "지출", icon: ArrowDownCircle },
                ].map((type, index, array) => {
                  const Icon = type.icon;
                  const isFirst = index === 0;
                  const isLast = index === array.length - 1;
                  return (
                    <ToggleGroupItem
                      key={type.id}
                      value={type.id}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 px-2 py-2 min-h-[80px] text-lg border border-gray-300",
                        isFirst && "rounded-r-md",
                        isLast && "rounded-l-md"
                      )}
                    >
                      <Icon className="!w-7 !h-7 shrink-0" />
                      {/* 아이콘 컴포넌트를 직접 렌더링 */}
                      <span className="text-base font-semibold">
                        {type.name}
                      </span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
              {/* 카테고리 */}
              <FormField
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
                          className={cn(
                            "w-full justify-center text-lg",
                            !field.value?.sub_category &&
                              "text-sm text-muted-foreground/80"
                          )}
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
                                {categories
                                  .filter((cat) => cat.type_id === selectedType)
                                  .map((cat) => (
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
                                      {/* <span className="text-xs text-muted-foreground">
                                        {cat.type_id}
                                      </span> */}
                                    </CommandItem>
                                  ))}
                              </CommandList>
                            </Command>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 min-h-[20px]" />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between mx-auto">
                <div className="flex flex-col justify-start">
                  {/* 날짜 */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-lg font-semibold">
                          날짜
                        </FormLabel>
                        <FormControl>
                          <DateInput {...field} showCalendar={true} />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500 min-h-[20px]" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* 금액 */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
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

                      <FormMessage className="text-sm text-red-500 min-h-[20px]" />
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

              <Button type="submit" className="w-full mb-2">
                {editRow ? "수정하기" : "저장하기"}
              </Button>
            </form>
          </Form>
          {editRow && (
            <Button
              variant="destructive"
              onClick={() => {
                onRemove(editRow.id);
                onOpenChange(false);
              }}
              className="w-full mb-5"
            >
              삭제하기
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
