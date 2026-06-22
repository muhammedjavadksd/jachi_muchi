import axios from "axios";

const createAxiosInstance = (timeout?: number) => {
  const instance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
    ...(timeout !== undefined ? { timeout } : {}),
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const api = createAxiosInstance();

export { createAxiosInstance, api };
