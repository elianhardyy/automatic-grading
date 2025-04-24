import { traineeAPI } from "../api/trainee";

export const fetchAllTrainees = async (filter) => {
  try {
    const response = await traineeAPI.getAllTrainees(filter);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
export const fetchTraineeById = async (id) => {
  try {
    const response = await traineeAPI.getTraineeById(id);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
