import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { fetchTask, fetchAllTaskCategories } from "../../query/task";
import { fetchAllBatchByMe } from "../../query/batch";
import { fonts } from "../../utils/font";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import { useDispatch } from "react-redux";
import { setOngoing } from "../../redux/slice/ongoing";
import Badge from "../../components/common/Badge";

const SkeletonCard = () => (
  <MotiView
    style={{
      borderRadius: 8,
      marginBottom: 12,
      padding: 16,
      backgroundColor: "#F5F5F5",
    }}
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{
      type: "timing",
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      loop: true,
      repeatReverse: true,
    }}
  >
    <MotiView
      style={{
        height: 22,
        width: "70%",
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        marginBottom: 12,
      }}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        loop: true,
        type: "timing",
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }}
    />

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <MotiView
        style={{
          height: 16,
          width: "30%",
          backgroundColor: "#E0E0E0",
          borderRadius: 4,
        }}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }}
      />
      <MotiView
        style={{
          height: 16,
          width: "25%",
          backgroundColor: "#E0E0E0",
          borderRadius: 4,
        }}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }}
      />
    </View>

    <MotiView
      style={{
        height: 8,
        width: "100%",
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        marginBottom: 8,
      }}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        loop: true,
        type: "timing",
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }}
    />

    {/* Bottom text skeleton */}
    <MotiView
      style={{
        height: 16,
        width: "40%",
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        marginBottom: 12,
      }}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        loop: true,
        type: "timing",
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }}
    />

    {/* Button skeleton */}
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <MotiView
        style={{
          height: 36,
          width: "48%",
          backgroundColor: "#E0E0E0",
          borderRadius: 4,
        }}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }}
      />
      <MotiView
        style={{
          height: 36,
          width: "48%",
          backgroundColor: "#E0E0E0",
          borderRadius: 4,
        }}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }}
      />
    </View>
  </MotiView>
);

