import { api } from "./axios";

export interface BackendAddress {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault: boolean;
}

export interface AddressFormData {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault?: boolean;
}

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