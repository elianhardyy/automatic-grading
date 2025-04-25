import { traineeTaskAPI } from "../api/traineeTask";

export const fetchAllTraineeTaskByBatchTaskId = async (filter) => {
  try {
    const response = await traineeTaskAPI.getAllTraineeTasksByBatchTaskId(filter);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
