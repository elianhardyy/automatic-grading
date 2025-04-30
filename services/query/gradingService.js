import { gradingAPI } from "../../api/grading";

export const gradingService = {
  updategradingTrainee: async (data) => {
    try {
      const response = await gradingAPI.grading(data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
  updategradingTraineeTask: async (traineeTaskId, data) => {
    try {
      const response = await gradingAPI.updateGrading(traineeTaskId, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};
