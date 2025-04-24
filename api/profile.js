import { api } from ".";

export const profileAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (profileData) => api.put("/profile", profileData),
  getProfilePicture: () => api.get("/profile/picture"),
  updateProfilePicture: (formData) =>
    api.put("/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getProfilePictureById: (imageURI) => api.get(`/profile/picture/${imageURI}`),
  changePassword: (passwordData) =>
    api.put("/profile/change-password", passwordData),
};
