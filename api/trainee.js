import { api } from ".";
import { buildQueryParams } from "../utils/queryParam";

export const traineeAPI = {
  getAllTrainees: (filter) => api.get(`/trainee${buildQueryParams(filter)}`),
  getTraineeById: (traineeId) => api.get(`/trainee/${traineeId}`),
};
