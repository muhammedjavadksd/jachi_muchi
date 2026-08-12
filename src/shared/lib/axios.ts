import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:5000/api";

const createAxiosInstance = (timeout?: number) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    ...(timeout !== undefined ? { timeout } : {}),
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const api = createAxiosInstance();

// Refresh token state — prevents multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

function forceLogout() {
  // Clear all auth and user-scoped storage and reset auth state.
  // Does NOT redirect — unauthenticated users can still browse freely.
  // Write actions (add to cart, wishlist, checkout) will trigger the login modal.
  const authKeys = ["access_token", "refresh_token", "app_user", "welcomeCoupon", "pendingCouponMark", "eyeTestResult"];
  authKeys.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("redirectAfterLogin");
  window.dispatchEvent(new Event("auth:session-expired"));
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 on non-refresh, non-login requests that haven't been retried yet
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers = { ...(originalRequest.headers ?? {}), Authorization: `Bearer ${token}` };
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      const newAccessToken: string = data.data.accessToken;
      const newRefreshToken: string = data.data.refreshToken;

      // Store both rotated tokens
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      originalRequest.headers = { ...(originalRequest.headers ?? {}), Authorization: `Bearer ${newAccessToken}` };
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { createAxiosInstance, api };
