import { api } from ".";

export const gradingAPI = {
  grading: (data) => api.put("/grading", data),
  updateGrading: (traineeTaskId, data) =>
    api.put(`/trainee-task/${traineeTaskId}`, data),
};
