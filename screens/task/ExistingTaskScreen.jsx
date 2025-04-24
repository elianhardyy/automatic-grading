import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fonts } from "../../utils/font";
import { fetchAllTask } from "../../query/task"; // You'll need to create this query function
import Alert from "../../components/common/Alert";
import ExistingTaskForm from "../../components/tasks/ExistingTaskForm";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

// Skeleton component for loading states
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

const ExistingTaskScreen = ({ route, navigation }) => {
  const { batchId, batchName } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Fetch all tasks
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      fetchAllTask({
        page: 1,
        size: 100,
        sortBy: "name",
        direction: "asc",
      }),
    onError: (error) => {
      console.error("Error fetching tasks:", error);
    },
  });

  // Set local loading state with timeout for better UX
  useEffect(() => {
    const timer = setTimeout(() => setLocalLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Determine if we should show loading state
  const showLoading = isLoading || localLoading;

  const filteredTasks = React.useMemo(() => {
    if (!tasksData?.data) return [];

    return tasksData.data.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasksData?.data, searchQuery]);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const goBackToSearch = () => {
    setShowForm(false);
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleTaskSelect(item)}
      className="bg-white p-4 rounded-lg border border-neutral-200 mb-3"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text style={fonts.ecTextBody1} className="text-neutral-800 mb-1">
            {item.name}
          </Text>
          <Text style={fonts.ecTextBody3} className="text-neutral-500">
            {item.taskCategory?.name || "No category"}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#757575" />
      </View>

      {/* Assessment Criteria Count */}
      {item.taskCriterias && item.taskCriterias.length > 0 && (
        <View className="flex-row items-center mt-2">
          <MaterialIcons name="assignment" size={16} color="#233D90" />
          <Text style={fonts.ecTextBody3} className="text-primary-500 ml-1">
            {item.taskCriterias.length} assessment criteria
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Skeleton loader for task items
  const renderTaskSkeleton = () => (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <View
            key={i}
            className="bg-white p-4 rounded-lg border border-neutral-200 mb-3"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Skeleton height={20} width="80%" style={{ marginBottom: 8 }} />
                <Skeleton height={16} width="50%" />
              </View>
              <Skeleton width={24} height={24} radius={12} />
            </View>
            <View className="flex-row items-center mt-2">
              <Skeleton width={16} height={16} radius={8} />
              <Skeleton height={16} width="40%" style={{ marginLeft: 8 }} />
            </View>
          </View>
        ))}
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="light-content" backgroundColor="#233D90" />

      {/* Header */}
      <View className="bg-primary-500 p-4 flex-row items-center">
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="#FFFFFF"
          onPress={() => {
            if (showForm) {
              goBackToSearch();
            } else {
              navigation.goBack();
            }
          }}
        />
        <View className="flex-1 items-center">
          <Text style={fonts.ecTextSubtitle1M} className="text-white">
            {showForm ? "Use Existing Task" : "Select Existing Task"}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {showForm ? (
        <ExistingTaskForm
          taskData={selectedTask}
          batchId={batchId}
          batchName={batchName}
          navigation={navigation}
          onCancel={goBackToSearch}
        />
      ) : (
        <View className="p-4 flex-1">
          {/* Selected batch info */}
          <View className="bg-primary-50 p-3 rounded-lg mb-4 flex-row items-center">
            <MaterialIcons name="group" size={20} color="#233D90" />
            <Text style={fonts.ecTextBody2} className="text-primary-700 ml-2">
              Selected batch: {batchName}
            </Text>
          </View>

          {/* Search Input */}
          <View className="mb-4 flex-row items-center bg-white border border-neutral-300 rounded-lg px-3">
            <MaterialIcons name="search" size={20} color="#757575" />
            <TextInput
              style={fonts.ecTextBody2}
              className="flex-1 p-2"
              placeholder="Search tasks"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="close" size={20} color="#757575" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Task List */}
          {showLoading ? (
            <View className="flex-1">{renderTaskSkeleton()}</View>
          ) : isError ? (
            <Alert
              variant="alert"
              title="Error"
              message={
                error?.message || "Failed to load tasks. Please try again."
              }
              className="mb-4"
            />
          ) : filteredTasks.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <MaterialIcons name="assignment" size={48} color="#9A9A9A" />
              <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-2">
                {searchQuery
                  ? "No tasks match your search"
                  : "No tasks available"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ExistingTaskScreen;
