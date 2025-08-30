import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { BudgetCategory } from "../../types";

interface FormData {
  name: string;
  budgeted: string;
  color: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  category?: BudgetCategory; // Required when mode is "edit"
  onAdd?: (category: Omit<BudgetCategory, "id">) => void;
  onEdit?: (category: BudgetCategory) => void;
}

const defaultValues = {
  name: "",
  budgeted: "",
  color: "#3388ff",
};

const CategoryModal = ({
  isOpen,
  onClose,
  mode,
  category,
  onAdd,
  onEdit,
}: CategoryModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && category) {
        reset({
          name: category.name,
          budgeted: category.budgeted.toFixed(2),
          color: category.color,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, mode, category, reset]);

  const onSubmit = (data: FormData) => {
    if (mode === "add" && onAdd) {
      onAdd({
        name: data.name,
        budgeted: parseFloat(data.budgeted),
        spent: 0,
        color: data.color,
      });
    } else if (mode === "edit" && onEdit && category) {
      onEdit({
        ...category,
        name: data.name,
        budgeted: parseFloat(data.budgeted),
        color: data.color,
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
  const title = isEditMode ? "Edit Budget Category" : "Add New Budget Category";
  const submitText = isEditMode ? "Update Category" : "Add Category";
  const loadingText = isEditMode ? "Updating..." : "Adding...";

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{title}</h3>

        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Groceries, Gas, etc."
              className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
              {...register("name", { required: "Category name is required" })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Monthly Budget Amount</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`input input-bordered w-full ${errors.budgeted ? "input-error" : ""}`}
              {...register("budgeted", {
                required: "Budget amount is required",
                min: { value: 0.01, message: "Budget must be greater than 0" },
              })}
            />
            {errors.budgeted && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.budgeted.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                className="input input-bordered p-1 h-10 w-14 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                {...register("color")}
                title="Choose your color"
              />
              <div className="text-sm text-base-content/70">
                Click to pick a custom color for this category
              </div>
            </div>
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

export default CategoryModal;
