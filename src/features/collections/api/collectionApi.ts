import { api } from "@/shared/lib/axios";

export async function getCollections() {
  const res = await api.get("/collections");
  return res.data?.data?.collections || [];
}
