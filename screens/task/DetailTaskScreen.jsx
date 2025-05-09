import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  RefreshControl,
  StyleSheet, // Keep StyleSheet import if used elsewhere, otherwise remove if not needed
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/query/taskService";
import { fonts } from "../../utils/font";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import EditTaskForm from "../../components/tasks/EditTaskForm";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView

// Skeleton Component (no changes needed here)
const Skeleton = ({ width = "100%", height = 20, radius = 6, style }) => (
  <MotiView
    style={[
      {
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E1E1E1",
      },
      style,
    ]}
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: "timing",
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    }}
  />
);

const DetailTaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCriteriaDeleteConfirm, setShowCriteriaDeleteConfirm] =
    useState(false);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: taskData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });

  const task = taskData?.data;

  const deleteTaskMutation = useMutation({
    mutationFn: () => taskService.deleteTaskWithCriteria(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.removeQueries({ queryKey: ["task", taskId] });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Delete task error:", error);
    },
  });

  const deleteCriteriaMutation = useMutation({
    mutationFn: (criteriaId) => taskService.deleteTaskCriteria(criteriaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      setSelectedCriteriaId(null);
      setShowCriteriaDeleteConfirm(false);
    },
    onError: (error) => {
      console.error("Delete criteria error:", error);
      // Optionally keep the modal open and show error, or just invalidate and close
      // queryClient.invalidateQueries({ queryKey: ["task", taskId] }); // Re-fetch might hide the error briefly
      // setShowCriteriaDeleteConfirm(false); // Decide if you want to close on error
    },
  });

  const handleDeleteTask = () => {
    setShowDeleteConfirm(false);
    deleteTaskMutation.mutate();
  };

  const handleDeleteCriteria = () => {
    if (selectedCriteriaId) {
      deleteCriteriaMutation.mutate(selectedCriteriaId);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      const dateOptions = { year: "numeric", month: "short", day: "numeric" };
      const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
      const formattedDate = date.toLocaleDateString("en-US", dateOptions);
      const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
      return `${formattedDate} ${formattedTime}` || "Error Formatting";
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Error";
    }
  };

  // --- Modals (no changes needed here) ---
  const DeleteConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showDeleteConfirm}
      onRequestClose={() => setShowDeleteConfirm(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-white w-full rounded-xl p-6 shadow-xl">
          <Text
            style={fonts.ecTextTitleM}
            className="text-neutral-800 text-center mb-3"
          >
            Confirm Deletion
          </Text>
          <Text
            style={fonts.ecTextBody2}
            className="text-neutral-600 mb-6 text-center"
          >
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Text>
          <View className="flex-row justify-center space-x-3">
            <Button
              title="Cancel"
              color="neutral"
              type="outlined"
              onPress={() => setShowDeleteConfirm(false)}
              className="flex-1"
            />
            <Button
              title="Delete"
              variant="alert"
              loading={deleteTaskMutation.isPending}
              onPress={handleDeleteTask}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const DeleteCriteriaConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showCriteriaDeleteConfirm}
      onRequestClose={() => {
        setShowCriteriaDeleteConfirm(false);
        setSelectedCriteriaId(null);
      }}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-white w-full rounded-xl p-6 shadow-xl">
          <Text
            style={fonts.ecTextTitleM}
            className="text-neutral-800 text-center mb-3"
          >
            Delete Criteria
          </Text>
          <Text
            style={fonts.ecTextBody2}
            className="text-neutral-600 mb-6 text-center"
          >
            Are you sure you want to delete this assessment criteria? This
            action cannot be undone.
          </Text>
          <View className="flex-row justify-center space-x-3">
            <Button
              title="Cancel"
              color="neutral"
              type="outlined"
              onPress={() => {
                setShowCriteriaDeleteConfirm(false);
                setSelectedCriteriaId(null);
              }}
              className="flex-1"
            />
            <Button
              title="Delete"
              variant="alert"
              loading={deleteCriteriaMutation.isPending}
              onPress={handleDeleteCriteria}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // --- Loading State ---
  if (isLoading) {
    return (
      // Wrap Loading State in SafeAreaView
      <SafeAreaView className="flex-1 bg-neutral-50">
        <ScrollView
          className="flex-1" // Removed bg-neutral-50 here, applied to SafeAreaView
          contentContainerStyle={{ padding: 16 }}
        >
          <View className="flex-row items-center mb-5">
            <Skeleton
              width={24}
              height={24}
              radius={12}
              style={{ marginRight: 8 }}
            />
            <Skeleton width={120} height={16} radius={4} />
          </View>

          <View className="flex-row justify-between items-start mb-6">
            <Skeleton
              width="70%"
              height={28}
              radius={6}
              style={{ marginBottom: 8 }}
            />
            <Skeleton width={90} height={40} radius={8} />
          </View>

          <Skeleton height={48} radius={10} style={{ marginBottom: 12 }} />
          <Skeleton height={48} radius={10} style={{ marginBottom: 16 }} />

          {/* Card Skeleton (Schedule) */}
          <View className="mb-5">
            <Skeleton height={30} radius={6} style={{ marginBottom: 10 }} />
            <Skeleton height={100} radius={10} />
          </View>

          <View className="mb-6">
            <Skeleton height={30} radius={6} style={{ marginBottom: 10 }} />
            {[1, 2].map((_, index) => (
              <Skeleton
                key={index}
                height={85}
                radius={10}
                style={{ marginBottom: 10 }}
              />
            ))}
          </View>

          <View className="flex-row justify-between mt-6 mb-4 space-x-4">
            <Skeleton width="48%" height={48} radius={8} />
            <Skeleton width="48%" height={48} radius={8} />
          </View>

          {/* Assess button skeleton */}
          <Skeleton height={48} radius={8} style={{ marginBottom: 20 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      // Wrap Error State in SafeAreaView
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-6 justify-center items-center">
          {/* Content remains the same */}
          <MaterialIcons name="error-outline" size={60} color="#CB3A31" />
          <Text
            style={fonts.ecTextTitleM}
            className="text-neutral-800 mt-4 mb-2 text-center"
          >
            Error Loading Task
          </Text>
          <Text
            style={fonts.ecTextBody2}
            className="text-neutral-600 mb-6 text-center"
          >
            {typeof error?.message === "string"
              ? error.message
              : "Failed to load task details. Please check your connection and try again."}
          </Text>
          <Button
            title="Try Again"
            variant="primary"
            onPress={() => refetch()}
            className="w-full mb-3"
            icon={<MaterialIcons name="refresh" size={18} color="#FFFFFF" />}
            iconPosition="left"
            loading={isRefetching}
          />
          <Button
            title="Go Back"
            color="neutral"
            type="outlined"
            onPress={() => navigation.goBack()}
            className="w-full"
            icon={<MaterialIcons name="arrow-back" size={18} color="#757575" />}
            iconPosition="left"
          />
        </View>
      </SafeAreaView>
    );
  }

  // --- Editing State ---
  if (isEditing) {
    // Assuming EditTaskForm handles its own safe area or doesn't need it directly
    // If EditTaskForm ALSO needs safe area, it should implement it internally
    // Or, wrap it here if it's guaranteed to be the only thing on screen
    return (
      // Wrap Editing State in SafeAreaView if EditTaskForm doesn't handle it
      <SafeAreaView className="flex-1 bg-white">
        <EditTaskForm
          taskData={task}
          navigation={navigation}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            refetch();
          }}
        />
      </SafeAreaView>
    );
  }

  // --- Helper functions (no changes needed here) ---
  const getWeightLevel = (weight) => {
    if (weight < 25) return "Low";
    if (weight < 50) return "Medium";
    if (weight < 75) return "High";
    return "Critical";
  };

  const getWeightBadgeStyle = (weight) => {
    if (weight < 25) return "bg-success-50 border-success-300 text-success-700";
    if (weight < 50)
      return "bg-tertiary-50 border-tertiary-300 text-tertiary-700";
    if (weight < 75) return "bg-warning-50 border-warning-300 text-warning-700";
    return "bg-alert-50 border-alert-300 text-alert-700";
  };

  // --- Main Render ---
  return (
    // Wrap the main content ScrollView in SafeAreaView
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1" // Removed bg-white here, applied to SafeAreaView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#233D90" // Consider platform differences if needed
          />
        }
      >
        <DeleteConfirmationModal />
        <DeleteCriteriaConfirmationModal />

        {/* Alerts can stay inside ScrollView or move outside if they need to be fixed */}
        {deleteTaskMutation.isError && (
          <Alert
            variant="alert"
            title="Delete Failed"
            message={
              typeof deleteTaskMutation.error?.message === "string"
                ? deleteTaskMutation.error.message
                : "Failed to delete task. Please try again."
            }
            className="mx-4 mt-4" // Adjust margin if needed after SafeAreaView
          />
        )}

        {deleteCriteriaMutation.isError && (
          <Alert
            variant="alert"
            title="Delete Criteria Failed"
            message={
              typeof deleteCriteriaMutation.error?.message === "string"
                ? deleteCriteriaMutation.error.message
                : "Failed to delete criteria. Please try again."
            }
            className="mx-4 mt-4" // Adjust margin if needed
          />
        )}

        {/* Inner content wrapped by View */}
        <View className="p-4 mt-5">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-4 self-start p-1" // self-start helps touchable area
          >
            <MaterialIcons name="arrow-back" size={20} color="#233D90" />
            <Text style={fonts.ecTextBody2M} className="text-primary-500 ml-1">
              Back to Tasks
            </Text>
          </TouchableOpacity>

          {/* Header Row */}
          <View className="flex-row justify-between items-start mb-5">
            <Text
              style={fonts.ecTextHeader1M}
              className="text-neutral-800 flex-1 mr-3"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {task?.name || "Task Details"}
            </Text>
            <Button
              title="Edit"
              color="primary"
              type="outlined"
              onPress={() => setIsEditing(true)}
              icon={<MaterialIcons name="edit" size={16} color="#233D90" />}
              iconPosition="left"
              className="py-2 px-3" // Compact button
              textClassName="text-sm"
            />
          </View>

          {/* Info Boxes */}
          <View className="space-y-3 mb-5">
            <View className="bg-primary-50 p-3.5 rounded-lg flex-row items-center border border-primary-100">
              <MaterialIcons name="category" size={20} color="#192B66" />
              <Text style={fonts.ecTextBody2} className="text-primary-800 ml-3">
                Category:{" "}
                <Text className="font-bold">
                  {task?.taskCategory?.name || "Uncategorized"}
                </Text>
              </Text>
            </View>
            <View className="bg-secondary-50 p-3.5 rounded-lg flex-row items-center border border-secondary-100">
              <MaterialIcons name="groups" size={20} color="#B54C11" />
              <Text
                style={fonts.ecTextBody2}
                className="text-secondary-800 ml-3"
              >
                Batch:{" "}
                <Text className="font-bold">
                  {task?.batchTasks?.[0]?.batchName || "No Batch Assigned"}
                </Text>
              </Text>
            </View>
          </View>

          {/* Schedule Card */}
          <Card
            title="Task Schedule"
            variant="info"
            icon={
              <MaterialIcons name="calendar-today" size={18} color="#336196" />
            }
            className="mb-5"
            collapsible={false} // Assuming schedule shouldn't be collapsed
          >
            <View className="space-y-2.5">
              <View className="flex-row justify-between items-center">
                <Text style={fonts.ecTextBody2} className="text-neutral-600">
                  Assigned Date:
                </Text>
                <Text
                  style={fonts.ecTextBody2M}
                  className="text-neutral-800" // Removed font-semibold for consistency, ecTextBody2M is already medium
                >
                  {formatDateTime(task?.batchTasks?.[0]?.assignedDate) || ""}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text style={fonts.ecTextBody2} className="text-neutral-600">
                  Due Date:
                </Text>
                <Text
                  style={fonts.ecTextBody2M}
                  className="text-neutral-800" // Removed font-semibold
                >
                  {formatDateTime(task?.batchTasks?.[0]?.dueDate) || ""}
                </Text>
              </View>
            </View>
          </Card>

          {/* Criteria Card */}
          <Card
            title="Assessment Criteria"
            variant="success"
            icon={<MaterialIcons name="checklist" size={18} color="#30684D" />}
            className="mb-6"
            initiallyExpanded={true}
          >
            {task?.taskCriterias && task.taskCriterias.length > 0 ? (
              <View>
                {task.taskCriterias.map((criteria, index) => {
                  const weightLevel = getWeightLevel(criteria.weight);
                  const badgeStyle = getWeightBadgeStyle(criteria.weight);

                  return (
                    <View
                      key={criteria.id}
                      className={`py-3 pr-10 relative ${
                        // Added pr-10 for delete icon spacing
                        index !== task.taskCriterias.length - 1
                          ? "border-b border-neutral-200"
                          : ""
                      }`}
                    >
                      {/* Delete Icon Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCriteriaId(criteria.id);
                          setShowCriteriaDeleteConfirm(true);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        // Adjusted positioning: top-3 is slightly higher, right-2 is slightly more inset
                        className="absolute top-3 right-2 p-1.5 rounded-full bg-neutral-100 active:bg-alert-100"
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={18}
                          color="#B54C11" // Using secondary color, adjust if needed
                        />
                      </TouchableOpacity>

                      {/* Criteria Title */}
                      <Text
                        style={fonts.ecTextSubtitle2M}
                        className="text-neutral-800 mb-1.5" // Added margin bottom
                      >
                        Criteria {index + 1}
                      </Text>

                      {/* Weight Badge - Positioned below title */}
                      <View className="self-start mb-2">
                        <View
                          className={`px-2.5 py-1 rounded-full border ${badgeStyle}`}
                        >
                          <Text
                            style={fonts.ecTextBody3M} // Use smaller font for badge
                            className={`font-semibold`} // Font color comes from badgeStyle
                          >
                            Weight: {criteria.weight} • {weightLevel}
                          </Text>
                        </View>
                      </View>

                      {/* Criteria Description */}
                      <Text
                        style={fonts.ecTextBody3} // Use Body3 for description
                        className="text-neutral-600 leading-relaxed"
                      >
                        {criteria.description || ""}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              // No Criteria View
              <View className="items-center py-4">
                <MaterialIcons name="info-outline" size={24} color="#9A9A9A" />
                <Text
                  style={fonts.ecTextBody2M}
                  className="text-neutral-500 italic mt-2"
                >
                  No assessment criteria defined for this task.
                </Text>
              </View>
            )}
          </Card>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 mb-3">
            <Button
              title="Go Back"
              color="neutral"
              type="outlined"
              onPress={() => navigation.goBack()}
              className="flex-1"
              icon={
                <MaterialIcons name="arrow-back" size={18} color="#757575" />
              }
              iconPosition="left"
            />
            <Button
              title="Delete Task"
              variant="alert"
              onPress={() => setShowDeleteConfirm(true)}
              className="flex-1"
              icon={
                <MaterialIcons name="delete-sweep" size={18} color="#FFFFFF" />
              }
              iconPosition="left"
              loading={deleteTaskMutation.isPending}
            />
          </View>

          {/* Assess Button (Currently commented out) */}
          {/* <Button
            title={"Assess Task"}
            variant="primary"
            onPress={() =>
              console.log("Navigate to Assess screen for task:", taskId)
            }
            className="w-full"
            icon={<MaterialIcons name="assessment" size={20} color="#FFFFFF" />}
            iconPosition="left"
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView> // Close SafeAreaView for main content
  );
};

export default DetailTaskScreen;
