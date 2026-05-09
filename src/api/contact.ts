import { api } from "./axios";

export async function submitContactMessage(data: any) {
  // POST to /contact - backend may also accept /contacts depending on setup
  const res = await api.post("/contact", data);
  return res.data;
}
