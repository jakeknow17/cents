import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJSON } from "./api";
import { queryKeys } from "./queryKeys";
import type {
  Account,
  Category,
  Tag,
  Transaction,
  Vendor,
  AccountRequest,
  CategoryRequest,
  TagRequest,
  TransactionRequest,
  VendorRequest,
} from "../../types/budget";

const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string) ||
  "http://budget.jacobknowlton.com/api";

// ----------------------------------------------------------------------------
// ACCOUNT HOOKS
// ----------------------------------------------------------------------------

export const useAccounts = () => {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => fetchJSON<Account[]>(`${API_BASE}/v1/budget/accounts`),
  });
};

export const useAccount = (id: number) => {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () =>
      fetchJSON<Account>(`${API_BASE}/v1/budget/accounts/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountRequest: AccountRequest) =>
      fetchJSON<Account>(`${API_BASE}/v1/budget/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountRequest),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      accountRequest,
    }: {
      id: number;
      accountRequest: AccountRequest;
    }) =>
      fetchJSON<Account>(`${API_BASE}/v1/budget/accounts/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountRequest),
      }),
    onSuccess: async (data) => {
      if (data) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.account(data.id),
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/v1/budget/accounts/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

// ----------------------------------------------------------------------------
// CATEGORY HOOKS
// ----------------------------------------------------------------------------

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => fetchJSON<Category[]>(`${API_BASE}/v1/budget/categories`),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () =>
      fetchJSON<Category>(`${API_BASE}/v1/budget/categories/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryRequest: CategoryRequest) =>
      fetchJSON<Category>(`${API_BASE}/v1/budget/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryRequest),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      categoryRequest,
    }: {
      id: number;
      categoryRequest: CategoryRequest;
    }) =>
      fetchJSON<Category>(`${API_BASE}/v1/budget/categories/${String(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryRequest),
      }),
    onSuccess: async (data) => {
      if (data) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.category(data.id),
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/v1/budget/categories/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

// ----------------------------------------------------------------------------
// TAG HOOKS
// ----------------------------------------------------------------------------

export const useTags = () => {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => fetchJSON<Tag[]>(`${API_BASE}/v1/budget/tags`),
  });
};

export const useTag = (id: number) => {
  return useQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () =>
      fetchJSON<Tag>(`${API_BASE}/v1/budget/tags/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagRequest: TagRequest) =>
      fetchJSON<Tag>(`${API_BASE}/v1/budget/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagRequest),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagRequest }: { id: number; tagRequest: TagRequest }) =>
      fetchJSON<Tag>(`${API_BASE}/v1/budget/tags/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagRequest),
      }),
    onSuccess: async (data) => {
      if (data) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.tag(data.id),
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/v1/budget/tags/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

// ----------------------------------------------------------------------------
// TRANSACTION HOOKS
// ----------------------------------------------------------------------------

export const useTransactions = (offset = 0, limit = 100) => {
  return useQuery({
    queryKey: [...queryKeys.transactions, "list", offset, limit],
    queryFn: () =>
      fetchJSON<Transaction[]>(
        `${API_BASE}/v1/budget/transactions?offset=${offset.toString()}&limit=${limit.toString()}`,
      ),
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () =>
      fetchJSON<Transaction>(
        `${API_BASE}/v1/budget/transactions/${id.toString()}`,
      ),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionRequest: TransactionRequest) =>
      fetchJSON<Transaction>(`${API_BASE}/v1/budget/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionRequest),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      transactionRequest,
    }: {
      id: number;
      transactionRequest: TransactionRequest;
    }) =>
      fetchJSON<Transaction>(
        `${API_BASE}/v1/budget/transactions/${id.toString()}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionRequest),
        },
      ),
    onSuccess: async (data) => {
      if (data) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.transaction(data.id),
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/v1/budget/transactions/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};

// ----------------------------------------------------------------------------
// VENDOR HOOKS
// ----------------------------------------------------------------------------

export const useVendors = () => {
  return useQuery({
    queryKey: queryKeys.vendors,
    queryFn: () => fetchJSON<Vendor[]>(`${API_BASE}/v1/budget/vendors`),
  });
};

export const useVendor = (id: number) => {
  return useQuery({
    queryKey: queryKeys.vendor(id),
    queryFn: () =>
      fetchJSON<Vendor>(`${API_BASE}/v1/budget/vendors/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendorRequest: VendorRequest) =>
      fetchJSON<Vendor>(`${API_BASE}/v1/budget/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorRequest),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      vendorRequest,
    }: {
      id: number;
      vendorRequest: VendorRequest;
    }) =>
      fetchJSON<Vendor>(`${API_BASE}/v1/budget/vendors/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorRequest),
      }),
    onSuccess: async (data) => {
      if (data) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.vendor(data.id),
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/v1/budget/vendors/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
    },
  });
};
