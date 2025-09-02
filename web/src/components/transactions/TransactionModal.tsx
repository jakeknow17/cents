import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Transaction } from "../../types";
import { dummyVendors, dummyCategories, dummyAccounts } from "../../shared/ui/dummy";

interface FormData {
  description: string;
  vendorId: string;
  categoryId: string;
  amount: string;
  date: string;
  type: 'expense' | 'income';
  notes: string;
  tags: string;
  accountId: string;
  recurring: boolean;
  status: 'completed' | 'pending' | 'cancelled';
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  transaction?: Transaction; // Required when mode is "edit"
  onAdd?: (transaction: Omit<Transaction, "id">) => void;
  onEdit?: (transaction: Transaction) => void;
}

const defaultValues: FormData = {
  description: "",
  vendorId: "",
  categoryId: "",
  amount: "",
  date: new Date().toISOString().split('T')[0], // Today's date
  type: "expense",
  notes: "",
  tags: "",
  accountId: "",
  recurring: false,
  status: "completed",
};

const TransactionModal = ({
  isOpen,
  onClose,
  mode,
  transaction,
  onAdd,
  onEdit,
}: TransactionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });

//   const watchType = watch("type");

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && transaction) {
        reset({
          description: transaction.description,
          vendorId: transaction.vendorId.toString(),
          categoryId: transaction.categoryId.toString(),
          amount: Math.abs(transaction.amount).toFixed(2),
          date: transaction.date,
          type: transaction.type,
          notes: transaction.notes || "",
          tags: transaction.tags?.join(", ") || "",
          accountId: transaction.accountId?.toString() || "",
          recurring: transaction.recurring || false,
          status: transaction.status,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, mode, transaction, reset]);

  const onSubmit = (data: FormData) => {
    const amount = parseFloat(data.amount);
    const finalAmount = data.type === "expense" ? -Math.abs(amount) : Math.abs(amount);
    
    if (mode === "add" && onAdd) {
      onAdd({
        description: data.description,
        vendorId: parseInt(data.vendorId),
        categoryId: parseInt(data.categoryId),
        amount: finalAmount,
        date: data.date,
        type: data.type,
        notes: data.notes || undefined,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
        accountId: data.accountId ? parseInt(data.accountId) : undefined,
        recurring: data.recurring,
        status: data.status,
      });
    } else if (mode === "edit" && onEdit && transaction) {
      onEdit({
        ...transaction,
        description: data.description,
        vendorId: parseInt(data.vendorId),
        categoryId: parseInt(data.categoryId),
        amount: finalAmount,
        date: data.date,
        type: data.type,
        notes: data.notes || undefined,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
        accountId: data.accountId ? parseInt(data.accountId) : undefined,
        recurring: data.recurring,
        status: data.status,
      });
    }
    reset(defaultValues);
    onClose();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Transaction" : "Add New Transaction";
  const submitText = isEditMode ? "Update Transaction" : "Add Transaction";
  const loadingText = isEditMode ? "Updating..." : "Adding...";

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">{title}</h3>

        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Grocery shopping, Salary deposit"
                className={`input input-bordered w-full ${errors.description ? "input-error" : ""}`}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`input input-bordered w-full ${errors.amount ? "input-error" : ""}`}
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" },
                })}
              />
              {errors.amount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.amount.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("type")}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.date.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Vendor</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.vendorId ? "select-error" : ""}`}
                {...register("vendorId", { required: "Vendor is required" })}
              >
                <option value="">Select a vendor</option>
                {dummyVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {errors.vendorId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.vendorId.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.categoryId ? "select-error" : ""}`}
                {...register("categoryId", { required: "Category is required" })}
              >
                <option value="">Select a category</option>
                {dummyCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.categoryId.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Account</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("accountId")}
              >
                <option value="">No account</option>
                {dummyAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("status")}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea
              placeholder="Additional notes about this transaction..."
              className="textarea textarea-bordered w-full"
              rows={3}
              {...register("notes")}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <input
              type="text"
              placeholder="e.g., groceries, organic, weekly (comma-separated)"
              className="input input-bordered w-full"
              {...register("tags")}
            />
            <label className="label">
              <span className="label-text-alt">
                Separate multiple tags with commas
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Recurring Transaction</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("recurring")}
              />
            </label>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {loadingText}
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default TransactionModal;
