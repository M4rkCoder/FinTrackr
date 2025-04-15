import Monthly from "./Monthly.jsx";
import "./App.css";

function App() {
  const search = {
    year: 2024,
    month: 1,
    filterType: "main_category",
    filterValue: "*",
  };
  return (
    <section id="main">
      <Monthly {...search} />
    </section>
  );
}

export default App;
