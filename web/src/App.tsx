import { Route, Routes } from "react-router";
import NavBar from "./shared/ui/NavBar";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import AccountsPage from "./pages/accounts/AccountsPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import TagsPage from "./pages/tags/TagsPage";
import VendorsPage from "./pages/vendors/VendorsPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/query/queryClient";

function App() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <NavBar />
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route index Component={CategoriesPage} />
            <Route path="transactions" Component={TransactionsPage} />
            <Route path="accounts" Component={AccountsPage} />
            <Route path="tags" Component={TagsPage} />
            <Route path="vendors" Component={VendorsPage} />
          </Routes>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
