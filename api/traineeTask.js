import { api } from ".";

    export const traineeTaskAPI = {
    getAllTraineeTasksByBatchTaskId: (filter) =>
        api.get(
            `/trainee-task?page=${filter.page}&size=${filter.size}&sortBy=${filter.sortBy}&direction=${filter.direction}&batchTaskId=${filter.batchTaskId}`
        )
};
