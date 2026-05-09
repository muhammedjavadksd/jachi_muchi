import { api } from "./axios";

export async function getCollections() {
  const res = await api.get("/collections");
  return res.data?.data?.collections || [];
}
import { api } from "./axios";
