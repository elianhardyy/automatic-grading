import { api } from ".";
import { buildQueryParams } from "../utils/queryParam";

export const traineeTaskAPI = {
  getAllTraineeTasksByBatchTaskId: (batchTaskId, filter) =>
    api.get(
      `/trainee-task/batch-task/${batchTaskId}${buildQueryParams(filter)}`
    ),
  createTraineTask: (data) => api.post(`/trainee-task`, data),
};
