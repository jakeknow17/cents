import { useState } from "react";
import { useEffect } from "react";
import {
  useTransactions,
  useTransaction,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useAccounts,
  useCategories,
  useTags,
  useVendors,
} from "../../shared/query/hooks";
import type { Transaction, TransactionRequest } from "../../types/budget";

const TransactionsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newTransactionRequest, setNewTransactionRequest] =
    useState<TransactionRequest>({
      date: "",
      amount: 0,
      type: "EXPENSE" as "EXPENSE" | "INCOME",
      description: "",
      notes: "",
      tagsIds: [],
      categoryId: undefined,
      vendorId: undefined,
      accountId: undefined,
    });
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionRequest | null>(null);

  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const { data: transaction, isLoading: transactionLoading } = useTransaction(
    selectedId || 0,
  );
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data: vendors } = useVendors();

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  useEffect(() => {
    console.log("transactions", transactions);
  }, [transactions]);

  const handleCreate = () => {
    createTransaction.mutate(newTransactionRequest);
    setNewTransactionRequest({
      date: "",
      amount: 0,
      type: "EXPENSE",
      description: "",
      notes: "",
      tagsIds: [],
      categoryId: undefined,
      vendorId: undefined,
      accountId: undefined,
    });
  };

  const handleUpdate = () => {
    if (transaction && editingTransaction) {
      updateTransaction.mutate({
        id: transaction.id,
        transactionRequest: editingTransaction,
      });
      setEditingTransaction(null);
    }
  };

  const handleEdit = (tx: Transaction | undefined) => {
    if (tx) {
      console.log("Editing transaction:", tx);
      const editRequest: TransactionRequest = {
        date: tx.date,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        notes: tx.notes ?? "",
        tagsIds: tx.tags.map((tag) => tag.id),
        categoryId: tx.category?.id,
        vendorId: tx.vendor?.id,
        accountId: tx.account?.id,
      };
      setEditingTransaction(editRequest);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDelete = (id: number) => {
    deleteTransaction.mutate(id);
  };

  const handleTagToggle = (tagId: number) => {
    console.log(
      "Toggling tag:",
      tagId,
      "Current tagsIds:",
      newTransactionRequest.tagsIds,
    );
    setNewTransactionRequest((prev) => ({
      ...prev,
      tagsIds: prev.tagsIds.includes(tagId)
        ? prev.tagsIds.filter((id) => id !== tagId)
        : [...prev.tagsIds, tagId],
    }));
  };

  const handleEditTagToggle = (tagId: number) => {
    console.log(
      "Toggling edit tag:",
      tagId,
      "Current editingTransaction:",
      editingTransaction,
    );
    if (editingTransaction) {
      setEditingTransaction((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tagsIds: prev.tagsIds.includes(tagId)
            ? prev.tagsIds.filter((id) => id !== tagId)
            : [...prev.tagsIds, tagId],
        };
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Transactions</h1>
        <p className="text-base-content/70">Track your income and expenses</p>
      </div>

      {/* Create Transaction Form */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Create New Transaction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={newTransactionRequest.date}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    date: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={newTransactionRequest.amount}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    amount: Number(e.target.value),
                  });
                }}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                value={newTransactionRequest.type}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    type: e.target.value as "EXPENSE" | "INCOME",
                  });
                }}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newTransactionRequest.description}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    description: e.target.value,
                  });
                }}
                placeholder="Enter transaction description"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={newTransactionRequest.categoryId || ""}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    categoryId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  });
                }}
              >
                <option value="">No category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Vendor</span>
              </label>
              <select
                className="select select-bordered"
                value={newTransactionRequest.vendorId || ""}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    vendorId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  });
                }}
              >
                <option value="">No vendor</option>
                {vendors?.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Account</span>
              </label>
              <select
                className="select select-bordered"
                value={newTransactionRequest.accountId || ""}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    accountId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  });
                }}
              >
                <option value="">No account</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Notes (Optional)</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newTransactionRequest.notes || ""}
                onChange={(e) => {
                  setNewTransactionRequest({
                    ...newTransactionRequest,
                    notes: e.target.value,
                  });
                }}
                placeholder="Additional notes"
              />
            </div>
          </div>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Tags</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  console.log(
                    "Rendering tag:",
                    tag,
                    "Current tagsIds:",
                    newTransactionRequest.tagsIds,
                  );
                  return (
                    <div key={tag.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={newTransactionRequest.tagsIds.includes(tag.id)}
                        onChange={() => {
                          handleTagToggle(tag.id);
                        }}
                      />
                      <span
                        className="badge badge-outline cursor-pointer"
                        onClick={() => {
                          handleTagToggle(tag.id);
                        }}
                      >
                        {tag.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="form-control mt-6">
            <button
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={
                createTransaction.isPending ||
                !newTransactionRequest.date ||
                !newTransactionRequest.description.trim()
              }
            >
              {createTransaction.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                "Create Transaction"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transactions List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">All Transactions</h2>
            {transactionsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions?.map((t) => (
                  <div key={t.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{t.description}</h3>
                            <span
                              className={`badge ${t.type === "INCOME" ? "badge-success" : "badge-error"}`}
                            >
                              {t.type}
                            </span>
                          </div>
                          <p className="text-sm text-base-content/70">
                            {t.date} • ${t.amount.toFixed(2)}
                          </p>
                          {t.notes && (
                            <p className="text-xs text-base-content/50 mt-1">
                              {t.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setSelectedId(t.id);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              handleEdit(t);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              handleDelete(t.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {transactions?.length === 0 && (
                  <div className="text-center py-8 text-base-content/50">
                    No transactions found. Create your first transaction above.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Transaction Details */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Transaction Details</h2>
            {selectedId ? (
              transactionLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : transaction ? (
                <div className="space-y-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Transaction ID</div>
                      <div className="stat-value text-primary">
                        {transaction.id}
                      </div>
                    </div>
                  </div>

                  {editingTransaction ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Date</span>
                          </label>
                          <input
                            type="date"
                            className="input input-bordered"
                            value={editingTransaction.date}
                            onChange={(e) => {
                              setEditingTransaction((prev) =>
                                prev ? { ...prev, date: e.target.value } : null,
                              );
                            }}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Amount</span>
                          </label>
                          <input
                            type="number"
                            className="input input-bordered"
                            value={editingTransaction.amount}
                            onChange={(e) => {
                              setEditingTransaction((prev) =>
                                prev
                                  ? { ...prev, amount: Number(e.target.value) }
                                  : null,
                              );
                            }}
                            step="0.01"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Type</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={editingTransaction.type}
                            onChange={(e) => {
                              setEditingTransaction((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      type: e.target.value as
                                        | "EXPENSE"
                                        | "INCOME",
                                    }
                                  : null,
                              );
                            }}
                          >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Category</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={editingTransaction.categoryId || ""}
                            onChange={(e) => {
                              setEditingTransaction((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      categoryId: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    }
                                  : null,
                              );
                            }}
                          >
                            <option value="">No category</option>
                            {categories?.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Vendor</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={editingTransaction.vendorId || ""}
                            onChange={(e) => {
                              setEditingTransaction((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      vendorId: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    }
                                  : null,
                              );
                            }}
                          >
                            <option value="">No vendor</option>
                            {vendors?.map((vendor) => (
                              <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Account</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={editingTransaction.accountId || ""}
                            onChange={(e) => {
                              setEditingTransaction((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      accountId: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    }
                                  : null,
                              );
                            }}
                          >
                            <option value="">No account</option>
                            {accounts?.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Description</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={editingTransaction.description}
                          onChange={(e) => {
                            setEditingTransaction((prev) =>
                              prev
                                ? { ...prev, description: e.target.value }
                                : null,
                            );
                          }}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Notes (Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={editingTransaction.notes || ""}
                          onChange={(e) => {
                            setEditingTransaction((prev) =>
                              prev ? { ...prev, notes: e.target.value } : null,
                            );
                          }}
                        />
                      </div>

                      {/* Tags Section */}
                      {tags && tags.length > 0 && (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Tags</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <div
                                key={tag.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm"
                                  checked={editingTransaction.tagsIds.includes(
                                    tag.id,
                                  )}
                                  onChange={() => {
                                    handleEditTagToggle(tag.id);
                                  }}
                                />
                                <span
                                  className="badge badge-outline cursor-pointer"
                                  onClick={() => {
                                    handleEditTagToggle(tag.id);
                                  }}
                                >
                                  {tag.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={handleUpdate}
                          disabled={updateTransaction.isPending}
                        >
                          {updateTransaction.isPending ? (
                            <>
                              <span className="loading loading-spinner loading-sm"></span>
                              Updating...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Date</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={transaction.date}
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Amount
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={`$${transaction.amount.toFixed(2)}`}
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Type</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`badge ${transaction.type === "INCOME" ? "badge-success" : "badge-error"}`}
                          >
                            {transaction.type}
                          </span>
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Description
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={transaction.description}
                          readOnly
                        />
                      </div>
                      {transaction.notes && (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">
                              Notes
                            </span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={transaction.notes}
                            readOnly
                          />
                        </div>
                      )}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Category
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={
                            transaction.category?.id
                              ? `Category ID: ${transaction.category.id.toString()}`
                              : "No category"
                          }
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Vendor
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={
                            transaction.vendor?.id
                              ? `Vendor ID: ${transaction.vendor.id.toString()}`
                              : "No vendor"
                          }
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Account
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={
                            transaction.account?.id
                              ? `Account ID: ${transaction.account.id.toString()}`
                              : "No account"
                          }
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Tags</span>
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {transaction.tags.length > 0 ? (
                            transaction.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="badge badge-outline"
                              >
                                Tag ID: {tag.id}
                                Tag Name: {tag.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-base-content/50">
                              No tags
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-error">
                  <span>Transaction not found</span>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-base-content/50">
                Select a transaction to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
