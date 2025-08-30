import { useState } from "react";
import type { BudgetCategory } from "../../types";
import AddCategoryModal from "../../components/dashboard/AddCategoryModal";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Dummy data - in a real app this would come from your backend
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    {
      id: "1",
      name: "Food & Dining",
      budgeted: 500,
      spent: 320,
      color: "#3b82f6", // blue-500
    },
    {
      id: "2",
      name: "Transportation",
      budgeted: 200,
      spent: 179,
      color: "#f59e42", // orange-400
    },
    {
      id: "3",
      name: "Entertainment",
      budgeted: 150,
      spent: 75,
      color: "#a21caf", // purple-700
    },
    {
      id: "4",
      name: "Shopping",
      budgeted: 300,
      spent: 420,
      color: "#fbbf24", // yellow-400
    },
    {
      id: "5",
      name: "Utilities",
      budgeted: 250,
      spent: 245,
      color: "#06b6d4", // cyan-500
    },
    {
      id: "6",
      name: "Healthcare",
      budgeted: 100,
      spent: 45,
      color: "#22c55e", // green-500
    },
  ]);

  const totalBudgeted = budgetCategories.reduce(
    (sum, cat) => sum + cat.budgeted,
    0,
  );
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return "bg-error";
    if (percentage >= 75) return "bg-warning";
    return "bg-success";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddCategory = (newCategory: Omit<BudgetCategory, "id">) => {
    const category: BudgetCategory = {
      ...newCategory,
      id: Date.now().toString(), // Simple ID generation for demo
    };
    console.log(category);
    setBudgetCategories([...budgetCategories, category]);
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Budget Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat bg-base-200 rounded-lg [&:not(:last-child)]:border-r-0">
          <div className="stat-title">Total Budget</div>
          <div className="stat-value text-primary">
            {formatCurrency(totalBudgeted)}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg [&:not(:last-child)]:border-r-0">
          <div className="stat-title">Total Spent</div>
          <div className="stat-value text-secondary">
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg [&:not(:last-child)]:border-r-0">
          <div className="stat-title">Remaining</div>
          <div
            className={`stat-value ${remaining >= 0 ? "text-success" : "text-error"}`}
          >
            {formatCurrency(remaining)}
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-base-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Budget Categories</h2>
          <button
            className="btn btn-primary btn-circle btn-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const percentage = (category.spent / category.budgeted) * 100;
            const isOverBudget = category.spent > category.budgeted;

            return (
              <div key={category.id} className="bg-base-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-lg">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-base-content/70">
                      {formatCurrency(category.spent)} /{" "}
                      {formatCurrency(category.budgeted)}
                    </div>
                    <div
                      className={`font-semibold ${isOverBudget ? "text-error" : "text-base-content"}`}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-base-300 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(category.spent, category.budgeted)} transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                {/* Status Message */}
                {isOverBudget && (
                  <div className="text-error text-sm mt-2">
                    ⚠️ Over budget by{" "}
                    {formatCurrency(category.spent - category.budgeted)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
};

export default DashboardPage;
