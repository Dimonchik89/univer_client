import { AxiosError } from 'axios';
// import Router from 'next/router';
import { redirect } from 'next/navigation';
import axios from 'axios';

// const axiosInstance = axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// 	withCredentials: true
// })

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Если ошибка 401 (Unauthorized) И это не запрос на обновление токена
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 // 1. Вызываем API-роут для обновления токена
//                 // Браузер автоматически отправит refresh_token в куках


//                 await axiosInstance('api/auth/refresh');

//                 // 2. Повторяем оригинальный запрос
//                 // Новый access_token уже установлен в куки браузером,
//                 // поэтому он будет автоматически отправлен с этим повторным запросом
//                 return axiosInstance(originalRequest);

//             } catch (refreshError) {
//                 // Если refresh не удался, перенаправляем на страницу входа
//                 window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;





// ---------------------------------------- Работал но проблема с ошибкой когда refresh удален в базе данных при signout

// const axiosInstance = axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// 	withCredentials: true
// })

// let isRefreshing = false;
// let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

// const processQueue = (error: AxiosError | null, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(true);
//     }
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   response => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config;
// 	console.log("instance", error);


//     if (error.response?.status === 401 && !originalRequest?._retry) {
//       originalRequest!._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//         .then(() => {
//           return axiosInstance(originalRequest!);
//         })
//         .catch(err => {
//           return Promise.reject(err);
//         });
//       }

//       isRefreshing = true;

//       try {
//         const response = await axiosInstance(`/api/auth/refresh`);

//         isRefreshing = false;
//         return axiosInstance(originalRequest!);
//       } catch (refreshError: any) {
//         isRefreshing = false;
//         processQueue(refreshError);




// 		// redirect('/login');
//         // Router.push('/auth/login');
//         // return Promise.reject(refreshError);

// 		if (!axios.isAxiosError(refreshError)) {
//              // Це забезпечить, що React Query побачить, що щось не так
//              throw new Error('Refresh failed unexpectedly: ' + (refreshError.message || refreshError));
//         }
// 		throw refreshError
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;




// const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

// const axiosInstance = axios.create({
// 	baseURL: baseURL,
// 	withCredentials: true
// })

// // отдельный клиент для refresh — **без** интерсепторов
// const refreshClient = axios.create({
//   baseURL: baseURL,
//   withCredentials: true,
// });

// // очередь ожидания
// let isRefreshing = false;
// let failedQueue: Array<{ resolve: () => void; reject: (err: any) => void }> = [];

// const processQueue = (error: any = null) => {
//   failedQueue.forEach(p => {
//     if (error) p.reject(error);
//     else p.resolve();
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError & { config?: any }) => {
//     const originalRequest = error.config;

//     // если нет config — это не Axios запрос, пробрасываем
//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     // если 401 и запрос ещё не ретраен
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         // другие запросы ждут результата refresh
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => {
//             return axiosInstance(originalRequest);
//           })
//           .catch(err => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
// 			// Важно: используем refreshClient, чтобы не попасть в этот же интерсептор
// 			await refreshClient.get('/api/auth/refresh');
// 			// если нужно — можно взять токен: refreshResponse.data.token

// 			isRefreshing = false;
// 			processQueue(null);

// 			// повторяем оригинальный запрос (он должен пройти, т.к. refresh обновил сессию/куки)
// 			return axiosInstance(originalRequest);
//       } catch (refreshError: any) {
// 			isRefreshing = false;
// 			processQueue(refreshError);

// 			// обязательно пробрасываем ошибку дальше — тогда useQuery её поймает
// 			return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;








const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  // додав для тестування ngrok
	headers: {
		"ngrok-skip-browser-warning": "true"
	},
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  // додав для тестування ngrok
	headers: {
		"ngrok-skip-browser-warning": "true"
	},
});

let isRefreshing = false;
let refreshFailed = false;

type ResolveWithOptionalParam = (value?: unknown) => void;


let failedQueue: Array<{ resolve: ResolveWithOptionalParam; reject: (err: any) => void }> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,

  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // ❗ критично
    if (refreshFailed) {
      originalRequest._noRetry = true;
      return Promise.reject(error);
    }

    // ❗ запрет повторения
    if (originalRequest._noRetry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        await refreshClient.get("/api/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshFailed = true;

        processQueue(refreshError);

        // перекрываем дальнейшие попытки
        originalRequest._noRetry = true;

        // не повторяем запрос
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
