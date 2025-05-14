import { useState } from "react";
import { supabase } from "./supabase.js";

export default function useSupabase(tableName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData({
    filters = {},
    select = "*",
    orderBy = null,
    table = tableName, // 기본값을 기존 tableName으로
  }) {
    setLoading(true);
    let query = supabase.from(table).select(select);

    const { dateRange, ...restFilters } = filters;

    for (const [column, value] of Object.entries(restFilters)) {
      if (Array.isArray(value)) {
        query = query.in(column, value);
      } else {
        query = query.eq(column, value);
      }
    }

    if (dateRange?.from) {
      query = query.gte("date", dateRange.from);
    }
    if (dateRange?.to) {
      query = query.lte("date", dateRange.to);
    }

    if (["transactions", "monthly_transaction"].includes(tableName)) {
      query = query.order("date", { ascending: true });
    }

    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending });
    }
    try {
      const { data, error } = await query;
      if (error) throw error;
      setData(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
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
    if (!error && Array.isArray(data) && data.length > 0) {
      const updatedItem = data[0];
      setData(
        (prev) =>
          prev?.map((item) => (item.id === id ? updatedItem : item)) || null
      );
    }
    return { data, error };
  }

  async function remove(ids) {
    if (!Array.isArray(ids)) ids = [ids];

    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .in("id", ids)
      .select();

    if (data) {
      setData((prev) => prev?.filter((item) => !ids.includes(item.id)) || null);
    }

    return { data, error };
  }

  return {
    data,
    loading,
    error,
    fetchData,
    create,
    update,
    remove,
  };
}
