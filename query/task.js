import { taskAPI } from "../api/task";
import { format, parseISO } from "date-fns";

function formatDateToLocal(dateString) {
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export const fetchAllTask = async (filter) => {
  try {
    const response = await taskAPI.getAllTasks(filter);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const fetchTask = async (filter) => {
  try {
    const response = await taskAPI.getTaskByme(filter);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await taskAPI.createTask(taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createTaskCriteria = async (criteriaData) => {
  try {
    const response = await taskAPI.createTaskCriteria(criteriaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createTaskWithCriteria = async (taskData, criteriaList) => {
  try {
    const criteriaPromises = criteriaList.map((criteriaItem) =>
      taskAPI.createTaskCriteria(criteriaItem)
    );

    const criteriaResponses = await Promise.all(criteriaPromises);
    const taskCriteriasId = criteriaResponses.map(
      (response) => response.data.data.id
    );

    const taskPayload = {
      name: taskData.name,
      taskCategoryId: taskData.taskCategoryId,
      taskCriteriasId: taskCriteriasId,
      batchTasks: [
        {
          assignedDate: formatDateToLocal(taskData.assignedDate),
          dueDate: formatDateToLocal(taskData.dueDate),
          taskId: null,
          batchId: taskData.batchId,
        },
      ],
    };

    const response = await taskAPI.createTask(taskPayload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateTaskWithCreatedAndUpdateCriteria = async (
  taskId,
  taskData,
  newCriteriaList,
  existingCriteriaIds,
  existingCriteriaList
) => {
  try {
    existingCriteriaList.map((criteriaItem, index) =>
      taskAPI.updateTaskCriteria(existingCriteriaIds[index], {
        description: criteriaItem.description,
        weight: parseInt(criteriaItem.weight, 10) || 1,
      })
    );

    const criteriaPromises = newCriteriaList.map((criteriaItem) =>
      taskAPI.createTaskCriteria(criteriaItem)
    );

    const criteriaResponses = await Promise.all(criteriaPromises);

    const newCriteriaIds = criteriaResponses.map(
      (response) => response.data.data.id
    );

    const allCriteriaIds = [...existingCriteriaIds, ...newCriteriaIds];

    const taskPayload = {
      name: taskData.name,
      taskCategoryId: taskData.taskCategoryId,
      taskCriteriasId: allCriteriaIds,
      batchTasks: taskData.batchTasks.map((batch) => ({
        ...batch,
        taskId: taskId, // Ensure we have the correct taskId
      })),
    };

    const response = await taskAPI.updateTask(taskId, taskPayload);
    return response.data;
  } catch (error) {
    console.error("Error in updateTaskWithCreatedCriteria:", error);
    throw error.response?.data || { message: error.message };
  }
};

export const getAllTaskCategory = async () => {
  try {
    const response = await taskAPI.getAllTaskCategory();
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await taskAPI.getTaskById(taskId);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
export const updateTask = async (taskId, taskData, criteriaList) => {
  try {
    const response = await taskAPI.updateTask(taskId, taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateTaskWithCriteria = async (
  taskId,
  taskData,
  criteriaList,
  criteriaIdList
) => {
  try {
    const criteriaPromises = criteriaList.map((criteriaItem, index) =>
      taskAPI.updateTaskCriteria(criteriaIdList[index], {
        description: criteriaItem.description,
        weight: parseInt(criteriaItem.weight, 10) || 1,
      })
    );

    const criteriaResponses = await Promise.all(criteriaPromises);

    const taskCriteriasId = criteriaResponses.map(
      (response) => response.data.data.id
    );

    const taskPayload = {
      name: taskData.name,
      taskCategoryId: taskData.taskCategoryId,
      taskCriteriasId: taskCriteriasId,
      batchTasks: taskData.batchTasks,
    };

    const response = await taskAPI.updateTask(taskId, taskPayload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteTaskWithCriteria = async (taskId, criteriaId) => {
  try {
    console.log(criteriaId);
    const response = await taskAPI.deleteTask(taskId);
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 409 ||
      error.message?.includes("updated or deleted by another transaction")
    ) {
      console.log("Task might be already deleted, triggering refresh");
      return { success: true, message: "Task deletion processed" };
    }
    throw error.response?.data || { message: error.message };
  }
};

export const deleteTaskCriteria = async (criteriaId) => {
  try {
    const response = await taskAPI.deleteTaskCriteria(criteriaId);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const fetchAllTaskCategories = async () => {
  try {
    const response = await taskAPI.getAllTaskCategory();
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
