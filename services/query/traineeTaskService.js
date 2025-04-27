import { traineeTaskAPI } from "../../api/traineeTask";

export const traineeTaskService = {
  fetchAllTraineeTaskByBatchTaskId: async (batchTaskId, filter = {}) => {
    try {
      const response = await traineeTaskAPI.getAllTraineeTasksByBatchTaskId(
        batchTaskId,
        filter
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};
