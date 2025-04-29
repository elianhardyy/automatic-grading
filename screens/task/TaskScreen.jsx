import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { taskService } from "../../services/query/taskService";
import { batchService } from "../../services/query/batchService";

import { fonts } from "../../utils/font";

import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import InputGroup from "../../components/common/InputGroup";
import TaskList from "../../components/tasks/TaskList";

import { useDispatch } from "react-redux";
import { setOngoing } from "../../services/slice/ongoing";
import { traineeTaskService } from "../../services/query/traineeTaskService";
import { SafeAreaView } from "react-native-safe-area-context";

const SkeletonFilter = () => (
  <MotiView
    style={styles.skeletonFilter}
    from={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: "timing",
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    }}
  />
);

const transformTaskData = (task) => {
  const batchTask = task.batchTasks?.[0] || {};
  // console.log(task);
  return {
    id: task.id,
    batchTaskId: batchTask.id,
    name: task.name || "Untitled Task",
    category: task.taskCategory?.name || "Uncategorized",
    categoryId: task.taskCategory?.id || "",
    batch: batchTask.batchName || "N/A",
    batchNumber: batchTask.batchNumber || "",
    batchId: batchTask.batchId || "",
    deadline: batchTask.dueDate || new Date().toISOString(),
    assignedDate: batchTask.assignedDate || new Date().toISOString(),
    totalTrainees: batchTask.totalTrainees ?? 0,
    assessedTrainees: batchTask.assessedTrainees ?? 0,
    createdAt: batchTask.assignedDate || new Date().toISOString(),
    status: task.status || "ongoing",
  };
};

const TaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [pageSize] = useState(10);

  // Include selectedStatus in the query filter
  const queryFilter = useMemo(
    () => ({
      size: pageSize,
      sortBy: sortBy,
      direction:
        sortBy === "assignedDate" || sortBy === "dueDate" ? "desc" : "asc",
      batchName: selectedBatch || undefined,
      taskCategory: selectedCategory || undefined, // Ganti dari categoryId menjadi taskCategory
      status:
        selectedStatus === "assessed"
          ? "completed"
          : selectedStatus === "not_assessed"
          ? "incomplete"
          : undefined,
    }),
    [pageSize, sortBy, selectedBatch, selectedCategory, selectedStatus]
  );

  const {
    data: tasksPages,
    error: tasksError,
    isError: isTasksError,
    fetchNextPage,
    hasNextPage,
    isLoading: isTasksLoading,
    isFetchingNextPage,
    refetch: refetchTasks,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["tasks", queryFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await taskService.fetchTask({
        ...queryFilter,
        page: pageParam,
      });
      if (!response || typeof response !== "object")
        throw new Error("Invalid API response");
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.paging?.hasNext ? lastPage.paging.page + 1 : undefined,
    onError: (error) =>
      console.error(
        "Error fetching tasks query:",
        error?.message,
        error?.response?.data
      ),
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["taskCategories"],
    queryFn: taskService.fetchAllTaskCategories,
  });
  const { data: batchesData, isLoading: isBatchesLoading } = useQuery({
    queryKey: ["batchesByMe"],
    queryFn: () => batchService.fetchAllBatchByMe({ size: 1000 }),
  });

  const isFilterDataLoading = isCategoriesLoading || isBatchesLoading;
  const isOverallLoading = isTasksLoading && !tasksPages?.pages?.length;
  const isOverallError = isTasksError && !tasksPages?.pages?.length;
  const overallError = tasksError;

  const transformedTasks = useMemo(
    () =>
      tasksPages?.pages?.flatMap((page) =>
        Array.isArray(page?.data) ? page.data.map(transformTaskData) : []
      ) ?? [],
    [tasksPages?.pages]
  );

  const batchOptions = useMemo(() => {
    const defaultOption = [{ label: "All Batches", value: "" }];
    const batches = batchesData?.data?.data ?? batchesData?.data ?? [];
    if (!Array.isArray(batches)) return defaultOption;
    const batchOpts = batches.map((batch) => ({
      label: batch.name,
      value: batch.name,
    }));
    return [...defaultOption, ...batchOpts];
  }, [batchesData]);
  const categoryOptions = useMemo(() => {
    const defaultOption = [{ label: "All Categories", value: "" }];
    const categories = categoriesData?.data?.data ?? categoriesData?.data ?? [];
    if (!Array.isArray(categories)) return defaultOption;
    const categoryOpts = categories.map((category) => ({
      label: category.name,
      value: category.name,
    }));
    return [...defaultOption, ...categoryOpts];
  }, [categoriesData]);
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Assessed", value: "assessed" },
    { label: "Not Assessed", value: "not_assessed" },
  ];
  const sortOptions = [
    { label: "Name (A-Z)", value: "name" },
    { label: "Due Date (Newest First)", value: "dueDate" },
    { label: "Assigned Date (Newest First)", value: "assignedDate" },
  ];

  const isTaskOngoing = (task) => {
    try {
      const currentDate = new Date();
      const assignedDate = new Date(task.assignedDate);
      const dueDate = new Date(task.deadline);
      if (isNaN(assignedDate.getTime()) || isNaN(dueDate.getTime()))
        return false;
      return currentDate >= assignedDate && currentDate < dueDate;
    } catch {
      return false;
    }
  };

  const filteredTasks = useMemo(() => {
    let tasksToFilter = transformedTasks;

    if (searchQuery) {
      tasksToFilter = tasksToFilter.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTab !== "all") {
      tasksToFilter = tasksToFilter.filter((task) => {
        if (selectedTab === "ongoing") return isTaskOngoing(task);
        if (selectedTab === "completed")
          return (
            task.totalTrainees > 0 &&
            task.assessedTrainees === task.totalTrainees
          );
        return true;
      });
    }

    // Don't double-filter for status since we're sending it to the API
    return tasksToFilter;
  }, [transformedTasks, searchQuery, selectedTab]);

  const onlyOnGoingTasks = useMemo(
    () => filteredTasks.filter(isTaskOngoing),
    [filteredTasks]
  );
  useEffect(() => {
    dispatch(setOngoing(onlyOnGoingTasks));
  }, [onlyOnGoingTasks, dispatch]);

  const handleAddTask = () => navigation.navigate("CreateTaskScreen");
  const handleDetailTask = (taskId) =>
    navigation.navigate("DetailTaskScreen", { taskId });
  const handleAssessTask = (taskId, batchId, item, batchTaskId) => {
    navigation.navigate("AssessmentTaskScreen", { batchTaskId });
  };
  // const traineeTaskBatch =
  //   traineeTaskService.fetchAllTraineeTaskByBatchTaskId();
  // const { data: traineeTaskAssessed } = useQuery({
  //   queryKey: ["traineeTaskAssessed"],
  //   queryFn: async () =>
  //     traineeTaskService.fetchAllTraineeTaskByBatchTaskId(batchTaskId),
  // });
  const handleResetFilters = () => {
    setSelectedBatch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("name");
    setSearchQuery("");
  };

  const handleApplyFilters = () => {
    // Trigger refetch when applying filters
    refetchTasks();
    setIsFilterVisible(false);
  };

  const filtersApplied = useMemo(() => {
    return (
      !!selectedBatch ||
      !!selectedCategory ||
      !!selectedStatus ||
      sortBy !== "name"
    );
  }, [selectedBatch, selectedCategory, selectedStatus, sortBy]);

  const countAll = filteredTasks.length;
  const countOngoing = onlyOnGoingTasks.length;
  const countCompleted = filteredTasks.filter(
    (t) => t.totalTrainees > 0 && t.assessedTrainees === t.totalTrainees
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#233D90" barStyle="light-content" />

      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={[fonts.ecTextHeader2M, styles.headerTitle]}>
            Manage Tasks
          </Text>
          <TouchableOpacity
            onPress={handleAddTask}
            style={styles.headerAddButton}
          >
            <MaterialIcons name="add-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <InputGroup
          placeholder="Search task name..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            // Allow a delay before filtering to avoid excessive API calls
            // if your API supports searching, you could include it in queryFilter
          }}
          variant="rounded"
          prefixIcon="search"
          iconPosition="left"
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === "all" && styles.tabItemActive,
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                fonts.ecTextBody3,
                styles.tabText,
                selectedTab === "all" && styles.tabTextActive,
              ]}
            >
              All
            </Text>
            {!isOverallLoading && (
              <Badge
                text={countAll}
                color="primary"
                size="small"
                style={styles.tabBadge}
                variant={selectedTab === "all" ? "filled" : "outlined"}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === "ongoing" && styles.tabItemActive,
          ]}
          onPress={() => setSelectedTab("ongoing")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                fonts.ecTextBody3,
                styles.tabText,
                selectedTab === "ongoing" && styles.tabTextActive,
              ]}
            >
              Ongoing
            </Text>
            {!isOverallLoading && (
              <Badge
                text={countOngoing}
                color="primary"
                size="small"
                style={styles.tabBadge}
                variant={selectedTab === "ongoing" ? "filled" : "outlined"}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === "completed" && styles.tabItemActive,
          ]}
          onPress={() => setSelectedTab("completed")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                fonts.ecTextBody3,
                styles.tabText,
                selectedTab === "completed" && styles.tabTextActive,
              ]}
            >
              Completed
            </Text>
            {!isOverallLoading && (
              <Badge
                text={countCompleted}
                color="primary"
                size="small"
                style={styles.tabBadge}
                variant={selectedTab === "completed" ? "filled" : "outlined"}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.filterToggleButton}
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      >
        <View style={styles.filterToggleLeft}>
          <MaterialIcons name="filter-list" size={20} color="#233D90" />
          <Text style={[fonts.ecTextBody2, styles.filterToggleText]}>
            Filters & Sort
          </Text>
          {filtersApplied && <View style={styles.filterActiveIndicator} />}
        </View>
        <MaterialIcons
          name={isFilterVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#757575"
        />
      </TouchableOpacity>

      {isFilterVisible && (
        <View style={styles.filterPanel}>
          {isFilterDataLoading ? (
            <View>
              <View style={styles.filterSkeletonRow}>
                <View style={styles.filterSkeletonColumn}>
                  <MotiView
                    style={styles.filterSkeletonLabel}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={styles.skeletonTransition}
                  />
                  <SkeletonFilter />
                </View>
                <View style={styles.filterSkeletonColumn}>
                  <MotiView
                    style={styles.filterSkeletonLabel}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={styles.skeletonTransition}
                  />
                  <SkeletonFilter />
                </View>
              </View>
              <View style={styles.filterSkeletonRow}>
                <View style={styles.filterSkeletonColumn}>
                  <MotiView
                    style={styles.filterSkeletonLabel}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={styles.skeletonTransition}
                  />
                  <SkeletonFilter />
                </View>
                <View style={styles.filterSkeletonColumn}>
                  <MotiView
                    style={styles.filterSkeletonLabel}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={styles.skeletonTransition}
                  />
                  <SkeletonFilter />
                </View>
              </View>
              <View style={styles.filterButtonSkeletonContainer}>
                <MotiView
                  style={styles.filterButtonSkeleton}
                  from={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={styles.skeletonTransition}
                />
                <MotiView
                  style={styles.filterButtonSkeleton}
                  from={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={styles.skeletonTransition}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.filterRow}>
                <View style={styles.filterColumn}>
                  <Text style={[fonts.ecTextBody3, styles.filterLabel]}>
                    Batch
                  </Text>
                  <Select
                    options={batchOptions}
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                    placeholder="All Batches"
                    variant="rounded"
                  />
                </View>
                <View style={styles.filterColumn}>
                  <Text style={[fonts.ecTextBody3, styles.filterLabel]}>
                    Category
                  </Text>
                  <Select
                    options={categoryOptions}
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    placeholder="All Categories"
                    variant="rounded"
                  />
                </View>
              </View>
              <View style={styles.filterRow}>
                <View style={styles.filterColumn}>
                  <Text style={[fonts.ecTextBody3, styles.filterLabel]}>
                    Status
                  </Text>
                  <Select
                    options={statusOptions}
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    placeholder="All Status"
                    variant="rounded"
                  />
                </View>
                <View style={styles.filterColumn}>
                  <Text style={[fonts.ecTextBody3, styles.filterLabel]}>
                    Sort By
                  </Text>
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onValueChange={setSortBy}
                    placeholder="Sort By"
                    variant="rounded"
                  />
                </View>
              </View>
              <View style={styles.filterButtonContainer}>
                <Button
                  title="Reset"
                  color="neutral"
                  type="outlined"
                  className="flex-1 mr-2"
                  onPress={handleResetFilters}
                />
                <Button
                  title="Apply"
                  color="primary"
                  type="base"
                  className="flex-1 ml-2"
                  onPress={handleApplyFilters}
                />
              </View>
            </>
          )}
        </View>
      )}

      <View style={styles.listContainer}>
        {isOverallError ? (
          <View style={styles.errorContainer}>
            <Alert
              variant="alert"
              title="Failed to Load Tasks"
              message={
                overallError?.message ||
                "Could not fetch tasks. Please check connection and retry."
              }
              className="w-full mb-4"
            />
            <Button
              title="Retry"
              onPress={() => refetchTasks()}
              color="primary"
              type="base"
            />
          </View>
        ) : (
          <TaskList
            tasks={filteredTasks}
            isLoading={isOverallLoading}
            isRefetching={isRefetching}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onEndReached={fetchNextPage}
            onRefresh={refetchTasks}
            onItemPress={handleDetailTask}
            onAssessPress={handleAssessTask}
            onAddTaskPress={handleAddTask}
            onResetFiltersPress={handleResetFilters}
            searchQuery={searchQuery}
            filtersApplied={filtersApplied}
            isError={isTasksError}
          />
        )}
      </View>

      {!isFilterVisible && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddTask}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  headerContainer: {
    backgroundColor: "#233D90",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { color: "#FFFFFF" },
  headerAddButton: { padding: 4 },
  tabContainer: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabItemActive: { backgroundColor: "#E0E7FF" },
  tabContent: { flexDirection: "row", alignItems: "center" },
  tabText: { color: "#4B5563" },
  tabTextActive: { color: "#1D4ED8", fontWeight: "500" },
  tabBadge: { marginLeft: 6 },
  filterToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterToggleLeft: { flexDirection: "row", alignItems: "center" },
  filterToggleText: { color: "#1D4ED8", marginLeft: 6 },
  filterActiveIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    marginLeft: 8,
  },
  filterPanel: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterColumn: { flex: 1, marginHorizontal: 4 },
  filterLabel: { color: "#4B5563", marginBottom: 4 },
  filterButtonContainer: { flexDirection: "row", marginTop: 8 },
  filterSkeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterSkeletonColumn: { flex: 1, marginHorizontal: 4 },
  filterSkeletonLabel: {
    height: 14,
    width: "40%",
    marginBottom: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  filterButtonSkeletonContainer: { flexDirection: "row", marginTop: 8 },
  filterButtonSkeleton: {
    height: 44,
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  skeletonFilter: {
    height: 48,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonTransition: {
    loop: true,
    type: "timing",
    duration: 800,
    easing: Easing.inOut(Easing.ease),
  },
  listContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B18",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default TaskScreen;
