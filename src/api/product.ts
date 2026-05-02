import { api } from "./axios";

// export const getProducts = async () => {
//   console.log("📡 axios API called");

//   const res = await api.get("/products");

//   return res.data;
// };
export const getProducts = async (filters?: any) => {
  const res = await api.get("/products", {
    params: filters
  });

  return res.data;
};