import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

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

export default function TransactionModal({ open, onOpenChange, onAdd }) {
  const [categories, setCategories] = useState([]);
  const [formattedAmount, setFormattedAmount] = useState("");

  useEffect(() => {
    supabase
      .from("categories")
      .select(
        `id, sub_category, emoji, main_categories(id, main_category), types(id, type) `
      )
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: { sub_category: "", id: "" },
      amount: "",
      description: "",
      remarks: "",
    },
  });

  const onSubmit = async (data) => {
    const { date, category, amount, description, remarks } = data;
    const { error } = await supabase.from("transactions").insert([
      {
        date: date,
        category_id: category.id,
        amount: Number(amount.replace(/,/g, "")),
        description: description || null,
        remarks: remarks || null,
      },
    ]);

    if (error) {
      console.error("업로드 실패:", error);
      alert("가계부 입력 오류");
      return;
    } else {
      if (onAdd) {
        onAdd();
      }
      alert("가계부 입력 완료");
      form.reset();
      setFormattedAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>💸 가계부 기록하기</DialogTitle>
          <DialogDescription className="sr-only">
            가계부를 입력하는 창입니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* 날짜 */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>날짜</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 카테고리 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          readOnly
                          value={
                            field.value
                              ? `${
                                  categories.find(
                                    (cat) =>
                                      cat.sub_category ===
                                      field.value.sub_category
                                  )?.emoji || " "
                                } ${field.value.sub_category}`
                              : ""
                          }
                          className="cursor-pointer w-full"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command
                        className="max-h-60 overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <CommandInput
                          placeholder="카테고리 검색..."
                          className=""
                        />
                        <CommandList>
                          <CommandEmpty>해당 카테고리가 없습니다.</CommandEmpty>
                          {categories.map((cat) => (
                            <CommandItem
                              key={cat.id}
                              onSelect={() => {
                                field.onChange({
                                  sub_category: cat.sub_category,
                                  id: cat.id,
                                });
                              }}
                              className="flex items-center gap-2"
                            >
                              <span>{cat.emoji || " "}</span>
                              <div className="flex flex-col text-left">
                                <span className="font-medium">
                                  {cat.sub_category}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {cat.types?.type}・
                                  {cat.main_categories?.main_category}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 금액 */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>금액</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="예: 12000"
                      value={formattedAmount}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, "");
                        const formatted = Number(rawValue).toLocaleString();
                        setFormattedAmount(formatted);
                        field.onChange(rawValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 내역 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내역</FormLabel>
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
                  <FormLabel>메모</FormLabel>
                  <FormControl>
                    <Textarea placeholder="선택 사항" rows={2} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              저장하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
