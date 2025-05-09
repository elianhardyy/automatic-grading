import { batchAPI } from "../../api/batch";

export const batchService = {
  fetchAllBatchByMe: async (filter) => {
    try {
      const response = await batchAPI.getBatchByme(filter);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
};
