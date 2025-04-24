import { api } from ".";

const buildQueryParams = (filter) => {
  const params = new URLSearchParams();
  if (filter.page) params.append("page", filter.page);
  if (filter.size) params.append("size", filter.size);
  if (filter.sortBy) params.append("sortBy", filter.sortBy);
  if (filter.direction) params.append("direction", filter.direction);
  if (filter.name) params.append("name", filter.name);
  if (filter.taskCategory) params.append("taskCategory", filter.taskCategory);
  if (filter.batchName) params.append("batchName", filter.batchName);
  if (filter.taskCriteriaDescription)
    params.append("taskCriteriaDescription", filter.taskCriteriaDescription);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const taskAPI = {
  getAllTasks: (filter = {}) => api.get(`/task${buildQueryParams(filter)}`),
  getTaskById: (taskId) => api.get(`/task/${taskId}`),
  createTask: (taskData) => api.post("/task", taskData),
  updateTask: (taskId, taskData) => api.put(`/task/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/task/${taskId}`),
  getTasksByMe: (filter = {}) =>
    api.get(`/task/tasks-by-me${buildQueryParams(filter)}`),
  getTaskByme: (filter = {}) => taskAPI.getTasksByMe(filter),

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
