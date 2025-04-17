import { api } from ".";

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  refreshToken: () => api.get("/auth/refresh-token"),
  logout: () => api.get("/auth/logout"),
};
