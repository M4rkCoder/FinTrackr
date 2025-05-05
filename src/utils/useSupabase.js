import { useState } from "react";
import { supabase } from "./supabase.js";

export default function useSupabase(tableName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchAll() {
    setLoading(true);
    const { data, error } = await supabase.from(tableName).select("*");
    setData(data);
    setError(error);
    setLoading(false);
  }

  async function create(newItem) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(newItem)
      .select();
    if (data) {
      setData((prev) => [...(prev || []), ...data]);
    }
    return { data, error };
  }

  async function update(id, updates) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq("id", id)
      .select();
    if (data) {
      setData(
        (prev) =>
          prev?.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ) || null
      );
    }
    return { data, error };
  }

  async function remove(id) {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select();
    if (data) {
      setData((prev) => prev?.filter((item) => item.id !== id) || null);
    }
    return { data, error };
  }

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}