const SkeletonFilter = () => (
  <MotiView
    style={{
      height: 40,
      backgroundColor: "#E0E0E0",
      borderRadius: 4,
      marginBottom: 8,
    }}
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

const TaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter states - changed null to empty string
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create a filter object that includes the selected filters
  const filter = {
    page: currentPage,
    size: pageSize,
    sortBy: sortBy,
    direction: "asc",
    batchId: selectedBatch || undefined, // Add batchId to API filter
    categoryId: selectedCategory || undefined, // Add categoryId to API filter
    status: selectedStatus || undefined, // Add status to API filter
    taskCategoryName: undefined,
    batchName: undefined,
  };

  // Fetch tasks using the filter
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => fetchTask(filter),
    onError: (error) => {
      console.error("Error details:", error);
      console.error("Response data:", error.response?.data.data);
    },
  });

  // Fetch categories for filter dropdown
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["taskCategories"],
    queryFn: fetchAllTaskCategories,
  });

  // Fetch batches for filter dropdown
  const { data: batchesData, isLoading: isBatchesLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: () => fetchAllBatchByMe(filter),
  });

  const isLoading = isTasksLoading || isCategoriesLoading || isBatchesLoading;
  const isError = isTasksError;
  const error = tasksError;
  const data = tasksData;

  // Transform API data to match our component expectations
  const transformedTasks = React.useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((task) => {
      const batchTask = task.batchTasks[0] || {};

      return {
        id: task.id,
        name: task.name,
        category: task.taskCategory?.name || "Uncategorized",
        categoryId: task.taskCategory?.id || "",
        batch: batchTask.batchName || "Unknown Batch",
        batchNumber: batchTask.batchNumber || "",
        batchId: batchTask.batchId || "",
        deadline: batchTask.dueDate || new Date().toISOString(),
        assignedDate: batchTask.assignedDate || new Date().toISOString(),
        totalTrainees: batchTask.totalTrainees || 0,
        assessedTrainees: batchTask.assessedTrainees || 0,
        createdAt: batchTask.assignedDate || new Date().toISOString(),
        status: task.status || "ongoing",
      };
    });
  }, [data?.data]);

  // Changed null to empty string in the options
  const batchOptions = React.useMemo(() => {
    const defaultOption = [{ label: "All Batches", value: "" }];

    if (!batchesData?.data) return defaultOption;

    const batchOptions = batchesData.data.map((batch) => ({
      label: batch.name,
      value: batch.id,
    }));

    return [...defaultOption, ...batchOptions];
  }, [batchesData?.data]);

  // Changed null to empty string in the options
  const categoryOptions = React.useMemo(() => {
    const defaultOption = [{ label: "All Categories", value: "" }];

    if (!categoriesData?.data) return defaultOption;

    const categoryOptions = categoriesData.data.map((category) => ({
      label: category.name,
      value: category.id,
    }));

    return [...defaultOption, ...categoryOptions];
  }, [categoriesData?.data]);

  // Changed null to empty string in the options
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Assessed", value: "assessed" },
    { label: "Not Assessed", value: "not_assessed" },
  ];

  const sortOptions = [
    { label: "Due Date (closest first)", value: "dueDate" },
    { label: "Assigned Date (newest first)", value: "assignedDate" },
    { label: "Name (A-Z)", value: "name" },
  ];

  // Check if a task is ongoing (between assigned date and due date)
  const isTaskOngoing = (task) => {
    const currentDate = new Date();
    const assignedDate = new Date(task.assignedDate);
    const dueDate = new Date(task.deadline);

    return currentDate >= assignedDate && currentDate < dueDate;
  };

  // Updated filtering logic to use local filtering for additional filtering beyond what the API provides
  const filteredTasks = transformedTasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Tab filter
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "ongoing" && isTaskOngoing(task)) ||
      (selectedTab === "completed" &&
        task.assessedTrainees === task.totalTrainees);

    return matchesSearch && matchesTab;
  });

  const onlyOnGoingTasks = filteredTasks.filter((task) =>
    isTaskOngoing(task) ? task : null
  );

  useEffect(() => {
    dispatch(setOngoing(onlyOnGoingTasks));
  }, [onlyOnGoingTasks, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTaskStatusColor = (task) => {
    const ratio = task.assessedTrainees / task.totalTrainees;

    if (ratio === 0) return "#E1E1E1";
    if (ratio === 1) return "#43936C";

    // Check if task is past deadline
    const isOverdue = new Date(task.deadline) < new Date();
    if (isOverdue) return "#CB3A31"; // Overdue - Alert

    return "#233D90"; // In progress - Primary
  };

  const handleAddTask = () => {
    navigation.navigate("CreateTaskScreen");
  };

  const handleDetailTask = (taskId) => {
    navigation.navigate("DetailTaskScreen", { taskId });
  };

  const renderTaskItem = ({ item }) => {
    const progressPercentage =
      (item.assessedTrainees / item.totalTrainees) * 100;
    const statusColor = getTaskStatusColor(item);
    const isOverdue = new Date(item.deadline) < new Date();

    return (
      <Card
        title={item.name}
        variant="neutral"
        className="mb-3"
        collapsible={false}
        action={
          <View className="flex-row justify-between">
            <Button
              title="View Details"
              variant="primary"
              type="outlined"
              onPress={() => handleDetailTask(item.id)}
              icon={
                <MaterialIcons name="visibility" size={16} color="#233D90" />
              }
              iconPosition="left"
            />
            <Button
              title="Assess"
              variant="primary"
              icon={
                <MaterialIcons name="assessment" size={16} color="#FFFFFF" />
              }
              iconPosition="left"
            />
          </View>
        }
      >
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Text style={fonts.ecTextBody2} className="text-primary-500 mr-2">
                {item.category}
              </Text>
              <View className="bg-neutral-100 px-2 py-1 rounded">
                <Text style={fonts.ecTextBody3} className="text-neutral-600">
                  {item.batch}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons
                name="event"
                size={16}
                color={isOverdue ? "#CB3A31" : "#757575"}
              />
              <Text
                style={fonts.ecTextBody2}
                className={`ml-1 ${
                  isOverdue ? "text-alert-500" : "text-neutral-500"
                }`}
              >
                {formatDate(item.deadline)}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View className="mb-1">
            <View className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: statusColor,
                }}
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text style={fonts.ecTextBody3} className="text-neutral-600">
              {item.assessedTrainees}/{item.totalTrainees} trainees assessed
            </Text>

            {isOverdue && (
              <View className="bg-alert-50 px-2 py-1 rounded">
                <Text style={fonts.ecTextBody3} className="text-alert-700">
                  Overdue
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-8">
      <MaterialIcons name="assignment" size={48} color="#C2C2C2" />
      <Text style={fonts.ecTextSubtitle1} className="text-neutral-500 mt-2">
        No tasks found
      </Text>
      <Text
        style={fonts.ecTextBody2}
        className="text-neutral-400 text-center mt-1 px-6"
      >
        Try adjusting your filters or create a new task to get started
      </Text>
    </View>
  );

  const renderSkeletonList = () => (
    <View style={{ padding: 16 }}>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </View>
  );

  // Updated to set empty strings
  const handleResetFilters = () => {
    setSelectedBatch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("name");
    // Reset to first page when filters change
    setCurrentPage(1);
    // Refetch with new parameters
    refetchTasks();
  };

  const handleApplyFilters = () => {
    setIsFilterVisible(false);
    // Reset to first page when filters change
    setCurrentPage(1);
    // Refetch with new parameters
    refetchTasks();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar backgroundColor="#233D90" barStyle="light-content" />

      {/* Header */}
      <View className="bg-primary-500 p-4">
        <View className="flex-row justify-between items-center">
          <Text style={fonts.ecTextHeader2M} className="text-white">
            Tasks
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="add-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-3 flex-row items-center bg-white rounded-lg px-3 py-1">
          <MaterialIcons name="search" size={20} color="#757575" />
          <TextInput
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 p-2"
            placeholderTextColor="#9A9A9A"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="clear" size={20} color="#757575" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tab Filter */}
      <View className="flex-row p-2 bg-neutral-100">
        <TouchableOpacity
          className={`flex-1 py-2 items-center ${
            selectedTab === "all" ? "border-b-2 border-primary-500" : ""
          }`}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={fonts.ecTextBody2}
            className={
              selectedTab === "all" ? "text-primary-500" : "text-neutral-600"
            }
          >
            All{" "}
            <Badge
              text={transformedTasks.length}
              size="small"
              color="primary"
            />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2 items-center ${
            selectedTab === "ongoing" ? "border-b-2 border-primary-500" : ""
          }`}
          onPress={() => setSelectedTab("ongoing")}
        >
          <Text
            style={fonts.ecTextBody2}
            className={
              selectedTab === "ongoing"
                ? "text-primary-500"
                : "text-neutral-600"
            }
          >
            Ongoing{" "}
            <Badge
              text={onlyOnGoingTasks.length}
              size="small"
              color="primary"
            />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2 items-center ${
            selectedTab === "completed" ? "border-b-2 border-primary-500" : ""
          }`}
          onPress={() => setSelectedTab("completed")}
        >
          <Text
            style={fonts.ecTextBody2}
            className={
              selectedTab === "completed"
                ? "text-primary-500"
                : "text-neutral-600"
            }
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Toggle Button */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-neutral-50 p-3 border-b border-neutral-200"
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      >
        <View className="flex-row items-center">
          <MaterialIcons name="filter-list" size={20} color="#233D90" />
          <Text style={fonts.ecTextBody2} className="text-primary-500 ml-1">
            Filters & Sort
          </Text>
        </View>
        <MaterialIcons
          name={isFilterVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#757575"
        />
      </TouchableOpacity>

      {/* Filter Panel */}
      {isFilterVisible && (
        <View className="bg-neutral-50 p-4 border-b border-neutral-200">
          {isLoading ? (
            // Skeleton loading for filter panel
            <View>
              <View className="flex-row justify-between mb-3">
                <View className="flex-1 mr-2">
                  <MotiView
                    style={{
                      height: 16,
                      width: "50%",
                      marginBottom: 8,
                      backgroundColor: "#E0E0E0",
                      borderRadius: 4,
                    }}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      loop: true,
                      type: "timing",
                      duration: 800,
                      easing: Easing.inOut(Easing.ease),
                    }}
                  />
                  <SkeletonFilter />
                </View>
                <View className="flex-1 ml-2">
                  <MotiView
                    style={{
                      height: 16,
                      width: "50%",
                      marginBottom: 8,
                      backgroundColor: "#E0E0E0",
                      borderRadius: 4,
                    }}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      loop: true,
                      type: "timing",
                      duration: 800,
                      easing: Easing.inOut(Easing.ease),
                    }}
                  />
                  <SkeletonFilter />
                </View>
              </View>
              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <MotiView
                    style={{
                      height: 16,
                      width: "50%",
                      marginBottom: 8,
                      backgroundColor: "#E0E0E0",
                      borderRadius: 4,
                    }}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      loop: true,
                      type: "timing",
                      duration: 800,
                      easing: Easing.inOut(Easing.ease),
                    }}
                  />
                  <SkeletonFilter />
                </View>
                <View className="flex-1 ml-2">
                  <MotiView
                    style={{
                      height: 16,
                      width: "50%",
                      marginBottom: 8,
                      backgroundColor: "#E0E0E0",
                      borderRadius: 4,
                    }}
                    from={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      loop: true,
                      type: "timing",
                      duration: 800,
                      easing: Easing.inOut(Easing.ease),
                    }}
                  />
                  <SkeletonFilter />
                </View>
              </View>
              <View className="flex-row">
                <MotiView
                  style={{
                    height: 36,
                    flex: 1,
                    marginRight: 8,
                    backgroundColor: "#E0E0E0",
                    borderRadius: 4,
                  }}
                  from={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    loop: true,
                    type: "timing",
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                  }}
                />
                <MotiView
                  style={{
                    height: 36,
                    flex: 1,
                    marginLeft: 8,
                    backgroundColor: "#E0E0E0",
                    borderRadius: 4,
                  }}
                  from={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    loop: true,
                    type: "timing",
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                  }}
                />
              </View>
            </View>
          ) : (
            <>
              <View className="flex-row justify-between mb-3">
                <View className="flex-1 mr-2">
                  <Text
                    style={fonts.ecTextBody3}
                    className="text-neutral-600 mb-1"
                  >
                    Batch
                  </Text>
                  <Select
                    options={batchOptions}
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                    placeholder="Select Batch"
                    variant="rounded"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text
                    style={fonts.ecTextBody3}
                    className="text-neutral-600 mb-1"
                  >
                    Category
                  </Text>
                  <Select
                    options={categoryOptions}
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    placeholder="Select Category"
                    variant="rounded"
                  />
                </View>
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text
                    style={fonts.ecTextBody3}
                    className="text-neutral-600 mb-1"
                  >
                    Status
                  </Text>
                  <Select
                    options={statusOptions}
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    placeholder="Select Status"
                    variant="rounded"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text
                    style={fonts.ecTextBody3}
                    className="text-neutral-600 mb-1"
                  >
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

              <View className="flex-row">
                <Button
                  title="Reset Filters"
                  variant="neutral"
                  type="outlined"
                  className="flex-1 mr-2"
                  onPress={handleResetFilters}
                />
                <Button
                  title="Apply Filters"
                  variant="primary"
                  className="flex-1 ml-2"
                  onPress={handleApplyFilters}
                />
              </View>
            </>
          )}
        </View>
      )}

      {/* Task List */}
      {isLoading ? (
        renderSkeletonList()
      ) : isError ? (
        <View className="p-4">
          <Alert
            variant="alert"
            title="Error"
            message={
              error?.message || "Failed to load tasks. Please try again later."
            }
          />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmptyList}
          onEndReached={() => {
            const paging = data?.paging;
            if (paging?.hasNext) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={refetchTasks}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-500 items-center justify-center elevation-5"
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={handleAddTask}
      >
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TaskScreen;
