import { useState } from "react";
import {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../shared/query/hooks";
import type { Category, CategoryRequest } from "../../types/budget";

const CategoriesPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newCategoryRequest, setNewCategoryRequest] = useState<CategoryRequest>(
    {
      name: "",
      amount: 0,
      color: "#000000",
    },
  );
  const [editingCategory, setEditingCategory] = useState<CategoryRequest | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: category, isLoading: categoryLoading } = useCategory(
    selectedId || 0,
  );
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = () => {
    createCategory.mutate(newCategoryRequest);
    setNewCategoryRequest({ name: "", amount: 0, color: "#000000" });
  };

  const handleUpdate = () => {
    if (category && editingCategory) {
      updateCategory.mutate({
        id: category.id,
        categoryRequest: editingCategory,
      });
      setEditingCategory(null);
    }
  };

  const handleEdit = (cat: Category | undefined) => {
    if (cat) {
      const editRequest: CategoryRequest = {
        name: cat.name,
        amount: cat.amount,
        color: cat.color,
      };
      setEditingCategory(editRequest);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDelete = (id: number) => {
    deleteCategory.mutate(id);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Categories</h1>
        <p className="text-base-content/70">
          Organize your spending by categories
        </p>
      </div>

      {/* Create Category Form */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Create New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newCategoryRequest.name}
                onChange={(e) => {
                  setNewCategoryRequest({
                    ...newCategoryRequest,
                    name: e.target.value,
                  });
                }}
                placeholder="Enter category name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Budget Amount</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={newCategoryRequest.amount}
                onChange={(e) => {
                  setNewCategoryRequest({
                    ...newCategoryRequest,
                    amount: Number(e.target.value),
                  });
                }}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <input
                type="color"
                className="input input-bordered h-12"
                value={newCategoryRequest.color}
                onChange={(e) => {
                  setNewCategoryRequest({
                    ...newCategoryRequest,
                    color: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text invisible">Action</span>
              </label>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={
                  createCategory.isPending || !newCategoryRequest.name.trim()
                }
              >
                {createCategory.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">All Categories</h2>
            {categoriesLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-2">
                {categories?.map((cat) => (
                  <div key={cat.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-base-300"
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          <div>
                            <h3 className="font-semibold">{cat.name}</h3>
                            <p className="text-sm text-base-content/70">
                              ${cat.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setSelectedId(cat.id);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              setSelectedId(cat.id);
                              handleEdit(cat);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              handleDelete(cat.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {categories?.length === 0 && (
                  <div className="text-center py-8 text-base-content/50">
                    No categories found. Create your first category above.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Category Details */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Category Details</h2>
            {selectedId ? (
              categoryLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : category ? (
                <div className="space-y-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Category ID</div>
                      <div className="stat-value text-primary">
                        {category.id}
                      </div>
                    </div>
                  </div>
                  
                  {editingCategory ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Category Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={editingCategory.name}
                          onChange={(e) => {
                            setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null);
                          }}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Budget Amount</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered"
                          value={editingCategory.amount}
                          onChange={(e) => {
                            setEditingCategory(prev => prev ? { ...prev, amount: Number(e.target.value) } : null);
                          }}
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Color</span>
                        </label>
                        <input
                          type="color"
                          className="input input-bordered h-12"
                          value={editingCategory.color}
                          onChange={(e) => {
                            setEditingCategory(prev => prev ? { ...prev, color: e.target.value } : null);
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={handleUpdate}
                          disabled={updateCategory.isPending}
                        >
                          {updateCategory.isPending ? (
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
                          <span className="label-text font-semibold">Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={category.name}
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Budget Amount
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={`$${category.amount.toFixed(2)}`}
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Color</span>
                        </label>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-base-300"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <input
                            type="text"
                            className="input input-bordered flex-1"
                            value={category.color}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-error">
                  <span>Category not found</span>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-base-content/50">
                Select a category to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
