import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
// Pastikan MaterialIcons diimpor dengan benar
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// --- Import Query ---
import { fetchTask, fetchAllTaskCategories } from "../../query/task";
import { fetchAllBatchByMe } from "../../query/batch";

// --- Import Utils ---
import { fonts } from "../../utils/font";

// --- Import Komponen Kustom Anda ---
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import InputGroup from "../../components/common/InputGroup"; // Pastikan InputGroup mendukung ikon

// --- Import Redux ---
import { useDispatch } from "react-redux";
import { setOngoing } from "../../redux/slice/ongoing";

// --- Skeleton Components ---
// ... (SkeletonCard, SkeletonFilter tetap sama) ...
const SkeletonCard = () => (
  <MotiView
    style={styles.skeletonCardContainer}
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
      style={styles.skeletonLineLong}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={styles.skeletonTransition}
    />
    <View style={styles.skeletonRowSpaceBetween}>
      <MotiView
        style={styles.skeletonLineMedium}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
      <MotiView
        style={styles.skeletonLineShort}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
    </View>
    <MotiView
      style={styles.skeletonProgressBar}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={styles.skeletonTransition}
    />
    <MotiView
      style={styles.skeletonLineMedium}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={styles.skeletonTransition}
    />
    <View style={[styles.skeletonRowSpaceBetween, { marginTop: 12 }]}>
      <MotiView
        style={styles.skeletonButton}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
      <MotiView
        style={styles.skeletonButton}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
    </View>
  </MotiView>
);

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
// ----------------------------------------------------

