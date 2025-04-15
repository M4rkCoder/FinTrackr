import TransactionList from "./Components/TransactionList.jsx";
import Summary from "./Components/Summary.jsx";
import "./monthly.css";

function Monthly() {
  const search = {
    year: 2024,
    month: 1,
    filterType: "main_category",
    filterValue: "*",
  };
  return (
    <section className="main-section">
      <h1 className="main-title">
        {search.year}년 {search.month}월 수입&지출 내역
      </h1>
      <Summary {...search} />
      <TransactionList {...search} filterValue="수입" />
      <TransactionList {...search} filterValue="고정 소비지출" />
      <TransactionList {...search} filterValue="비고정 소비지출" />
      <TransactionList {...search} filterValue="용돈 지출" />
    </section>
  );
}

export default Monthly;
