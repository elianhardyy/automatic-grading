import { api } from ".";

export const gradingAPI = {
  grading: (data) => api.put("/grading", data),
};
