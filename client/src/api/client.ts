import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Authentication failures are handled by the auth layer.
      // Do not redirect from the Axios interceptor.
    }

    return Promise.reject(error);
  },
);

export default apiClient;