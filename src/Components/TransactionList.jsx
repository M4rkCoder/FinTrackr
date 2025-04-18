import { useState } from "react";
import Transaction from "./Transaction";
import useDataRead from "../utils/useDataRead";
import "./TransactionList.css";

export default function TransactionList({
  year,
  month,
  filterType = "*",
  filterValue = "*",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useDataRead(
    year,
    month,
    filterType,
    filterValue
  );

  if (loading) return <div>⏳ 로딩 중...</div>;
  if (error) return <div>❌ 오류 발생: {error}</div>;

  return (
    <section>
      <div className="table-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>{filterValue}</h2>
      </div>
      <div className={`table-container ${isOpen ? "open" : "closed"}`}>
        <table>
          <thead>
            <tr>
              <th>분류</th>
              <th>금액</th>
              <th>내역</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              <Transaction transactions={data} />
            ) : (
              <tr>
                <td colSpan="6">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
