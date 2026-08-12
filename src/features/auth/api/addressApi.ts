import { api } from "@/shared/lib/axios";
import type { BackendAddress, AddressFormData } from "@/features/auth/types";

export type { BackendAddress };

export const fetchAddresses = async (): Promise<BackendAddress[]> => {
  const res = await api.get("/address");
  return res.data.data || [];
};

export const saveAddress = async (data: AddressFormData) => {
  const res = await api.post("/address", data);
  return res.data;
};

export const deleteAddress = async (id: string) => {
  const res = await api.delete(`/address/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id: string) => {
  const res = await api.put(`/address/${id}/default`, {});
  return res.data;
};
