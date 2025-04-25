import TransactionList from "../Components/TransactionList.jsx";
import "./monthly.css";

function IncomeExpense({ search }) {
  return (
    <section>
      <TransactionList {...search} filterValue="수입" />
      <TransactionList {...search} filterValue="고정 소비지출" />
      <TransactionList {...search} filterValue="비고정 소비지출" />
      <TransactionList {...search} filterValue="용돈 지출" />
    </section>
  );
}

export default IncomeExpense;
