// --- START OF FILE HomeScreen.jsx ---

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  RefreshControl, // Added for pull-to-refresh
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/slice/authService";
import { profileService } from "../../services/slice/profileService"; // Import profile action
import { useRoleCheck } from "../../hooks/useRoleCheck";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { taskService } from "../../services/query/taskService";
import { batchService } from "../../services/query/batchService";
import { traineeService } from "../../services/query/traineeService";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input"; // Using InputGroup for icon capability
import Alert from "../../components/common/Alert";
import { fonts } from "../../utils/font";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { API_URL } from "../../constant/uri"; // Ensure API_URL is correctly defined
import { SafeAreaView } from "react-native-safe-area-context";

// Skeleton component (assuming it's defined correctly)
const Skeleton = ({ width = "100%", height = 20, radius = 6, style }) => (
  <MotiView
    style={[
      {
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E1E1E1", // neutral-200
      },
      style,
    ]}
    from={{ opacity: 0.5 }} // Start slightly more visible
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: "timing",
      duration: 1000, // Slightly slower pulse
      easing: Easing.inOut(Easing.ease),
    }}
  />
);

const HomeScreen = ({ navigation }) => {
  useRoleCheck("[ROLE_TRAINER]", "LoginScreen");
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // Get query client instance
  const { user } = useSelector((state) => state.auth);
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    pictureTrainer,
  } = useSelector((state) => state.profile); // Use profile state
  const [searchQuery, setSearchQuery] = useState("");

  // Initial loading state for smoother skeleton display
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // --- Data Fetching ---
  const filter = useMemo(
    () => ({
      // Memoize filter object
      page: 1,
      size: 10, // Fetch enough for initial display + "See All" logic
      sortBy: "name", // Default sort
      direction: "asc",
      search: searchQuery, // Include search query in filter
    }),
    [searchQuery]
  );

  // Fetch batches
  const {
    data: batchData,
    isLoading: isBatchLoading,
    isRefetching: isBatchRefetching,
    refetch: refetchBatches,
    isError: isBatchError,
  } = useQuery({
    queryKey: ["batches", filter], // Include filter in queryKey
    queryFn: () => batchService.fetchAllBatchByMe(filter),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 mins
  });

  // Fetch tasks
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isRefetching: isTasksRefetching,
    refetch: refetchTasks,
    isError: isTasksError,
  } = useQuery({
    queryKey: ["tasks", filter], // Include filter in queryKey
    queryFn: () => taskService.fetchTask(filter),
    staleTime: 1 * 60 * 1000, // Tasks might change more often
  });

  // Fetch trainees count (adjust API if needed for just count)
  const {
    data: traineesData,
    isLoading: isTraineesLoading,
    isRefetching: isTraineesRefetching,
    refetch: refetchTrainees,
    isError: isTraineesError,
  } = useQuery({
    queryKey: ["trainees", { page: 1, size: 1, search: filter.search }], // Only need count, adjust filter
    queryFn: () =>
      traineeService.fetchAllTrainees({
        page: 1,
        size: 1,
        search: filter.search,
      }), // Fetch minimal data
    staleTime: 10 * 60 * 1000, // Trainee count might not change often
  });

  // --- Profile Fetching ---
  useEffect(() => {
    dispatch(profileService.profileTrainer());
  }, [dispatch]);

  // --- Derived Data & Memoization ---
  const isTaskOngoing = useMemo(
    () => (task) => {
      // Check if batchTasks exists and has at least one element
      const batchTaskOnGo = task?.batchTasks?.[0];
      if (!batchTaskOnGo?.assignedDate || !batchTaskOnGo?.dueDate) return false;

      try {
        const currentDate = new Date();
        const assignedDate = new Date(batchTaskOnGo.assignedDate);
        const dueDate = new Date(batchTaskOnGo.dueDate);

        // Basic validation
        if (isNaN(assignedDate.getTime()) || isNaN(dueDate.getTime())) {
          return false;
        }

        return currentDate < dueDate;
      } catch (e) {
        console.error("Error parsing task dates:", e);
        return false; // Treat errors as not ongoing
      }
    },
    []
  );

  const getDaysRemaining = useMemo(
    () => (dueDate) => {
      if (!dueDate) return null; // Handle missing due date
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates only
        const deadlineDate = new Date(dueDate);
        deadlineDate.setHours(0, 0, 0, 0); // Compare dates only

        if (isNaN(deadlineDate.getTime())) return null; // Handle invalid date

        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      } catch (e) {
        console.error("Error calculating days remaining:", e);
        return null; // Handle errors
      }
    },
    []
  );

  const processedTasks = useMemo(() => {
    return (
      (tasksData?.data || [])
        .map((task) => {
          const batchTask = task.batchTasks?.[0];
          const daysLeft = getDaysRemaining(batchTask?.dueDate);
          const isOngoing = isTaskOngoing(task);

          // Basic progress calculation (replace with actual data if available)
          const assessedCount = batchTask?.gradedCount || 0; // Placeholder - needs real data
          const totalParticipants = batchTask?.ungradedCount || 1; // Placeholder

          return {
            id: task.id,
            name: task.name || "Untitled Task",
            category: task.taskCategory?.name || "Uncategorized",
            deadline: batchTask?.dueDate,
            batch: batchTask?.batchName || "Unknown Batch",
            isOngoing: isOngoing,
            isUrgent: daysLeft !== null && daysLeft <= 3 && daysLeft >= 0, // Urgent if 0-3 days left
            daysLeft: daysLeft,
            assessed: assessedCount,
            total: totalParticipants > 0 ? totalParticipants : 1, // Avoid division by zero
            progress:
              totalParticipants > 0
                ? (assessedCount / totalParticipants) * 100
                : 0,
          };
        })
        // Optional: Sort tasks, e.g., by urgency or deadline
        .sort((a, b) => {
          // Sort urgent tasks first, then by days remaining
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          if (a.daysLeft !== null && b.daysLeft !== null)
            return a.daysLeft - b.daysLeft;
          if (a.daysLeft !== null) return -1; // Tasks with deadlines first
          if (b.daysLeft !== null) return 1;
          return 0; // Keep original order if no difference
        })
    );
  }, [tasksData?.data, getDaysRemaining, isTaskOngoing]);

  const ongoingTasks = useMemo(
    () => processedTasks.filter((task) => task.isOngoing),
    [processedTasks]
  );
  const recentTasks = useMemo(
    () => processedTasks.slice(0, 3),
    [processedTasks]
  ); // Show top 3 based on sorted list
  const hasUrgentTasks = useMemo(
    () => processedTasks.some((task) => task.isUrgent),
    [processedTasks]
  );

  const stats = useMemo(
    () => ({
      totalBatches: batchData?.paging?.totalElement ?? 0,
      activeTrainees: traineesData?.paging?.totalElement ?? 0, // Use trainee query result
      tasksGiven: tasksData?.paging?.totalElement ?? 0,
      tasksOngoing: ongoingTasks.length, // Use filtered ongoing tasks count
    }),
    [
      batchData?.paging?.totalElement,
      traineesData?.paging?.totalElement,
      tasksData?.paging?.totalElement,
      ongoingTasks.length,
    ]
  );

  // --- Loading State Management ---
  useEffect(() => {
    // Determine if initial data load is complete
    const dataLoaded =
      !isBatchLoading &&
      !isTasksLoading &&
      !isTraineesLoading &&
      !profileLoading;
    if (dataLoaded) {
      const timer = setTimeout(() => setIsInitialLoading(false), 300); // Short delay after data loads
      return () => clearTimeout(timer);
    }
    // Keep showing skeleton if profile is still loading even if others are done
    if (profileLoading) {
      setIsInitialLoading(true);
    }
  }, [isBatchLoading, isTasksLoading, isTraineesLoading, profileLoading]);

  // --- Pull-to-Refresh ---
  const onRefresh = React.useCallback(() => {
    // Refetch all queries simultaneously
    Promise.all([
      refetchBatches(),
      refetchTasks(),
      refetchTrainees(),
      dispatch(profileService.profileTrainer()), // Refetch profile too
    ]);
  }, [refetchBatches, refetchTasks, refetchTrainees, dispatch]);

  const isRefreshing =
    isBatchRefetching ||
    isTasksRefetching ||
    isTraineesRefetching ||
    profileLoading;

  // --- Handlers ---
  const handleLogout = () => {
    dispatch(authService.logoutUser());
    // Optionally clear query cache on logout
    // queryClient.clear();
  };

  const handleSeeAllTasks = () => {
    navigation.navigate("TaskTab"); // Navigate to the Task Tab/Screen
  };

  const handleViewTaskDetails = (taskId) => {
    navigation.navigate("DetailTaskScreen", { taskId });
  };

  const handleCreateTask = () => {
    navigation.navigate("CreateTaskScreen"); // Ensure this screen name is correct
  };

  const handleViewTrainees = () => {
    navigation.navigate("TraineeTab"); // Navigate to Trainee Tab/Screen
  };

  const handleAllAssessments = () => {
    console.log("Navigate to All Assessments screen"); // Add navigation later
    // navigation.navigate('AssessmentSummaryScreen');
    navigation.navigate("EditProfile");
  };

  // --- Render ---
  const renderProfileImage = () => {
    const pictureUrl = profile?.profilePicture || pictureTrainer;
    if (profileLoading) {
      return (
        <Skeleton
          width={48}
          height={48}
          radius={24}
          style={{ marginRight: 12 }}
        />
      );
    }
    if (pictureUrl) {
      return (
        <Image
          source={{ uri: `${API_URL}/profile/picture/${pictureUrl}` }}
          className="w-12 h-12 rounded-full mr-3 border-2 border-primary-300" // Add border
          resizeMode="cover"
        />
      );
    }
    // Fallback Initials
    const initials = user?.username
      ? user.username.charAt(0).toUpperCase()
      : "?";
    return (
      <View className="w-12 h-12 rounded-full bg-primary-300 justify-center items-center mr-3">
        <Text
          className="text-white text-xl font-bold"
          style={fonts.ecTextSubtitle1}
        >
          {initials}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Use a slightly off-white background */}
      <StatusBar barStyle="light-content" backgroundColor="#192B66" />
      {/* Darker primary for status bar */}

      {/* Sticky Header */}
      <View className="absolute top-0 left-0 right-0 z-10 shadow-md">
        {/* Header Bar */}
        <View className="flex-row justify-between items-center px-4 pt-12 pb-4 bg-primary-500">
          <View className="flex-row items-center">
            {renderProfileImage()}
            <View>
              <Text
                className="text-primary-100 text-base"
                style={fonts.ecTextBody2}
              >
                Welcome back,
              </Text>
              {profileLoading ? (
                <Skeleton
                  width={120}
                  height={20}
                  radius={4}
                  style={{ marginTop: 4 }}
                />
              ) : (
                <Text
                  className="text-white text-xl font-bold"
                  style={fonts.ecTextSubtitle1}
                  numberOfLines={1}
                >
                  {profile?.name || user?.username || "Trainer"}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 rounded-full bg-primary-600 active:bg-primary-700" // Added active state
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar Area */}
        {/* <View className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
          <Input
            placeholder="Search tasks, trainees..." // Simplified placeholder
            value={searchQuery}
            onChangeText={setSearchQuery}
            variant="rounded" // Use rounded variant
            // Use InputGroup props if needed for icon
            // prefixIcon="search"
            // iconPosition="left"
            className="bg-white" // Ensure background contrast if needed
            inputMode="search"
            returnKeyType="search"
          /> */}
        {/* Optional: Add filter/sort buttons here later */}
        {/* </View> */}
      </View>

      <ScrollView
        className="flex-1 bg-neutral-100" // Match SafeAreaView background
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }} // Adjust padding top for header+search, add bottom padding
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on scroll tap
        refreshControl={
          // Add pull-to-refresh
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#233D90"
          />
        }
      >
        {/* --- Stats Section --- */}
        <View className="px-4 pt-4 pb-2">
          {/* No Title needed if section is clear */}
          <View className="flex-row flex-wrap justify-between -mx-1.5">
            {isInitialLoading ? (
              // Skeleton for Stats
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <View key={i} className="w-1/2 px-1.5 mb-3">
                    <Skeleton height={100} radius={12} />
                  </View>
                ))
            ) : (
              // Actual Stats Cards
              <>
                {/* Total Batches */}
                <View className="w-1/2 px-1.5 mb-3">
                  <View className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 h-[100px]">
                    <View className="w-8 h-8 rounded-lg bg-primary-50 items-center justify-center mb-2">
                      <MaterialCommunityIcons
                        name="view-dashboard-outline"
                        size={18}
                        color="#192B66"
                      />
                    </View>
                    <Text
                      className="text-neutral-500 text-xs mb-0.5"
                      style={fonts.ecTextBody3M}
                    >
                      Total Batches
                    </Text>
                    <Text
                      className="text-neutral-800 text-lg font-bold"
                      style={fonts.ecTextSubtitle2M}
                    >
                      {stats.totalBatches}
                    </Text>
                  </View>
                </View>
                {/* Active Trainees */}
                <View className="w-1/2 px-1.5 mb-3">
                  <View className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 h-[100px]">
                    <View className="w-8 h-8 rounded-lg bg-secondary-50 items-center justify-center mb-2">
                      <MaterialIcons
                        name="people-outline"
                        size={18}
                        color="#B54C11"
                      />
                    </View>
                    <Text
                      className="text-neutral-500 text-xs mb-0.5"
                      style={fonts.ecTextBody3M}
                    >
                      Active Trainees
                    </Text>
                    <Text
                      className="text-neutral-800 text-lg font-bold"
                      style={fonts.ecTextSubtitle2M}
                    >
                      {stats.activeTrainees}
                    </Text>
                  </View>
                </View>
                {/* Tasks Given */}
                <View className="w-1/2 px-1.5 mb-3">
                  <View className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 h-[100px]">
                    <View className="w-8 h-8 rounded-lg bg-success-50 items-center justify-center mb-2">
                      <MaterialIcons
                        name="checklist-rtl"
                        size={18}
                        color="#30684D"
                      />
                    </View>
                    <Text
                      className="text-neutral-500 text-xs mb-0.5"
                      style={fonts.ecTextBody3M}
                    >
                      Tasks Given
                    </Text>
                    <Text
                      className="text-neutral-800 text-lg font-bold"
                      style={fonts.ecTextSubtitle2M}
                    >
                      {stats.tasksGiven}
                    </Text>
                  </View>
                </View>
                {/* Tasks Ongoing */}
                <View className="w-1/2 px-1.5 mb-3">
                  <View className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 h-[100px]">
                    <View className="w-8 h-8 rounded-lg bg-info-50 items-center justify-center mb-2">
                      <MaterialIcons
                        name="hourglass-top"
                        size={18}
                        color="#336196"
                      />
                    </View>
                    <Text
                      className="text-neutral-500 text-xs mb-0.5"
                      style={fonts.ecTextBody3M}
                    >
                      Tasks Ongoing
                    </Text>
                    <Text
                      className="text-neutral-800 text-lg font-bold"
                      style={fonts.ecTextSubtitle2M}
                    >
                      {stats.tasksOngoing}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* --- Active Batches Section --- */}
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Active Batches
          </Text>
          {isInitialLoading ? (
            // Skeleton for Batches
            Array(2)
              .fill(0)
              .map((_, i) => (
                <View key={i} className="mb-3">
                  <Skeleton height={120} radius={12} />
                </View>
              ))
          ) : isBatchError ? (
            <Alert
              variant="alert"
              title="Error"
              message="Could not load batches."
              className="mb-3"
            />
          ) : batchData?.data && batchData.data.length > 0 ? (
            batchData.data.slice(0, 3).map((batch, index) => (
              <Card
                key={batch.id}
                title={batch.name}
                variant="primary" // Use a consistent variant or base it on data
                collapsible={false} // Keep batch info visible
                className="mb-3 bg-white border border-neutral-200 shadow-sm" // Style card
                // Optional: Add action/footer for navigation to batch details
              >
                <View className="flex-row items-center mb-2.5">
                  <MaterialIcons name="group" size={14} color="#757575" />
                  <Text
                    className="text-neutral-600 text-sm ml-1.5"
                    style={fonts.ecTextBody3}
                  >
                    {index === 0 ? "2" : "0"} Trainees
                  </Text>
                </View>
                {/* Progress Bar (if applicable/available) */}
                {batch.progressPercentage !== undefined && (
                  <View>
                    <View className="flex-row justify-between mb-1">
                      <Text
                        className="text-neutral-500 text-xs"
                        style={fonts.ecTextBody3M}
                      >
                        Completion
                      </Text>
                      <Text
                        className="text-neutral-500 text-xs font-medium"
                        style={fonts.ecTextBody3M}
                      >
                        {Math.round(batch.progressPercentage)}%
                      </Text>
                    </View>
                    <View className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <View
                        className={`h-full bg-success-500 rounded-full`}
                        style={{ width: `${batch.progressPercentage || 0}%` }}
                      />
                    </View>
                  </View>
                )}
              </Card>
            ))
          ) : (
            <View className="items-center py-5">
              <MaterialIcons name="upcoming" size={32} color="#9A9A9A" />
              <Text
                className="text-neutral-500 text-center mt-2"
                style={fonts.ecTextBody2}
              >
                No active batches found.
              </Text>
            </View>
          )}
          {/* Optional "View All Batches" Button */}
          {!isInitialLoading &&
            batchData?.data &&
            batchData.data.length > 3 && (
              <TouchableOpacity
                onPress={() => navigation.navigate("BatchTab")}
                className="items-center mt-1 mb-2"
              >
                <Text className="text-primary-500" style={fonts.ecTextBody2}>
                  View All Batches
                </Text>
              </TouchableOpacity>
            )}
        </View>

        {/* --- Recent Tasks Section --- */}
        <View className="px-4 py-2">
          <View className="flex-row justify-between items-center mb-3">
            <Text
              className="text-neutral-800 text-lg font-bold"
              style={fonts.ecTextSubtitle1}
            >
              Upcoming Tasks
            </Text>
            <TouchableOpacity onPress={handleSeeAllTasks}>
              <Text
                className="text-primary-500 text-sm font-medium"
                style={fonts.ecTextBody2}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {isInitialLoading ? (
            // Skeleton for Tasks
            Array(3)
              .fill(0)
              .map((_, i) => (
                <View key={i} className="mb-3">
                  <Skeleton height={110} radius={12} />
                </View>
              ))
          ) : isTasksError ? (
            <Alert
              variant="alert"
              title="Error"
              message="Could not load tasks."
              className="mb-3"
            />
          ) : recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleViewTaskDetails(task.id)}
                activeOpacity={0.8} // Slightly more feedback on touch
              >
                <Card
                  variant={task.isUrgent ? "warning" : "base"} // Use warning for urgent, base otherwise
                  collapsible={false}
                  className="mb-3 bg-white border border-neutral-200 shadow-sm" // Consistent card style
                  title={task.name}
                  titleStyle={fonts.ecTextSubtitle2M} // Style title
                  // Add footer for progress or deadline
                  footer={
                    <View className="flex-row justify-between items-center pt-2 border-t border-neutral-100">
                      <Text
                        className="text-xs text-neutral-500"
                        style={fonts.ecTextBody3M}
                      >
                        Progress: {Math.round(task.progress)}%
                      </Text>
                      <Text
                        className={`text-xs font-medium ${
                          task.isUrgent
                            ? "text-warning-600"
                            : "text-neutral-500"
                        }`}
                        style={fonts.ecTextBody3M}
                      >
                        {task.daysLeft !== null
                          ? task.daysLeft < 0
                            ? `Overdue`
                            : `${task.daysLeft}d left`
                          : "No Due Date"}
                      </Text>
                    </View>
                  }
                >
                  {/* Badges inside the card body */}
                  <View className="flex-row flex-wrap gap-1.5 mb-2">
                    <View className="bg-primary-50 rounded-full px-2.5 py-0.5 self-start border border-primary-100">
                      <Text
                        className="text-primary-700 text-xs"
                        style={fonts.ecTextBody3M}
                      >
                        {task.category}
                      </Text>
                    </View>
                    <View className="bg-secondary-50 rounded-full px-2.5 py-0.5 self-start border border-secondary-100">
                      <Text
                        className="text-secondary-700 text-xs"
                        style={fonts.ecTextBody3M}
                      >
                        Batch: {task.batch}
                      </Text>
                    </View>
                    {/* Only show urgent badge if truly urgent */}
                    {task.isUrgent && (
                      <View className="bg-warning-50 rounded-full px-2.5 py-0.5 self-start border border-warning-200">
                        <Text
                          className="text-warning-700 text-xs font-semibold"
                          style={fonts.ecTextBody3M}
                        >
                          <MaterialIcons
                            name="warning-amber"
                            size={10}
                            color="#E8A700"
                          />
                          Deadline Near
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* Mini Progress Bar */}
                  <View className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden mt-1">
                    <View
                      className={`h-full ${
                        task.isUrgent ? "bg-warning-500" : "bg-info-500"
                      } rounded-full`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center py-5">
              <MaterialIcons name="assignment" size={32} color="#9A9A9A" />
              <Text
                className="text-neutral-500 text-center mt-2"
                style={fonts.ecTextBody2}
              >
                No upcoming tasks found.
              </Text>
            </View>
          )}
          {/* Optionally show a "View More" button */}
          {!isInitialLoading && processedTasks.length > 3 && (
            <TouchableOpacity
              onPress={handleSeeAllTasks}
              className="items-center mt-1 mb-2"
            >
              <Text className="text-primary-500" style={fonts.ecTextBody2}>
                View More Tasks
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- Quick Actions Section --- */}
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between -mx-1.5">
            {isInitialLoading ? (
              // Skeleton for Quick Actions
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <View key={i} className="w-1/2 px-1.5 mb-3">
                    <Skeleton height={100} radius={12} />
                  </View>
                ))
            ) : (
              <>
                {/* Create Task Button */}
                <View className="w-1/2 px-1.5 mb-3">
                  <TouchableOpacity
                    onPress={handleCreateTask}
                    activeOpacity={0.7}
                    className="bg-primary-500 rounded-xl p-4 h-[100px] items-center justify-center shadow active:bg-primary-600"
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={28}
                      color="white"
                    />
                    <Text
                      className="text-white text-center mt-1.5 text-sm"
                      style={fonts.ecTextBody3}
                    >
                      Create Task
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* All Assessments Button */}
                <View className="w-1/2 px-1.5 mb-3">
                  <TouchableOpacity
                    onPress={handleAllAssessments}
                    activeOpacity={0.7}
                    className="bg-info-500 rounded-xl p-4 h-[100px] items-center justify-center shadow active:bg-info-600"
                  >
                    <MaterialIcons name="person-2" size={28} color="white" />
                    <Text
                      className="text-white text-center mt-1.5 text-sm"
                      style={fonts.ecTextBody3}
                    >
                      Edit Profile
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* View Trainees Button */}
                {/* <View className="w-1/2 px-1.5 mb-3">
                  <TouchableOpacity
                    onPress={handleViewTrainees}
                    activeOpacity={0.7}
                    className="bg-secondary-500 rounded-xl p-4 h-[100px] items-center justify-center shadow active:bg-secondary-600"
                  >
                    <FontAwesome5 name="users" size={24} color="white" />
                    <Text
                      className="text-white text-center mt-1.5 text-sm"
                      style={fonts.ecTextBody3}
                    >
                      View Trainees
                    </Text>
                  </TouchableOpacity>
                </View> */}
                {/* View Tasks Button */}
                {/* <View className="w-1/2 px-1.5 mb-3">
                  <TouchableOpacity
                    onPress={handleSeeAllTasks}
                    activeOpacity={0.7}
                    className="bg-success-500 rounded-xl p-4 h-[100px] items-center justify-center shadow active:bg-success-600"
                  >
                    <MaterialCommunityIcons
                      name="format-list-checks"
                      size={28}
                      color="white"
                    />
                    <Text
                      className="text-white text-center mt-1.5 text-sm"
                      style={fonts.ecTextBody3}
                    >
                      View Tasks
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </>
            )}
          </View>
        </View>

        {/* --- Reminders/Alerts Section --- */}
        <View className="px-4 pt-2 pb-6">
          {/* Display Alerts only after initial load */}
          {!isInitialLoading && stats.tasksOngoing > 0 && !isTasksError && (
            <Alert
              title="Ongoing Tasks"
              message={`You have ${stats.tasksOngoing} task${
                stats.tasksOngoing > 1 ? "s" : ""
              } currently ongoing.`}
              variant="info" // Changed to info as it's less critical than pending assessment
              className="mb-3"
            />
          )}

          {/* {!isInitialLoading && hasUrgentTasks && !isTasksError && (
            <Alert
              title="Deadline Approaching"
              message="Some tasks have deadlines within the next 3 days."
              variant="warning" // Use warning instead of alert for less severe reminder
              className="mb-3"
            />
          )} */}

          {/* Generic Error Alert */}
          {!isInitialLoading &&
            (isBatchError ||
              isTasksError ||
              isTraineesError ||
              profileError) && (
              <Alert
                title="Data Loading Issue"
                message="Some information might not be up-to-date. Pull down to refresh."
                variant="alert"
                className="mb-3"
              />
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
// --- END OF FILE HomeScreen.jsx ---
