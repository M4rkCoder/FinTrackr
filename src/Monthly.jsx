import TransactionList from "./Components/TransactionList.jsx";
import MonthlySummary from "./Components/MonthlySummary.jsx";
import "./monthly.css";

function Monthly({ ...search }) {
  return (
    <section className="main-section">
      <TransactionList {...search} filterValue="수입" />
      <TransactionList {...search} filterValue="고정 소비지출" />
      <TransactionList {...search} filterValue="비고정 소비지출" />
      <TransactionList {...search} filterValue="용돈 지출" />
    </section>
  );
}

export default Monthly;
