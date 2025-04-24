import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/auth";
import { useRoleCheck } from "../../hooks/useRoleCheck";
import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../../query/task";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Alert from "../../components/common/Alert";
import { fonts } from "../../utils/font";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { fetchAllBatchByMe } from "../../query/batch";
import { fetchAllTrainees } from "../../query/trainee";
import { API_URL } from "../../constant/uri";
import { profileTrainer } from "../../redux/slice/profile";

const Skeleton = ({ width = "100%", height = 20, radius = 6, style }) => (
  <MotiView
    style={[
      {
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E0E0E0",
      },
      style,
    ]}
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: "timing",
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    }}
  />
);

const HomeScreen = ({ navigation }) => {
  useRoleCheck("[ROLE_TRAINER]", "LoginScreen");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    profile,
    loading: profileLoading,
    error,
  } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    sortBy: "name",
    direction: "asc",
  });

  // Fetch batches data
  const { data: batchData, isLoading: isBatchLoading } = useQuery({
    queryKey: ["batches", filter],
    queryFn: () => fetchAllBatchByMe(filter),
    onError: (error) => {
      console.error("Error fetching batches:", error);
    },
  });

  // Fetch tasks data
  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", filter],
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    queryFn: () => fetchTask(filter),
    onError: (error) => {
      console.error("Error fetching tasks:", error);
    },
  });

  // Fetch trainees data
  const { data: traineesData, isLoading: isTraineesLoading } = useQuery({
    queryKey: ["trainees", filter],
    queryFn: () => fetchAllTrainees(filter),
    onError: (error) => {
      console.error("Error fetching trainees:", error);
    },
  });

  // Add some debug logging
  useEffect(() => {
    console.log("Batch data paging:", batchData?.paging);
    console.log("Tasks data paging:", tasksData?.paging);
    console.log("Trainees data paging:", traineesData?.paging);
  }, [batchData, tasksData, traineesData]);

  // Use useMemo for checking if a task is ongoing
  const isTaskOngoing = useMemo(
    () => (task) => {
      const batchTaskOnGo = task.batchTasks?.[0];
      if (!batchTaskOnGo) return false;

      const currentDate = new Date();
      const assignedDate = new Date(batchTaskOnGo?.assignedDate);
      const dueDate = new Date(batchTaskOnGo?.dueDate);

      return currentDate >= assignedDate && currentDate < dueDate;
    },
    []
  );

  // Memoize filtered tasks
  const filteredTasks = useMemo(
    () => tasksData?.data?.filter((task) => isTaskOngoing(task)) || [],
    [tasksData?.data, isTaskOngoing]
  );

  // Memoize processed tasks with batch info
  const processedTasks = useMemo(
    () =>
      tasksData?.data?.map((task) => {
        const batchTask = task.batchTasks?.[0];

        return {
          id: task.id,
          name: task.name,
          category: task.taskCategory?.name || "Uncategorized",
          deadline: batchTask?.dueDate || new Date().toISOString(),
          batch: batchTask?.batchName || "Unknown Batch",
          assessed: 0,
          total: task.batchTasks?.length || 0,
        };
      }) || [],
    [tasksData?.data]
  );

  // Memoize recent tasks (limit to 3)
  const recentTasks = useMemo(
    () => processedTasks.slice(0, 3),
    [processedTasks]
  );

  // Memoize days remaining calculation function for performance
  const getDaysRemaining = useMemo(
    () => (dueDate) => {
      const today = new Date();
      const deadlineDate = new Date(dueDate);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    []
  );

  // Memoize the calculation for tasks with deadlines less than 3 days
  const hasUrgentTasks = useMemo(
    () => processedTasks.some((task) => getDaysRemaining(task.deadline) <= 3),
    [processedTasks, getDaysRemaining]
  );

  // Use useMemo for stats calculation - key change to fix the issue
  const stats = useMemo(
    () => ({
      totalBatches: batchData?.paging?.totalElement || 0,
      activeTrainees: traineesData?.paging?.totalElement || 0,
      tasksGiven: tasksData?.paging?.totalElement || 0,
      pendingAssessments: filteredTasks.length || 0,
    }),
    [
      batchData?.paging?.totalElement,
      traineesData?.paging?.totalElement,
      tasksData?.paging?.totalElement,
      filteredTasks.length,
    ]
  );

  useEffect(() => {
    dispatch(profileTrainer());
  }, [dispatch, profile?.picture]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleSeeAllTasks = () => {
    navigation.navigate("TaskTab");
  };

  const handleViewTaskDetails = (taskId) => {
    navigation.navigate("DetailTaskScreen", { taskId });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="light-content" backgroundColor="#233D90" />

      <View className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row justify-between items-center px-4 pt-12 pb-4 bg-primary-500">
          <View className="flex-row items-center">
            {!profile?.profilePicture ? (
              <View className="w-12 h-12 rounded-full bg-primary-300 justify-center items-center mr-3">
                <Text
                  className="text-white text-lg font-bold"
                  style={fonts.ecTextBody1}
                >
                  {user?.username ? user.username.charAt(0).toUpperCase() : "T"}
                </Text>
              </View>
            ) : (
              <Image
                source={{
                  uri: `${API_URL}/profile/picture/${
                    profile?.profilePicture || profile?.picture
                  }`,
                }}
                className="w-12 h-12 rounded-full mr-3"
              />
            )}

            <View>
              <Text
                className="text-neutral-50 text-lg"
                style={fonts.ecTextBody2}
              >
                Welcome,
              </Text>
              <Text
                className="text-white text-xl font-bold"
                style={fonts.ecTextSubtitle1}
              >
                {user?.username || "Trainer"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 rounded-full bg-primary-600"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-4 py-3 bg-neutral-50">
          <Input
            placeholder="Search tasks, trainees or batches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            variant="rounded"
            prefixIcon="search"
            iconPosition="left"
            className="bg-white"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-neutral-50"
        contentContainerStyle={{ paddingTop: 140 }}
      >
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Dashboard
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    width="48%"
                    height={100}
                    radius={12}
                    style={{ marginBottom: 12 }}
                  />
                ))
            ) : (
              <>
                <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
                  <View className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center mb-2">
                    <MaterialCommunityIcons
                      name="view-dashboard-outline"
                      size={20}
                      color="#233D90"
                    />
                  </View>
                  <Text
                    className="text-neutral-500 text-sm"
                    style={fonts.ecTextBody3}
                  >
                    Total Batch
                  </Text>
                  <Text
                    className="text-neutral-800 text-xl font-bold"
                    style={fonts.ecTextSubtitle2}
                  >
                    {stats.totalBatches}
                  </Text>
                </View>

                <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
                  <View className="w-10 h-10 rounded-lg bg-secondary-50 items-center justify-center mb-2">
                    <MaterialIcons
                      name="people-outline"
                      size={16}
                      color="#FF6B18"
                    />
                  </View>
                  <Text
                    className="text-neutral-500 text-sm"
                    style={fonts.ecTextBody3}
                  >
                    Active Trainees
                  </Text>
                  <Text
                    className="text-neutral-800 text-xl font-bold"
                    style={fonts.ecTextSubtitle2}
                  >
                    {stats.activeTrainees}
                  </Text>
                </View>

                <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
                  <View className="w-10 h-10 rounded-lg bg-tertiary-50 items-center justify-center mb-2">
                    <MaterialIcons name="list-alt" size={20} color="#B5AE02" />
                  </View>
                  <Text
                    className="text-neutral-500 text-sm"
                    style={fonts.ecTextBody3}
                  >
                    Tasks Given
                  </Text>
                  <Text
                    className="text-neutral-800 text-xl font-bold"
                    style={fonts.ecTextSubtitle2}
                  >
                    {stats.tasksGiven}
                  </Text>
                </View>

                <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
                  <View className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center mb-2">
                    <MaterialIcons name="loop" size={20} color="#2196F3" />
                  </View>
                  <Text
                    className="text-neutral-500 text-sm"
                    style={fonts.ecTextBody3}
                  >
                    Tasks Ongoing
                  </Text>
                  <Text
                    className="text-neutral-800 text-xl font-bold"
                    style={fonts.ecTextSubtitle2}
                  >
                    {stats.pendingAssessments}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Active Batches
          </Text>
          {loading || isBatchLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={110}
                  radius={12}
                  style={{ marginBottom: 12 }}
                />
              ))
          ) : batchData?.data && batchData.data.length > 0 ? (
            batchData.data.map((batch) => (
              <Card
                key={batch.id}
                title={batch.name}
                variant="primary"
                collapsible={false}
                className="mb-3"
              >
                <View className="flex-row items-center my-1">
                  <MaterialIcons name="people" size={12} color="#757575" />
                  <Text
                    className="text-neutral-500 text-sm ml-2"
                    style={fonts.ecTextBody3}
                  >
                    {batch.participantCount || 0} Trainees
                  </Text>
                </View>

                <View className="mt-2">
                  <View className="flex-row justify-between mb-1">
                    <Text
                      className="text-neutral-500 text-xs"
                      style={fonts.ecTextBody3M}
                    >
                      Assessment Progress
                    </Text>
                    <Text
                      className="text-neutral-500 text-xs"
                      style={fonts.ecTextBody3M}
                    >
                      {batch.progressPercentage || 0}%
                    </Text>
                  </View>
                  <View className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <View
                      className={`h-full bg-success-500 rounded-full`}
                      style={{ width: `${batch.progressPercentage || 0}%` }}
                    />
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Text className="text-neutral-500 text-center p-4">
              No active batches available
            </Text>
          )}
        </View>

        <View className="px-4 py-2">
          <View className="flex-row justify-between items-center mb-3">
            <Text
              className="text-neutral-800 text-lg font-bold"
              style={fonts.ecTextSubtitle1}
            >
              Recent Tasks
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

          {loading || isTasksLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={100}
                  radius={12}
                  style={{ marginBottom: 12 }}
                />
              ))
          ) : recentTasks.length > 0 ? (
            recentTasks.map((task) => {
              const daysLeft = getDaysRemaining(task.deadline);
              const isUrgent = daysLeft <= 3;

              return (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => handleViewTaskDetails(task.id)}
                  activeOpacity={0.7}
                >
                  <Card
                    variant={isUrgent ? "alert" : "info"}
                    collapsible={false}
                    className="mb-3"
                    title={task.name}
                    footer={
                      <View className="flex-row justify-between items-center">
                        <Text
                          className="text-neutral-500 text-sm"
                          style={fonts.ecTextBody3}
                        >
                          <Text>{task.assessed} assessed</Text>
                        </Text>
                        <View className="h-1 w-16 bg-neutral-200 rounded-full overflow-hidden">
                          <View
                            className={`h-full bg-info-500 rounded-full`}
                            style={{
                              width: `${(task.assessed / task.total) * 100}%`,
                            }}
                          />
                        </View>
                      </View>
                    }
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="bg-primary-50 rounded-full px-3 py-1 self-start">
                        <Text
                          className="text-primary-500 text-xs"
                          style={fonts.ecTextBody3M}
                        >
                          {task.category}
                        </Text>
                      </View>
                      {isUrgent && (
                        <View className="bg-alert-50 rounded-full px-3 py-1">
                          <Text
                            className="text-alert-500 text-xs"
                            style={fonts.ecTextBody3M}
                          >
                            {daysLeft} days left
                          </Text>
                        </View>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text className="text-neutral-500 text-center p-4">
              No tasks available
            </Text>
          )}

          {/* Show a "View More" button if there are more than 3 tasks */}
          {processedTasks.length > 3 && !loading && !isTasksLoading && (
            <TouchableOpacity
              onPress={handleSeeAllTasks}
              className="items-center my-2"
            >
              <Text className="text-primary-500" style={fonts.ecTextBody2}>
                View more tasks
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    width="48%"
                    height={96}
                    radius={12}
                    style={{ marginBottom: 12 }}
                  />
                ))
            ) : (
              <>
                <Button
                  title="Create Task"
                  variant="primary"
                  className="w-[48%] mb-3 h-24 flex-col"
                  icon={
                    <MaterialCommunityIcons
                      name="plus"
                      size={24}
                      color="white"
                    />
                  }
                  onPress={() => navigation.navigate("CreateTaskScreen")}
                  iconPosition="top"
                />

                <Button
                  title="All Assessments"
                  variant="info"
                  className="w-[48%] mb-3 h-24 flex-col"
                  icon={
                    <MaterialCommunityIcons
                      name="chart-bar"
                      size={24}
                      color="white"
                    />
                  }
                  iconPosition="top"
                />

                <Button
                  title="View Trainees"
                  variant="secondary"
                  className="w-[48%] mb-3 h-24 flex-col"
                  icon={<FontAwesome5 name="users" size={20} color="white" />}
                  iconPosition="top"
                />

                <Button
                  title="View Tasks"
                  variant="success"
                  className="w-[48%] mb-3 h-24 flex-col"
                  icon={
                    <MaterialCommunityIcons
                      name="format-list-checks"
                      size={24}
                      color="white"
                    />
                  }
                  iconPosition="top"
                  onPress={() => navigation.navigate("TaskTab")}
                />
              </>
            )}
          </View>
        </View>

        {!loading && stats.pendingAssessments > 0 && (
          <View className="px-4 mb-8">
            <Alert
              title="Reminders"
              message={`You have ${stats.pendingAssessments} pending assessments to complete.`}
              variant="warning"
            />
          </View>
        )}

        {!loading && hasUrgentTasks && (
          <View className="px-4 mb-20">
            <Alert
              title="Upcoming Deadline"
              message="You have tasks with deadlines approaching in 3 days or less."
              variant="alert"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
