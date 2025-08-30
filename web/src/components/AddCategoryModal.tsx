import { useState } from "react";
import type { BudgetCategory } from "../types";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<BudgetCategory, "id">) => void;
}

const AddCategoryModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    budgeted: "",
    color: "bg-primary",
  });

  const colorOptions = [
    { value: "bg-primary", label: "Primary", preview: "bg-primary" },
    { value: "bg-secondary", label: "Secondary", preview: "bg-secondary" },
    { value: "bg-accent", label: "Accent", preview: "bg-accent" },
    { value: "bg-info", label: "Info", preview: "bg-info" },
    { value: "bg-success", label: "Success", preview: "bg-success" },
    { value: "bg-warning", label: "Warning", preview: "bg-warning" },
    { value: "bg-error", label: "Error", preview: "bg-error" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.budgeted) {
      onAdd({
        name: formData.name,
        budgeted: parseFloat(formData.budgeted),
        spent: 0,
        color: formData.color,
      });
      setFormData({ name: "", budgeted: "", color: "bg-primary" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: "", budgeted: "", color: "bg-primary" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Budget Category</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Groceries, Gas, etc."
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
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
              className="input input-bordered w-full"
              value={formData.budgeted}
              onChange={(e) =>
                setFormData({ ...formData, budgeted: e.target.value })
              }
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`btn btn-sm ${formData.color === color.value ? "btn-active" : "btn-outline"}`}
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                >
                  <div
                    className={`w-4 h-4 rounded-full ${color.preview}`}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Category
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default AddCategoryModal;
