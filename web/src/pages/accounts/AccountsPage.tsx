import { useState } from "react";
import {
  useAccounts,
  useAccount,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "../../shared/query/hooks";
import type { Account, AccountRequest } from "../../types/budget";
import { toAccountType } from "../../types/budget";

const AccountsPage = () => {
  const initAccountRequest: AccountRequest = { name: "", type: "CHECKING" };
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newAccountRequest, setNewAccountRequest] =
    useState(initAccountRequest);
  const [editingAccount, setEditingAccount] = useState<AccountRequest | null>(null);

  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: account, isLoading: accountLoading } = useAccount(
    selectedId || 0,
  );
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const handleCreate = () => {
    createAccount.mutate(newAccountRequest);
    setNewAccountRequest(initAccountRequest);
  };

  const handleUpdate = () => {
    if (account && editingAccount) {
      updateAccount.mutate({ id: account.id, accountRequest: editingAccount });
      setEditingAccount(null);
    }
  };

  const handleEdit = (acc: Account | undefined) => {
    if (acc) {
      const editRequest: AccountRequest = {
        name: acc.name,
        type: acc.type,
      };
      setEditingAccount(editRequest);
    }
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  const handleDelete = (id: number) => {
    deleteAccount.mutate(id);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Accounts</h1>
        <p className="text-base-content/70">Manage your financial accounts</p>
      </div>

      {/* Create Account Form */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Create New Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Account Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newAccountRequest.name}
                onChange={(e) => {
                  setNewAccountRequest({
                    ...newAccountRequest,
                    name: e.target.value,
                  });
                }}
                placeholder="Enter account name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Account Type</span>
              </label>
              <select
                className="select select-bordered"
                value={newAccountRequest.type}
                onChange={(e) => {
                  setNewAccountRequest({
                    ...newAccountRequest,
                    type: toAccountType(e.target.value),
                  });
                }}
              >
                <option value="CHECKING">Checking</option>
                <option value="SAVINGS">Savings</option>
                <option value="CREDIT">Credit</option>
                <option value="INVESTMENT">Investment</option>
                <option value="VENMO">Venmo</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text invisible">Action</span>
              </label>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={
                  createAccount.isPending || !newAccountRequest.name.trim()
                }
              >
                {createAccount.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accounts List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">All Accounts</h2>
            {accountsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-2">
                {accounts?.map((acc) => (
                  <div key={acc.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{acc.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {acc.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setSelectedId(acc.id);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              setSelectedId(acc.id);
                              handleEdit(acc);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              handleDelete(acc.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {accounts?.length === 0 && (
                  <div className="text-center py-8 text-base-content/50">
                    No accounts found. Create your first account above.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Account Details */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Account Details</h2>
            {selectedId ? (
              accountLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : account ? (
                <div className="space-y-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Account ID</div>
                      <div className="stat-value text-primary">
                        {account.id}
                      </div>
                    </div>
                  </div>
                  
                  {editingAccount ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Account Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={editingAccount.name}
                          onChange={(e) => {
                            setEditingAccount(prev => prev ? { ...prev, name: e.target.value } : null);
                          }}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Account Type</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={editingAccount.type}
                          onChange={(e) => {
                            setEditingAccount(prev => prev ? { ...prev, type: toAccountType(e.target.value) } : null);
                          }}
                        >
                          <option value="CHECKING">Checking</option>
                          <option value="SAVINGS">Savings</option>
                          <option value="CREDIT">Credit</option>
                          <option value="INVESTMENT">Investment</option>
                          <option value="VENMO">Venmo</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={handleUpdate}
                          disabled={updateAccount.isPending}
                        >
                          {updateAccount.isPending ? (
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
                          value={account.name}
                          readOnly
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Type</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={account.type}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-error">
                  <span>Account not found</span>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-base-content/50">
                Select an account to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
