import { api } from ".";
import { buildQueryParams } from "../utils/queryParam";

export const taskAPI = {
  getAllTasks: (filter = {}) => api.get(`/task${buildQueryParams(filter)}`),
  getTaskById: (taskId) => api.get(`/task/${taskId}`),
  createTask: (taskData) => api.post("/task", taskData),
  updateTask: (taskId, taskData) => api.put(`/task/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/task/${taskId}`),
  getTasksByMe: (filter = {}) =>
    api.get(`/task/tasks-by-me${buildQueryParams(filter)}`),
  //getTaskByme: (filter = {}) => taskAPI.getTasksByMe(filter),

  // --- Criteria ---
  createTaskCriteria: (criteriaData) =>
    api.post("/task-criteria", criteriaData),

  updateTaskCriteria: (criteriaId, criteriaData) =>
    api.put(`/task-criteria/${criteriaId}`, criteriaData),

  deleteTaskCriteria: (criteriaId) =>
    api.delete(`/task-criteria/${criteriaId}`),

  // --- Category ---
  getAllTaskCategory: () => api.get(`/task-category`),
};
