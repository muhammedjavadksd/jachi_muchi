import { api } from "@/shared/lib/axios";

export async function submitContactMessage(data: any) {
  const res = await api.post("/contact", data);
  return res.data;
}
