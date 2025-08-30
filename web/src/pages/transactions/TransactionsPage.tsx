import { useState } from "react";
import type { Transaction, BudgetCategory, Vendor, Account } from "../../types";
import AddButton from "../../shared/ui/buttons/AddButton";
import { dummyCategories, dummyVendors, dummyAccounts, dummyTransactions } from "../../shared/ui/dummy";

const TransactionsPage = () => {
  // Dummy data - in a real app this would come from your backend
  const [categories] = useState<BudgetCategory[]>(dummyCategories);
  const [vendors] = useState<Vendor[]>(dummyVendors);
  const [accounts] = useState<Account[]>(dummyAccounts);
  const [transactions] = useState<Transaction[]>(dummyTransactions);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "description">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Helper functions to get related data
  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || "Unknown Category";
  };

  const getVendorName = (vendorId: number) => {
    return vendors.find(ven => ven.id === vendorId)?.name || "Unknown Vendor";
  };

  const getAccountName = (accountId: number) => {
    return accounts.find(acc => acc.id === accountId)?.name || "Unknown Account";
  };

  // Get unique categories for filtering
  const types = ["all", "expense", "income"];

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getVendorName(transaction.vendorId).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || transaction.categoryId === selectedCategory;
      const matchesType = selectedType === "all" || transaction.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case "description":
          comparison = a.description.localeCompare(b.description);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "income" ? "text-success" : "text-error";
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat bg-base-200 rounded-lg [&:not(:last-child)]:border-r-0">
          <div className="stat-title">Total Income</div>
          <div className="stat-value text-success">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg [&:not(:last-child)]:border-r-0">
          <div className="stat-title">Total Expenses</div>
          <div className="stat-value text-error">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg [&:not(:last-child)]:border-r-0">
          <div className="stat-title">Net Amount</div>
          <div className={`stat-value ${netAmount >= 0 ? "text-success" : "text-error"}`}>
            {formatCurrency(netAmount)}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-200 rounded-lg p-6 mb-6">
        {/* Mobile: Stacked layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); }}
            />
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value)); }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); }}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Sort By</span>
            </label>
            <div className="flex gap-2">
              <select
                className="select select-bordered flex-1"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as "date" | "amount" | "description"); }}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="description">Description</option>
              </select>
              <button
                className="btn btn-square btn-sm"
                onClick={() => { setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-base-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Transactions ({filteredTransactions.length})
          </h2>
          <AddButton />
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover">
                  <td className="font-medium">{formatDate(transaction.date)}</td>
                  <td>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.notes && (
                        <div className="text-sm text-base-content/70">{transaction.notes}</div>
                      )}
                    </div>
                  </td>
                  <td>{getVendorName(transaction.vendorId)}</td>
                  <td>
                    <div className="badge badge-outline">{getCategoryName(transaction.categoryId)}</div>
                  </td>
                  <td className={`font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${transaction.type === "income" ? "badge-success" : "badge-error"}`}>
                        {transaction.type}
                      </span>
                      {transaction.recurring && (
                        <span className="badge badge-info badge-sm">Recurring</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="btn btn-ghost btn-xs text-error">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card Layout */}
        <div className="lg:hidden space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-base-100 rounded-lg p-4 border border-base-300">
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{transaction.description}</h3>
                  <p className="text-base-content/70 text-sm">{getVendorName(transaction.vendorId)}</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-sm text-base-content/70">{formatDate(transaction.date)}</div>
                </div>
              </div>

              {/* Category and Type */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-outline">{getCategoryName(transaction.categoryId)}</span>
                <span className={`badge ${transaction.type === "income" ? "badge-success" : "badge-error"}`}>
                  {transaction.type}
                </span>
                {transaction.recurring && (
                  <span className="badge badge-info badge-sm">Recurring</span>
                )}
                <span className={`badge ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>

              {/* Notes */}
              {transaction.notes && (
                <p className="text-sm text-base-content/70 mb-3">{transaction.notes}</p>
              )}

              {/* Tags */}
              {transaction.tags && transaction.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {transaction.tags.map((tag, index) => (
                    <span key={index} className="badge badge-neutral badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Account Info */}
              {transaction.accountId && (
                <div className="text-xs text-base-content/50 mb-3">
                  Account: {getAccountName(transaction.accountId)}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
                <button className="btn btn-ghost btn-xs" onClick={() => {}}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button className="btn btn-ghost btn-xs text-error" onClick={() => {}}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">No transactions found</p>
            <p className="text-sm">Try adjusting your filters or add a new transaction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
