// import axios, { AxiosError } from "axios";
// import { cookies } from "next/headers";

// const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// let isRefreshing = false;
// let failedQueue: Array<{ resolve: () => void; reject: (err: any) => void }> = [];

// const refreshClient = axios.create({
//     baseURL: BACKEND_BASE_URL,
//     withCredentials: true,
// });

// export const createServerAxiosInstance = async () => {
//     const cookieStore = await cookies();

//     const access = cookieStore.get("access_token")?.value;
//     const refresh = cookieStore.get("refresh_token")?.value;

//     const cookieHeader = [
//         access ? `access_token=${access}` : null,
//         refresh ? `refresh_token=${refresh}` : null,
//     ]
//         .filter(Boolean)
//         .join("; ");

//     const serverAxios = axios.create({
//         baseURL: BACKEND_BASE_URL,
//         withCredentials: true,
//         headers: {
//             Cookie: cookieHeader,
//         },
//     });

//     serverAxios.interceptors.response.use(
//         (res) => res,
//         async (error: AxiosError & { config?: any }) => {
//             const originalRequest = error.config;

//             if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
//                 originalRequest._retry = true;

//                 if (!refresh) {
//                     // нет refresh_token → бросаем ошибку, которую перехватит компонент
//                     throw new Error("UNAUTHORIZED_NO_REFRESH");
//                 }

//                 if (isRefreshing) {
//                     return new Promise((resolve, reject) => {
//                         failedQueue.push({ resolve, reject });
//                     }).then(() => serverAxios(originalRequest));
//                 }

//                 isRefreshing = true;

//                 try {
//                     await refreshClient.get("/api/auth/refresh");

//                     isRefreshing = false;

//                     failedQueue.forEach((p) => p.resolve());
//                     failedQueue = [];

//                     return serverAxios(originalRequest);
//                 } catch (refreshError) {
//                     isRefreshing = false;

//                     failedQueue.forEach((p) => p.reject(refreshError));
//                     failedQueue = [];

//                     throw refreshError;
//                 }
//             }

//             throw error;
//         }
//     );

//     return serverAxios;
// };




import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;

type ResolveWithOptionalParam = (value?: unknown) => void;

let isRefreshing = false;
let queue: Array<{ resolve: ResolveWithOptionalParam; reject: (err: any) => void }> = [];

const processQueue = (error: any = null) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  queue = [];
};

export async function createServerAxios() {
  const cookieStore = await cookies();

  const access = cookieStore.get("access_token")?.value;
  const refresh = cookieStore.get("refresh_token")?.value;

  const cookieHeader = [
    access ? `access_token=${access}` : null,
    refresh ? `refresh_token=${refresh}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const serverAxios = axios.create({
    baseURL: BASE,
    withCredentials: true,
    headers: {
      Cookie: cookieHeader,
    },
  });

  const refreshClient = axios.create({
    baseURL: BASE,
    withCredentials: true,
    headers: {
      Cookie: cookieHeader,
    },
  });

  serverAxios.interceptors.response.use(
    (res) => res,
    async (error: AxiosError & { config?: any }) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push({ resolve, reject });
          })
            .then(() => serverAxios(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const res = await refreshClient.get("/api/auth/refresh");

          isRefreshing = false;
          processQueue(null);

          return serverAxios(originalRequest);
        } catch (err) {
          isRefreshing = false;
          processQueue(err);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return serverAxios;
}

