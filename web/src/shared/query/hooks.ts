import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJSON } from "./api";
import { queryKeys } from "./queryKeys";
import type {
  Account,
  Category,
  Tag,
  Transaction,
  Vendor,
} from "../../types/budget";

// Base API URL
const API_BASE = "budget.jacobknowlton.com/api";

// ----------------------------------------------------------------------------
// ACCOUNT HOOKS
// ----------------------------------------------------------------------------

export const useAccounts = () => {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => fetchJSON<Account[]>(`${API_BASE}/accounts`),
  });
};

export const useAccount = (id: number) => {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => fetchJSON<Account>(`${API_BASE}/accounts/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (account: Omit<Account, "id">) =>
      fetchJSON<Account>(`${API_BASE}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...account }: Account) =>
      fetchJSON<Account>(`${API_BASE}/accounts/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      }),
    onSuccess: (data) => async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.account(data.id),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/accounts/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: () => async () => {
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
    queryFn: () => fetchJSON<Category[]>(`${API_BASE}/categories`),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () =>
      fetchJSON<Category>(`${API_BASE}/categories/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Omit<Category, "id">) =>
      fetchJSON<Category>(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...category }: Category) =>
      fetchJSON<Category>(`${API_BASE}/categories/${String(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      }),
    onSuccess: (data) => async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.category(data.id),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/categories/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: () => async () => {
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
    queryFn: () => fetchJSON<Tag[]>(`${API_BASE}/tags`),
  });
};

export const useTag = (id: number) => {
  return useQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () => fetchJSON<Tag>(`${API_BASE}/tags/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tag: Omit<Tag, "id">) =>
      fetchJSON<Tag>(`${API_BASE}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...tag }: Tag) =>
      fetchJSON<Tag>(`${API_BASE}/tags/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
      }),
    onSuccess: (data) => async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tag(data.id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/tags/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: () => async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

// ----------------------------------------------------------------------------
// TRANSACTION HOOKS
// ----------------------------------------------------------------------------

export const useTransactions = (page = 0, size = 20) => {
  return useQuery({
    queryKey: [...queryKeys.transactions, "list", page, size],
    queryFn: () =>
      fetchJSON<{
        items: Transaction[];
        totalItems: number;
        totalPages: number;
      }>(
        `${API_BASE}/transactions?page=${page.toString()}&size=${size.toString()}`,
      ),
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () =>
      fetchJSON<Transaction>(`${API_BASE}/transactions/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, "id">) =>
      fetchJSON<Transaction>(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...transaction }: Transaction) =>
      fetchJSON<Transaction>(`${API_BASE}/transactions/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      }),
    onSuccess: (data) => async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transaction(data.id),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/transactions/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: () => async () => {
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
    queryFn: () => fetchJSON<Vendor[]>(`${API_BASE}/vendors`),
  });
};

export const useVendor = (id: number) => {
  return useQuery({
    queryKey: queryKeys.vendor(id),
    queryFn: () => fetchJSON<Vendor>(`${API_BASE}/vendors/${id.toString()}`),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendor: Omit<Vendor, "id">) =>
      fetchJSON<Vendor>(`${API_BASE}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...vendor }: Vendor) =>
      fetchJSON<Vendor>(`${API_BASE}/vendors/${id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      }),
    onSuccess: (data) => async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.vendor(data.id),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchJSON(`${API_BASE}/vendors/${id.toString()}`, {
        method: "DELETE",
      }),
    onSuccess: () => async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vendors });
    },
  });
};
