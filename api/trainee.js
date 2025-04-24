import { api } from ".";

export const traineeAPI = {
  getAllTrainees: (filter) =>
    api.get(
      `/trainee?page=${filter.page}&size=${filter.size}&sortBy=${filter.sortBy}&direction=${filter.direction}`
    ),
  getTraineeById: (traineeId) => api.get(`/trainee/${traineeId}`),
};
