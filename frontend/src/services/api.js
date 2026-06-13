import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login:  (data) => api.post("/auth/login",  data),
  me:     ()     => api.get("/auth/me"),
};

export const urlApi = {
  create: (data) => api.post("/urls",         data),
  getAll: ()     => api.get("/urls"),
  remove: (id)   => api.delete(`/urls/${id}`),
  getQR:  (id)   => api.get(`/urls/${id}/qr`),
};

export const analyticsApi = {
  overview: ()   => api.get("/analytics/overview"),
  byUrl:    (id) => api.get(`/analytics/${id}`),
};

export default api;
