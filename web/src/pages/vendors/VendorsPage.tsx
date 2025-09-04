import { useState } from "react";
import {
  useVendors,
  useVendor,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "../../shared/query/hooks";
import type { VendorRequest } from "../../types/budget";

const VendorsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newVendorRequest, setNewVendorRequest] = useState<VendorRequest>({
    name: "",
    link: "",
  });

  const { data: vendors, isLoading: vendorsLoading } = useVendors();
  const { data: vendor, isLoading: vendorLoading } = useVendor(selectedId || 0);
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();

  const handleCreate = () => {
    createVendor.mutate(newVendorRequest);
    setNewVendorRequest({ name: "", link: "" });
  };

  const handleUpdate = () => {
    if (vendor) {
      const updatedRequest: VendorRequest = {
        name: vendor.name + " (Updated)",
        link: vendor.link,
      };
      updateVendor.mutate({ id: vendor.id, vendorRequest: updatedRequest });
    }
  };

  const handleDelete = (id: number) => {
    deleteVendor.mutate(id);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Vendors</h1>
        <p className="text-base-content/70">Manage your vendor information</p>
      </div>

      {/* Create Vendor Form */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Create New Vendor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Vendor Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newVendorRequest.name}
                onChange={(e) => {
                  setNewVendorRequest({
                    ...newVendorRequest,
                    name: e.target.value,
                  });
                }}
                placeholder="Enter vendor name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Website Link (Optional)</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                value={newVendorRequest.link || ""}
                onChange={(e) => {
                  setNewVendorRequest({
                    ...newVendorRequest,
                    link: e.target.value,
                  });
                }}
                placeholder="https://example.com"
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
                  createVendor.isPending || !newVendorRequest.name.trim()
                }
              >
                {createVendor.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Vendor"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendors List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">All Vendors</h2>
            {vendorsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-2">
                {vendors?.map((v) => (
                  <div key={v.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{v.name}</h3>
                          {v.link && (
                            <a
                              href={v.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {v.link}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setSelectedId(v.id);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              handleUpdate();
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              handleDelete(v.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {vendors?.length === 0 && (
                  <div className="text-center py-8 text-base-content/50">
                    No vendors found. Create your first vendor above.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Vendor Details */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Vendor Details</h2>
            {selectedId ? (
              vendorLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : vendor ? (
                <div className="space-y-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Vendor ID</div>
                      <div className="stat-value text-primary">{vendor.id}</div>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={vendor.name}
                      readOnly
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Website Link
                      </span>
                    </label>
                    {vendor.link ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={vendor.link}
                          readOnly
                        />
                        <a
                          href={vendor.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                        >
                          Visit
                        </a>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="input input-bordered"
                        value="No link provided"
                        readOnly
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="alert alert-error">
                  <span>Vendor not found</span>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-base-content/50">
                Select a vendor to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;
