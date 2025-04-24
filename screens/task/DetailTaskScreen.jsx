import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTaskById,
  deleteTaskWithCriteria,
  deleteTaskCriteria,
} from "../../query/task";
import { fonts } from "../../utils/font";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import EditTaskForm from "../../components/tasks/EditTaskForm";
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
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
  });

  const task = taskData?.data;

  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTaskWithCriteria(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Delete task error:", error);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteCriteriaMutation = useMutation({
    mutationFn: (criteriaId) => deleteTaskCriteria(criteriaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      setSelectedCriteriaId(null);
    },
    onError: (error) => {
      console.error("Delete criteria error:", error);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate();
  };

  const handleDeleteCriteria = () => {
    if (selectedCriteriaId) {
      deleteCriteriaMutation.mutate(selectedCriteriaId);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    return `${date.toLocaleDateString(
      undefined,
      dateOptions
    )} ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  const DeleteConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showDeleteConfirm}
      onRequestClose={() => setShowDeleteConfirm(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-4/5 rounded-lg p-5 shadow-lg">
          <Text
            style={fonts.ecTextBody1}
            className="text-neutral-800 font-medium mb-2"
          >
            Confirm Deletion
          </Text>
          <Text style={fonts.ecTextBody2} className="text-neutral-600 mb-4">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Text>
          <View className="flex-row justify-end">
            <Button
              title="Cancel"
              variant="neutral"
              type="text"
              onPress={() => setShowDeleteConfirm(false)}
              className="mr-2"
            />
            <Button
              title="Delete"
              variant="alert"
              loading={deleteTaskMutation.isPending}
              onPress={() => {
                handleDeleteTask();
                setShowDeleteConfirm(false);
              }}
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
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-4/5 rounded-lg p-5 shadow-lg">
          <Text
            style={fonts.ecTextBody1}
            className="text-neutral-800 font-medium mb-2"
          >
            Delete Criteria
          </Text>
          <Text style={fonts.ecTextBody2} className="text-neutral-600 mb-4">
            Are you sure you want to delete this assessment criteria? This
            action cannot be undone.
          </Text>
          <View className="flex-row justify-end">
            <Button
              title="Cancel"
              variant="neutral"
              type="text"
              onPress={() => {
                setShowCriteriaDeleteConfirm(false);
                setSelectedCriteriaId(null);
              }}
              className="mr-2"
            />
            <Button
              title="Delete"
              variant="alert"
              loading={deleteCriteriaMutation.isPending}
              onPress={() => {
                handleDeleteCriteria();
                setShowCriteriaDeleteConfirm(false);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // Skeleton loading screen
  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          {/* Back navigation skeleton */}
          <View className="flex-row items-center mb-4">
            <Skeleton
              width={30}
              height={30}
              radius={15}
              style={{ marginRight: 10 }}
            />
            <Skeleton width={100} height={16} />
          </View>

          {/* Header skeleton */}
          <View className="mb-4">
            <Skeleton height={30} style={{ marginBottom: 10 }} />
            <View className="flex-row justify-end">
              <Skeleton width={80} height={36} radius={8} />
            </View>
          </View>

          {/* Task Category skeleton */}
          <Skeleton height={50} style={{ marginBottom: 16 }} />

          {/* Batch Information skeleton */}
          <Skeleton height={50} style={{ marginBottom: 16 }} />

          {/* Task Schedule skeleton */}
          <Skeleton height={120} style={{ marginBottom: 16 }} />

          {/* Assessment Criteria skeleton */}
          <Skeleton height={40} style={{ marginBottom: 10 }} />
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} height={80} style={{ marginBottom: 10 }} />
          ))}

          {/* Action Buttons skeleton */}
          <View className="flex-row justify-between mt-6 mb-6">
            <Skeleton width="48%" height={48} radius={8} />
            <Skeleton width="48%" height={48} radius={8} />
          </View>

          {/* Assess button skeleton */}
          <Skeleton height={48} radius={8} style={{ marginBottom: 20 }} />
        </View>
      </ScrollView>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 p-4 bg-white">
        <Alert
          variant="alert"
          title="Error Loading Task"
          message={
            error?.message || "Failed to load task details. Please try again."
          }
        />
        <Button
          title="Try Again"
          variant="primary"
          onPress={refetch}
          className="mt-4"
        />
        <Button
          title="Go Back"
          variant="neutral"
          type="outlined"
          onPress={() => navigation.goBack()}
          className="mt-2"
        />
      </View>
    );
  }

  // If editing, render the EditTaskForm component
  if (isEditing) {
    return (
      <EditTaskForm
        taskData={task}
        navigation={navigation}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          refetch();
        }}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <DeleteConfirmationModal />
      <DeleteCriteriaConfirmationModal />

      {deleteTaskMutation.isError && (
        <Alert
          variant="alert"
          title="Delete Failed"
          message={
            deleteTaskMutation.error?.message ||
            "Failed to delete task. Please try again."
          }
          className="mx-4 mt-4"
        />
      )}

      {deleteCriteriaMutation.isError && (
        <Alert
          variant="alert"
          title="Delete Criteria Failed"
          message={
            deleteCriteriaMutation.error?.message ||
            "Failed to delete criteria. Please try again."
          }
          className="mx-4 mt-4"
        />
      )}

      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-1 mr-2"
          >
            <MaterialIcons name="arrow-back" size={20} color="#233D90" />
          </TouchableOpacity>
          <Text style={fonts.ecTextBody2} className="text-primary-500">
            Back to Tasks
          </Text>
        </View>

        {/* Header with Task Name and Actions */}
        <View className="flex-row justify-between items-center mb-4">
          <Text
            style={fonts.ecTextHeader2M}
            className="text-neutral-800 flex-1"
          >
            {task.name}
          </Text>
          <View className="flex-row">
            <Button
              title="Edit"
              variant="primary"
              type="outlined"
              onPress={() => setIsEditing(true)}
              icon={<MaterialIcons name="edit" size={18} color="#233D90" />}
              iconPosition="left"
              className="mr-2"
            />
          </View>
        </View>

        {/* Task Category */}
        <View className="bg-primary-50 p-3 rounded-lg mb-4 flex-row items-center">
          <MaterialIcons name="category" size={20} color="#233D90" />
          <Text style={fonts.ecTextBody2} className="text-primary-700 ml-2">
            Category: {task.taskCategory?.name || "Not categorized"}
          </Text>
        </View>

        {/* Batch Information */}
        <View className="bg-secondary-50 p-3 rounded-lg mb-4 flex-row items-center">
          <MaterialIcons name="dashboard" size={20} color="#FF6B18" />
          <Text style={fonts.ecTextBody2} className="text-secondary-700 ml-2">
            Batch: {task.batchTasks?.[0]?.batchName || "No batch"}
          </Text>
        </View>

        {/* Dates */}
        <Card
          title="Task Schedule"
          variant="info"
          icon={
            <MaterialIcons name="calendar-today" size={20} color="#0277BD" />
          }
          className="mb-4"
        >
          <View className="flex-row justify-between mb-2">
            <Text style={fonts.ecTextBody2} className="text-neutral-700">
              Assigned Date:
            </Text>
            <Text
              style={fonts.ecTextBody2}
              className="text-neutral-800 font-medium"
            >
              {formatDateTime(task.batchTasks?.[0]?.assignedDate)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={fonts.ecTextBody2} className="text-neutral-700">
              Due Date:
            </Text>
            <Text
              style={fonts.ecTextBody2}
              className="text-neutral-800 font-medium"
            >
              {formatDateTime(task.batchTasks?.[0]?.dueDate)}
            </Text>
          </View>
        </Card>

        {/* Assessment Criteria */}
        <Card
          title="Assessment Criteria"
          variant="success"
          icon={<MaterialIcons name="assessment" size={20} color="#2E7D32" />}
          className="mb-6"
        >
          {task.taskCriterias && task.taskCriterias.length > 0 ? (
            task.taskCriterias.map((criteria, index) => (
              <View
                key={criteria.id}
                className={`p-3 ${
                  index !== task.taskCriterias.length - 1
                    ? "border-b border-neutral-200"
                    : ""
                }`}
              >
                <View className="flex-row justify-between mb-1">
                  <View className="flex-row items-center">
                    <Text
                      style={fonts.ecTextBody2}
                      className="text-neutral-800 font-medium"
                    >
                      Criteria {index + 1}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-full ml-2 ${
                        criteria.weight < 5
                          ? "bg-success-100 border border-success-500"
                          : criteria.weight < 10
                          ? "bg-neutral-100 border border-tertiary-500"
                          : criteria.weight < 15
                          ? "bg-neutral-100 border border-secondary-500"
                          : "bg-neutral-100 border border-alert-500"
                      }`}
                    >
                      <Text
                        style={fonts.ecTextBody3}
                        className={`font-medium ${
                          criteria.weight < 5
                            ? "text-success-800"
                            : criteria.weight < 10
                            ? "text-neutral-800"
                            : criteria.weight < 15
                            ? "text-secondary-800"
                            : "text-alert-800"
                        }`}
                      >
                        Weight: {criteria.weight} •{" "}
                        {criteria.weight < 5
                          ? "Low"
                          : criteria.weight < 10
                          ? "Medium"
                          : criteria.weight < 15
                          ? "High"
                          : "Critical"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCriteriaId(criteria.id);
                      setShowCriteriaDeleteConfirm(true);
                    }}
                    className="p-1"
                  >
                    <MaterialIcons name="close" size={18} color="#CB3A31" />
                  </TouchableOpacity>
                </View>
                <Text style={fonts.ecTextBody2} className="text-neutral-700">
                  {criteria.description}
                </Text>
              </View>
            ))
          ) : (
            <Text style={fonts.ecTextBody2} className="text-neutral-500 italic">
              No assessment criteria defined
            </Text>
          )}
        </Card>

        {/* Action Buttons */}
        <View className="flex-row mb-6">
          <Button
            title="Go Back"
            variant="neutral"
            type="outlined"
            onPress={() => navigation.goBack()}
            className="flex-1 mr-2"
          />
          <Button
            title="Delete Task"
            variant="alert"
            onPress={() => setShowDeleteConfirm(true)}
            className="flex-1 ml-2"
            icon={<MaterialIcons name="delete" size={18} color="#FFFFFF" />}
            iconPosition="left"
          />
        </View>
        <Button
          title={"Assess"}
          variant="primary"
          onPress={() => console.log("assess")}
          className="w-full mt-2"
          icon={<MaterialIcons name="assessment" size={18} color="#FFFFFF" />}
          iconPosition="left"
        />
      </View>
    </ScrollView>
  );
};

export default DetailTaskScreen;
