import { useEffect, useState } from "react";
import Transaction from "./Transaction";
import useDataRead from "../utils/useDataRead";

export default function TransactionList({
  year,
  month,
  filterType = "*",
  filterValue = "*",
}) {
  const {
    data: transactions,
    totalAmount,
    loading,
    error,
  } = useDataRead(year, month, filterType, filterValue);

  if (loading) return <div className="p-4">⏳ 로딩 중...</div>;
  if (error) return <div className="p-4">❌ 오류 발생: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">
        📜 {year}년 {month}월{" "}
        {filterType === "*" ? "전체" : `${filterType}: ${filterValue}`} 목록
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-black">날짜</th>
            <th className="border border-gray-300 p-2 text-black">분류</th>
            <th className="border border-gray-300 p-2 text-black">금액</th>
            <th className="border border-gray-300 p-2 text-black">내역</th>
            <th className="border border-gray-300 p-2 text-black">비고</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            <Transaction transactions={transactions} />
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-2">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td
              colSpan="4"
              className="border border-gray-300 p-2 text-right font-bold text-black"
            >
              합계
            </td>
            <td className="border border-gray-300 p-2 text-black">
              {totalAmount.toLocaleString()}원
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
