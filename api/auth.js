import { api } from ".";

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  refreshToken: () => api.get("/auth/refresh-token"),
  logout: () => api.get("/auth/logout"),

  //forgot-password
  forgotPassword: (forgotPasswordData) =>
    api.post("/auth/forgot-password", forgotPasswordData),
  //reset-password
  resetPassword: (resetPasswordData) =>
    api.post("auth/reset-password", resetPasswordData),
};
