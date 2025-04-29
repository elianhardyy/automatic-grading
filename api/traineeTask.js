import { api } from ".";
import { buildQueryParams } from "../utils/queryParam";

export const traineeTaskAPI = {
  getAllTraineeTasksByBatchTaskId: (batchTaskId, filter) =>
    api.get(`/trainee-task/batch-task/${batchTaskId}`),
  // /trainee-task/batch-task/{id}?page={filter.page}&size={filter.size}
  createTraineTask: (data) => api.post(`/trainee-task`, data),
};
