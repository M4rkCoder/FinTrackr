import ShowTable from "./Components/ShowTable";
import CreateForm from "./Components/CreateForm";
import Box from "@mui/material/Box";
import "./App.css";

function App() {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: "100%", p: 2 }}
    >
      <ShowTable />
      <CreateForm />
    </Box>
  );
}

export default App;
