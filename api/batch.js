import { api } from ".";

export const batchAPI = {
  getAllBatches: (page, limit) =>
    api.get(`/batches?page=${page}&limit=${limit}`),
  getAllBatchesByTrainer: (trainerId, page, limit) =>
    api.get(`/batches/trainer/${trainerId}?page=${page}&limit=${limit}`),
  getBatchById: (batchId) => api.get(`/batches/${batchId}`),
  createBatch: (batchData) => api.post("/batches", batchData),
  updateBatch: (batchId, batchData) =>
    api.put(`/batches/${batchId}`, batchData),
  deleteBatch: (batchId) => api.delete(`/batches/${batchId}`),
  //batch me
  // batch/me?page=1&size=10&sortBy=name&direction=asc
  getBatchByme: (filter) =>
    api.get(
      `/batch/me?page=${filter.page}&size=${filter.size}&sortBy=${filter.sortBy}&direction=${filter.direction}`
    ),
};
