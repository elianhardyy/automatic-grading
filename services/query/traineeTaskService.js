import { traineeTaskAPI } from "../../api/traineeTask";

export const traineeTaskService = {
  fetchAllTraineeTaskByBatchTaskId: async (batchTaskId, filter) => {
    try {
      const response = await traineeTaskAPI.getAllTraineeTasksByBatchTaskId(
        batchTaskId,
        filter
      );
      console.log("dari service: ", batchTaskId);

      console.log("data trainee task: ", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};
