import { useState } from "react";
import {
  useTags,
  useTag,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "../../shared/query/hooks";
import type { Tag, TagRequest } from "../../types/budget";

const TagsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newTagRequest, setNewTagRequest] = useState<TagRequest>({
    name: "",
    transactionsIds: [],
  });
  const [editingTag, setEditingTag] = useState<TagRequest | null>(null);

  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: tag, isLoading: tagLoading } = useTag(selectedId || 0);
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const handleCreate = () => {
    createTag.mutate(newTagRequest);
    setNewTagRequest({ name: "", transactionsIds: [] });
  };

  const handleUpdate = () => {
    if (tag && editingTag) {
      updateTag.mutate({ id: tag.id, tagRequest: editingTag });
      setEditingTag(null);
    }
  };

  const handleEdit = (t: Tag | undefined) => {
    if (t) {
      const editRequest: TagRequest = {
        name: t.name,
        transactionsIds: t.transactions.map((transaction) => transaction.id),
      };
      setEditingTag(editRequest);
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
  };

  const handleDelete = (id: number) => {
    deleteTag.mutate(id);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tags</h1>
        <p className="text-base-content/70">
          Organize transactions with custom tags
        </p>
      </div>

      {/* Create Tag Form */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Create New Tag</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tag Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newTagRequest.name}
                onChange={(e) => {
                  setNewTagRequest({ ...newTagRequest, name: e.target.value });
                }}
                placeholder="Enter tag name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text invisible">Action</span>
              </label>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={createTag.isPending || !newTagRequest.name.trim()}
              >
                {createTag.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Tag"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tags List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">All Tags</h2>
            {tagsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-2">
                {tags?.map((t) => (
                  <div key={t.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{t.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {t.transactions.length} transaction
                            {t.transactions.length !== 1 ? "s" : ""}
                          </p>
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
                              setSelectedId(t.id)
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
                {tags?.length === 0 && (
                  <div className="text-center py-8 text-base-content/50">
                    No tags found. Create your first tag above.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Tag Details */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Tag Details</h2>
            {selectedId ? (
              tagLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : tag ? (
                <div className="space-y-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Tag ID</div>
                      <div className="stat-value text-primary">{tag.id}</div>
                    </div>
                  </div>
                  
                  {editingTag ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Tag Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={editingTag.name}
                          onChange={(e) => {
                            setEditingTag(prev => prev ? { ...prev, name: e.target.value } : null);
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={handleUpdate}
                          disabled={updateTag.isPending}
                        >
                          {updateTag.isPending ? (
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
                          value={tag.name}
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Associated Transactions
                          </span>
                        </label>
                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-title">Count</div>
                            <div className="stat-value text-secondary">
                              {tag.transactions.length}
                            </div>
                          </div>
                        </div>
                      </div>
                      {tag.transactions.length > 0 && (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">
                              Transaction List
                            </span>
                          </label>
                          <div className="max-h-40 overflow-y-auto">
                            {tag.transactions.map((transaction) => (
                              <div
                                key={transaction.id}
                                className="badge badge-outline m-1"
                              >
                                {transaction.description} - ${transaction.amount}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-error">
                  <span>Tag not found</span>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-base-content/50">
                Select a tag to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
