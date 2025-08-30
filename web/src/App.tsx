import { Route, Routes } from "react-router";
import NavBar from "./shared/ui/NavBar";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TransactionsPage from "./pages/transactions/TransactionsPage";

function App() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <NavBar />
        <Routes>
          <Route index Component={DashboardPage} />
          <Route path="transactions" Component={TransactionsPage} />
        </Routes>
      </div>
    </>
  );
}

export default App;
