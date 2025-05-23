import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export function useSupabaseMutation(table, invalidateKeys) {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (newItem) => {
      const { data, error } = await supabase
        .from(table)
        .insert(newItem)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq("id", id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
  });

  const remove = useMutation({
    mutationFn: async (ids) => {
      if (!Array.isArray(ids)) ids = [ids];
      const { data, error } = await supabase
        .from(table)
        .delete()
        .in("id", ids)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
  });

  return { create, update, remove };
}
