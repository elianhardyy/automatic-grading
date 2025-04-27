export const buildQueryParams = (filter) => {
  const params = new URLSearchParams();
  if (filter.page) params.append("page", filter.page);
  if (filter.size) params.append("size", filter.size);
  if (filter.sortBy) params.append("sortBy", filter.sortBy);
  if (filter.direction) params.append("direction", filter.direction);
  if (filter.name) params.append("name", filter.name);
  if (filter.taskCategory)
    params.append("taskCategoryName", filter.taskCategory);
  if (filter.batchName) params.append("batchName", filter.batchName);
  if (filter.taskCriteriaDescription)
    params.append("taskCriteriaDescription", filter.taskCriteriaDescription);
  if (filter.search) params.append("search", filter.search);
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};
