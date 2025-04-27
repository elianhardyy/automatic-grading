import { api } from ".";
import { buildQueryParams } from "../utils/queryParam";

export const batchAPI = {
  getAllBatches: (filter) => api.get(`/batches${buildQueryParams(filter)}`),
  getAllBatchesByTrainer: (trainerId, filter) =>
    api.get(`/batches/trainer/${trainerId}${buildQueryParams(filter)}`),
  getBatchById: (batchId) => api.get(`/batches/${batchId}`),
  createBatch: (batchData) => api.post("/batches", batchData),
  updateBatch: (batchId, batchData) =>
    api.put(`/batches/${batchId}`, batchData),
  deleteBatch: (batchId) => api.delete(`/batches/${batchId}`),
  //batch me
  // batch/me?page=1&size=10&sortBy=name&direction=asc
  getBatchByme: (filter) => api.get(`/batch/me${buildQueryParams(filter)}`),
};