// ... (transformTaskData, useInfiniteQuery, useQuery, filter options, etc. tetap sama) ...
const transformTaskData = (task) => {
  const batchTask = task.batchTasks?.[0] || {};
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

  const queryFilter = useMemo(
    () => ({
      size: pageSize,
      sortBy: sortBy,
      direction:
        sortBy === "assignedDate" || sortBy === "dueDate" ? "desc" : "asc",
      batchId: selectedBatch || undefined,
      categoryId: selectedCategory || undefined,
    }),
    [pageSize, sortBy, selectedBatch, selectedCategory]
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
      const response = await fetchTask({ ...queryFilter, page: pageParam });
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
    queryFn: fetchAllTaskCategories,
  });
  const { data: batchesData, isLoading: isBatchesLoading } = useQuery({
    queryKey: ["batchesByMe"],
    queryFn: () => fetchAllBatchByMe({ size: 1000 }),
  });

  const isFilterDataLoading = isCategoriesLoading || isBatchesLoading;
  const isOverallLoading = isTasksLoading;
  const isOverallError = isTasksError;
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
      value: batch.id,
    }));
    return [...defaultOption, ...batchOpts];
  }, [batchesData]);
  const categoryOptions = useMemo(() => {
    const defaultOption = [{ label: "All Categories", value: "" }];
    const categories = categoriesData?.data?.data ?? categoriesData?.data ?? [];
    if (!Array.isArray(categories)) return defaultOption;
    const categoryOpts = categories.map((category) => ({
      label: category.name,
      value: category.id,
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
    if (searchQuery)
      tasksToFilter = tasksToFilter.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
    return tasksToFilter;
  }, [transformedTasks, searchQuery, selectedTab, selectedStatus]);
  const onlyOnGoingTasks = useMemo(
    () => filteredTasks.filter(isTaskOngoing),
    [filteredTasks]
  );
  useEffect(() => {
    dispatch(setOngoing(onlyOnGoingTasks));
  }, [onlyOnGoingTasks, dispatch]);

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString(undefined, options);
    } catch {
      return "Invalid Date";
    }
  };
  const getTaskStatusColor = (task) => {
    const total = task.totalTrainees ?? 0;
    const assessed = task.assessedTrainees ?? 0;
    const ratio = total > 0 ? assessed / total : 0;
    let isOverdue = false;
    try {
      isOverdue = new Date(task.deadline) < new Date();
      if (isNaN(new Date(task.deadline).getTime())) isOverdue = false;
    } catch {
      isOverdue = false;
    }
    if (ratio === 1 && total > 0) return "#43936C";
    if (isOverdue) return "#CB3A31";
    if (ratio === 0) return "#E1E1E1";
    return "#233D90";
  };

  const handleAddTask = () => navigation.navigate("CreateTaskScreen");
  const handleDetailTask = (taskId) =>
    navigation.navigate("DetailTaskScreen", { taskId });
  const handleAssessTask = (taskId, batchId, item, batchTaskId) =>
      {navigation.navigate("AssessmentTaskScreen", { batchTaskId })}

  // --- Render Item Task ---
  const renderTaskItem = ({ item }) => {
    const total = item.totalTrainees ?? 0;
    const assessed = item.assessedTrainees ?? 0;
    const progressPercentage = total > 0 ? (assessed / total) * 100 : 0;
    const statusColor = getTaskStatusColor(item);
    let isOverdue = false;
    try {
      isOverdue = new Date(item.deadline) < new Date();
      if (isNaN(new Date(item.deadline).getTime())) isOverdue = false;
    } catch {
      isOverdue = false;
    }

    return (
      <Card
        title={item.name}
        variant="neutral"
        className="mb-3"
        collapsible={false}
        action={
          <View style={styles.cardActionContainer}>
            {/* --- PERBAIKAN ICON BUTTON --- */}
            <Button
              title="View Details"
              color="primary"
              type="outlined"
              onPress={() => handleDetailTask(item.id)}
              icon={
                <MaterialIcons name="visibility" size={16} color="#233D90" />
              } // Kembali ke visibility
              iconPosition="left"
              className="flex-1 mr-1"
            />
            <Button
              title="Assess"
              color="primary"
              type="base"
              onPress={() => handleAssessTask(item.id, item.batchId, item, item.batchTaskId)}
              icon={
                <MaterialIcons name="assessment" size={16} color="#FFFFFF" />
              } // Tetap assessment
              iconPosition="left"
              className="flex-1 ml-1"
              disabled={assessed === total && total > 0}
            />
            {/* ----------------------------- */}
          </View>
        }
      >
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardTopLeft}>
              {item.category && item.category !== "Uncategorized" && (
                <Badge
                  text={item.category}
                  color="primary"
                  size="small"
                  variant="outlined"
                  style={styles.categoryBadge}
                />
              )}
              {item.batch && item.batch !== "N/A" && (
                <View style={styles.batchContainer}>
                  {/* --- PERBAIKAN ICON BATCH --- */}
                  <MaterialIcons
                    name="group"
                    size={12}
                    color="#757575"
                    style={styles.batchIcon}
                  />
                  {/* -------------------------- */}
                  <Text style={[fonts.ecTextCaption, styles.batchText]}>
                    {item.batch}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.cardTopRight}>
              {/* --- PERBAIKAN ICON DEADLINE --- */}
              <MaterialIcons
                name="event"
                size={16}
                color={
                  isOverdue && progressPercentage < 100 ? "#CB3A31" : "#757575"
                }
              />
              {/* ----------------------------- */}
              <Text
                style={[
                  fonts.ecTextBody3,
                  styles.deadlineText,
                  isOverdue && progressPercentage < 100 && styles.overdueText,
                ]}
              >
                {formatDate(item.deadline)}
              </Text>
            </View>
          </View>

          {total > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: statusColor,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <View style={styles.cardBottomRow}>
            <Text
              style={[fonts.ecTextCaption, styles.progressText]}
            >{`${assessed}/${total} assessed`}</Text>
            {isOverdue && progressPercentage < 100 && (
              <Badge
                text="Overdue"
                color="alert"
                size="small"
                variant="filled"
              />
            )}
            {progressPercentage === 100 && total > 0 && (
              <Badge
                text="Completed"
                color="success"
                size="small"
                variant="filled"
              />
            )}
          </View>
        </View>
      </Card>
    );
  };

  // --- Render Empty State ---
  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      {/* --- PERBAIKAN ICON EMPTY LIST --- */}
      <MaterialIcons name="assignment-late" size={56} color="#D1D5DB" />
      {/* ------------------------------- */}
      <Text style={[fonts.ecTextSubtitle1, styles.emptyListTitle]}>
        No Tasks Found
      </Text>
      <Text style={[fonts.ecTextBody2, styles.emptyListMessage]}>
        {!searchQuery && !selectedBatch && !selectedCategory && !selectedStatus
          ? "There are no tasks matching your current view. Try creating one!"
          : "No tasks match your current search or filter criteria. Try adjusting them."}
      </Text>
      {!searchQuery &&
        !selectedBatch &&
        !selectedCategory &&
        !selectedStatus &&
        !isTasksLoading && (
          <Button
            title="Create New Task"
            onPress={handleAddTask}
            color="primary"
            type="base"
          />
        )}
      {(searchQuery || selectedBatch || selectedCategory || selectedStatus) &&
        !isTasksLoading && (
          <Button
            title="Reset Filters"
            onPress={handleResetFilters}
            color="neutral"
            type="outlined"
          />
        )}
      {isOverallError && !isTasksLoading && (
        <Button
          title="Try Refresh"
          onPress={() => refetchTasks()}
          color="primary"
          type="outlined"
          style={styles.emptyListRefreshButton}
        />
      )}
    </View>
  );

  // --- Render Skeleton List ---
  const renderSkeletonList = () => (
    <View style={styles.skeletonListContainer}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </View>
  );

  // --- Filter Handlers ---
  const handleResetFilters = () => {
    setSelectedBatch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("name");
    setSearchQuery("");
  };
  const handleApplyFilters = () => {
    setIsFilterVisible(false);
  };

  // --- Render Footer Loading ---
  const renderListFooter = () =>
    isFetchingNextPage ? (
      <ActivityIndicator
        size="large"
        color="#233D90"
        style={styles.listFooterLoader}
      />
    ) : null;

  // --- Hitung Jumlah untuk Badge Tab ---
  const countAll = filteredTasks.length;
  const countOngoing = onlyOnGoingTasks.length;
  const countCompleted = filteredTasks.filter(
    (t) => t.totalTrainees > 0 && t.assessedTrainees === t.totalTrainees
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#233D90" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={[fonts.ecTextHeader2M, styles.headerTitle]}>
            Manage Tasks
          </Text>
          {/* --- PERBAIKAN ICON ADD HEADER --- */}
          <TouchableOpacity
            onPress={handleAddTask}
            style={styles.headerAddButton}
          >
            <MaterialIcons name="add-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {/* ------------------------------- */}
        </View>
        <InputGroup
          placeholder="Search task name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          variant="rounded"
          // --- PERBAIKAN ICON SEARCH ---
          prefixIcon="search" // Pastikan InputGroup Anda menerima prop ini dan menggunakan MaterialIcons
          // ---------------------------
          iconPosition="left"
          // Tambahkan prop/logika untuk tombol clear jika diperlukan
          // suffixIcon={searchQuery ? 'clear' : ''}
          // onSuffixIconPress={() => setSearchQuery('')}
        />
      </View>

      {/* Tab Filter */}
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
            <Badge
              text={countAll}
              color="primary"
              size="small"
              style={styles.tabBadge}
              variant={selectedTab === "all" ? "filled" : "outlined"}
            />
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
            <Badge
              text={countOngoing}
              color="primary"
              size="small"
              style={styles.tabBadge}
              variant={selectedTab === "ongoing" ? "filled" : "outlined"}
            />
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
            <Badge
              text={countCompleted}
              color="primary"
              size="small"
              style={styles.tabBadge}
              variant={selectedTab === "completed" ? "filled" : "outlined"}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Filter Toggle Button */}
      <TouchableOpacity
        style={styles.filterToggleButton}
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      >
        <View style={styles.filterToggleLeft}>
          {/* --- PERBAIKAN ICON FILTER TOGGLE --- */}
          <MaterialIcons name="filter-list" size={20} color="#233D90" />
          {/* -------------------------------- */}
          <Text style={[fonts.ecTextBody2, styles.filterToggleText]}>
            Filters & Sort
          </Text>
          {(selectedBatch ||
            selectedCategory ||
            selectedStatus ||
            sortBy !== "name") && <View style={styles.filterActiveIndicator} />}
        </View>
        {/* --- PERBAIKAN ICON ARROW TOGGLE --- */}
        <MaterialIcons
          name={isFilterVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#757575"
        />
        {/* --------------------------------- */}
      </TouchableOpacity>

      {/* Filter Panel */}
      {/* ... (Filter Panel tetap sama, tidak ada ikon yang perlu diubah di dalamnya kecuali jika komponen Select Anda menggunakannya) ... */}
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

      {/* Task List */}
      {isOverallLoading && !isRefetching && !tasksPages?.pages?.length ? (
        renderSkeletonList()
      ) : isOverallError && !tasksPages?.pages?.length ? (
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
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            !isOverallLoading && !isRefetching ? renderEmptyList : null
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.7}
          ListFooterComponent={renderListFooter}
          refreshing={isRefetching}
          onRefresh={refetchTasks}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {!isFilterVisible && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddTask}
          activeOpacity={0.8}
        >
          {/* --- PERBAIKAN ICON FAB --- */}
          <MaterialIcons name="add" size={30} color="#FFFFFF" />
          {/* ------------------------- */}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// --- StyleSheet ---
// ... (StyleSheet tetap sama seperti sebelumnya) ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" }, // neutral-50
  // Header
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
  // Tabs
  tabContainer: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  }, // neutral-200
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabItemActive: { backgroundColor: "#E0E7FF" }, // primary-50
  tabContent: { flexDirection: "row", alignItems: "center" },
  tabText: { color: "#4B5563" }, // neutral-600
  tabTextActive: { color: "#1D4ED8", fontWeight: "500" }, // primary-600
  tabBadge: { marginLeft: 6 },
  // Filter Toggle
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
  filterToggleText: { color: "#1D4ED8", marginLeft: 6 }, // primary-600
  filterActiveIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    marginLeft: 8,
  }, // secondary-500
  // Filter Panel
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
  filterLabel: { color: "#4B5563", marginBottom: 4 }, // neutral-600
  filterButtonContainer: { flexDirection: "row", marginTop: 8 },
  // Filter Skeletons
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
  // Card Item
  cardActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardBody: { marginBottom: 4 },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTopLeft: { flexShrink: 1, marginRight: 8 },
  categoryBadge: { marginBottom: 4 },
  batchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  batchIcon: { marginRight: 4 },
  batchText: { color: "#4B5563" }, // neutral-600
  cardTopRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: "auto",
    paddingTop: 4,
  },
  deadlineText: { marginLeft: 4 },
  overdueText: { color: "#EF4444" }, // alert-500
  progressBarContainer: { marginVertical: 8 },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  }, // neutral-200
  progressBarFill: { height: "100%", borderRadius: 3 },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  progressText: { color: "#4B5563" }, // neutral-600
  // List
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
  },
  listFooterLoader: { marginVertical: 32 },
  // Empty List
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 32,
  }, // Added paddingBottom
  emptyListTitle: { color: "#4B5563", marginTop: 16, textAlign: "center" }, // neutral-600
  emptyListMessage: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  }, // neutral-500
  emptyListRefreshButton: { marginTop: 16 },
  // Error State
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  // Skeleton List
  skeletonListContainer: { paddingHorizontal: 16, paddingTop: 16 },
  // Skeleton Card Styles
  skeletonCardContainer: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#F3F4F6",
  }, // neutral-100
  skeletonTransition: {
    loop: true,
    type: "timing",
    duration: 800,
    easing: Easing.inOut(Easing.ease),
  },
  skeletonLineLong: {
    height: 22,
    width: "70%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 12,
  }, // neutral-200
  skeletonRowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skeletonLineMedium: {
    height: 16,
    width: "40%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  skeletonLineShort: {
    height: 16,
    width: "25%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  skeletonProgressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 8,
  },
  skeletonButton: {
    height: 44,
    width: "48%",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  skeletonFilter: {
    height: 48,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 8,
  },
  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
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
