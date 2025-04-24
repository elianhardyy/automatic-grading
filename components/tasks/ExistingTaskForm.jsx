import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createTaskWithCriteria, getAllTaskCategory } from "../../query/task";
import { fonts } from "../../utils/font";
import Button from "../common/Button";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Alert from "../common/Alert";
import Select from "../common/Select";
import Card from "../common/Card";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";

function formatDateToLocal(dateString) {
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
const ExistingTaskForm = ({
  taskData,
  batchId,
  batchName,
  navigation,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    taskData.batchTasks?.[0]?.assignedDate
      ? new Date(taskData.batchTasks[0].assignedDate)
      : new Date()
  );
  const [dueDate, setDueDate] = useState(
    taskData.batchTasks?.[0]?.dueDate
      ? new Date(taskData.batchTasks[0].dueDate)
      : new Date()
  );
  const [showAssignedDatePicker, setShowAssignedDatePicker] = useState(false);
  const [showAssignedTimePicker, setShowAssignedTimePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showDueTimePicker, setShowDueTimePicker] = useState(false);
  const [criteria, setCriteria] = useState([
    { id: 1, description: "", weight: 1 },
  ]);
  const [successModal, setSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize form data from taskData when component mounts
  useEffect(() => {
    if (taskData) {
      setTaskName(taskData.name);
      setTaskCategory(taskData.taskCategory?.id || "");

      // Initialize criteria from taskData.taskCriterias if available
      if (taskData.taskCriterias && taskData.taskCriterias.length > 0) {
        setCriteria(
          taskData.taskCriterias.map((item, index) => ({
            id: index + 1,
            description: item.description || "",
            weight: item.weight || 1,
          }))
        );
      }

      // Keep default current dates for assigned and due dates
    }
  }, [taskData]);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["taskCategories"],
    queryFn: getAllTaskCategory,
    onError: (error) => {
      console.error("Error fetching task categories:", error);
    },
  });

  const categoryOptions =
    categoriesData?.data?.map((category) => ({
      label: category.name,
      value: category.id,
    })) || [];

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (payload) =>
      createTaskWithCriteria(
        {
          name: payload.name,
          taskCategoryId: payload.taskCategoryId,
          assignedDate: payload.assignedDate,
          dueDate: payload.dueDate,
          batchId: payload.batchId,
        },
        payload.criteria
      ),
    onSuccess: (data) => {
      setSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      console.error("Error creating task:", err);
    },
  });

  const formatDateOnly = (date) => {
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, dateOptions);
  };

  const formatTimeOnly = (date) => {
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return date.toLocaleTimeString(undefined, timeOptions);
  };

  const onAssignedDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = new Date(selectedDate);

      if (!showAssignedTimePicker) {
        currentDate.setHours(assignedDate.getHours());
        currentDate.setMinutes(assignedDate.getMinutes());
        currentDate.setSeconds(assignedDate.getSeconds());
      }

      setAssignedDate(currentDate);

      if (Platform.OS === "android") {
        setShowAssignedDatePicker(false);
      }
    } else {
      setShowAssignedDatePicker(Platform.OS === "ios");
    }

    if (validationErrors.assignedDate) {
      setValidationErrors({ ...validationErrors, assignedDate: null });
    }
  };

  const onAssignedTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const currentDate = new Date(assignedDate);
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      currentDate.setSeconds(selectedTime.getSeconds());

      setAssignedDate(currentDate);

      if (Platform.OS === "android") {
        setShowAssignedTimePicker(false);
      }
    } else {
      setShowAssignedTimePicker(Platform.OS === "ios");
    }
  };

  const onDueDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = new Date(selectedDate);

      if (!showDueTimePicker) {
        currentDate.setHours(dueDate.getHours());
        currentDate.setMinutes(dueDate.getMinutes());
        currentDate.setSeconds(dueDate.getSeconds());
      }

      setDueDate(currentDate);

      if (Platform.OS === "android") {
        setShowDueDatePicker(false);
      }
    } else {
      setShowDueDatePicker(Platform.OS === "ios");
    }

    if (validationErrors.dueDate) {
      setValidationErrors({ ...validationErrors, dueDate: null });
    }
  };

  const onDueTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const currentDate = new Date(dueDate);
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      currentDate.setSeconds(selectedTime.getSeconds());

      setDueDate(currentDate);

      if (Platform.OS === "android") {
        setShowDueTimePicker(false);
      }
    } else {
      setShowDueTimePicker(Platform.OS === "ios");
    }
  };

  const handleShowAssignedDatePicker = () => {
    setShowAssignedDatePicker(true);
    setShowAssignedTimePicker(false);
    setShowDueDatePicker(false);
    setShowDueTimePicker(false);
  };

  const handleShowAssignedTimePicker = () => {
    setShowAssignedDatePicker(false);
    setShowAssignedTimePicker(true);
    setShowDueDatePicker(false);
    setShowDueTimePicker(false);
  };

  const handleShowDueDatePicker = () => {
    setShowAssignedDatePicker(false);
    setShowAssignedTimePicker(false);
    setShowDueDatePicker(true);
    setShowDueTimePicker(false);
  };

  const handleShowDueTimePicker = () => {
    setShowAssignedDatePicker(false);
    setShowAssignedTimePicker(false);
    setShowDueDatePicker(false);
    setShowDueTimePicker(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!taskName.trim()) {
      errors.taskName = "Task name is required";
    }

    if (!taskCategory) {
      errors.taskCategory = "Please select a category";
    }

    if (!assignedDate) {
      errors.assignedDate = "Assigned date and time is required";
    }

    if (!dueDate) {
      errors.dueDate = "Due date and time is required";
    }

    if (assignedDate && dueDate && dueDate < assignedDate) {
      errors.dueDate =
        "Due date and time cannot be earlier than assigned date and time";
    }

    const criteriasValid = criteria.every((item, index) => {
      const isValid = item.description.trim() !== "";
      if (!isValid) {
        errors[`criteria_${index}`] = "Description is required";
      }
      return isValid;
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCriteria = () => {
    setCriteria([
      ...criteria,
      { id: criteria.length + 1, description: "", weight: 1 },
    ]);
  };

  const handleRemoveCriteria = (id) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((item) => item.id !== id));
    }
  };

  const handleUpdateCriteria = (id, field, value) => {
    setCriteria(
      criteria.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      name: taskName,
      taskCategoryId: taskCategory,
      assignedDate: assignedDate.toISOString(),
      dueDate: dueDate.toISOString(),
      batchId: batchId,
      criteria: criteria.map((item) => ({
        description: item.description,
        weight: parseInt(item.weight, 10) || 1,
      })),
    };

    mutate(payload);
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Selected batch and task info */}
        <View className="bg-primary-50 p-3 rounded-lg mb-4">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="group" size={20} color="#233D90" />
            <Text style={fonts.ecTextBody2} className="text-primary-700 ml-2">
              Selected batch: {batchName}
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons name="assignment" size={20} color="#233D90" />
            <Text style={fonts.ecTextBody2} className="text-primary-700 ml-2">
              Creating from: {taskData?.name}
            </Text>
          </View>
        </View>

        {isError && (
          <Alert
            variant="alert"
            title="Error"
            message={
              error?.message || "Failed to create task. Please try again."
            }
            className="mb-4"
          />
        )}

        {/* Task Name */}
        <View className="mb-4">
          <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-2">
            Task Name <Text className="text-alert-500">*</Text>
          </Text>
          <Input
            variant="rounded"
            placeholder="Enter task name"
            value={taskName}
            onChangeText={(text) => {
              setTaskName(text);
              if (validationErrors.taskName) {
                setValidationErrors({ ...validationErrors, taskName: null });
              }
            }}
            error={validationErrors.taskName}
          />
        </View>

        {/* Task Category */}
        <View className="mb-4">
          <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-2">
            Task Category <Text className="text-alert-500">*</Text>
          </Text>
          {categoriesLoading ? (
            <View className="flex-row items-center justify-center p-3">
              <ActivityIndicator size="small" color="#233D90" />
              <Text className="ml-2 text-neutral-600">
                Loading categories...
              </Text>
            </View>
          ) : (
            <Select
              variant="rounded"
              options={categoryOptions}
              value={taskCategory}
              onValueChange={(value) => {
                setTaskCategory(value);
                if (validationErrors.taskCategory) {
                  setValidationErrors({
                    ...validationErrors,
                    taskCategory: null,
                  });
                }
              }}
              placeholder="Select task category"
            />
          )}
          {validationErrors.taskCategory && (
            <Text className="text-alert-500 text-xs mt-1">
              {validationErrors.taskCategory}
            </Text>
          )}
        </View>

        {/* Assigned Date and Time */}
        <View className="mb-4">
          <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-2">
            Assigned Date & Time <Text className="text-alert-500">*</Text>
          </Text>
          <View className="flex-row space-x-2">
            {/* Assigned Date Input */}
            <TouchableOpacity
              onPress={handleShowAssignedDatePicker}
              className="flex-1 border border-neutral-300 bg-white p-3 rounded-lg flex-row justify-between items-center"
            >
              <Text className="text-neutral-800">
                {formatDateOnly(assignedDate)}
              </Text>
              <MaterialIcons name="event" size={20} color="#757575" />
            </TouchableOpacity>

            {/* Assigned Time Input */}
            <TouchableOpacity
              onPress={handleShowAssignedTimePicker}
              className="flex-1 border border-neutral-300 bg-white p-3 rounded-lg flex-row justify-between items-center"
            >
              <Text className="text-neutral-800">
                {formatTimeOnly(assignedDate)}
              </Text>
              <MaterialIcons name="access-time" size={20} color="#757575" />
            </TouchableOpacity>
          </View>

          {showAssignedDatePicker && (
            <DateTimePicker
              value={assignedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onAssignedDateChange}
            />
          )}

          {showAssignedTimePicker && (
            <DateTimePicker
              value={assignedDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onAssignedTimeChange}
            />
          )}

          {validationErrors.assignedDate && (
            <Text className="text-alert-500 text-xs mt-1">
              {validationErrors.assignedDate}
            </Text>
          )}
        </View>

        {/* Due Date and Time */}
        <View className="mb-4">
          <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-2">
            Due Date & Time <Text className="text-alert-500">*</Text>
          </Text>
          <View className="flex-row space-x-2">
            {/* Due Date Input */}
            <TouchableOpacity
              onPress={handleShowDueDatePicker}
              className="flex-1 border border-neutral-300 bg-white p-3 rounded-lg flex-row justify-between items-center"
            >
              <Text className="text-neutral-800">
                {formatDateOnly(dueDate)}
              </Text>
              <MaterialIcons name="event" size={20} color="#757575" />
            </TouchableOpacity>

            {/* Due Time Input */}
            <TouchableOpacity
              onPress={handleShowDueTimePicker}
              className="flex-1 border border-neutral-300 bg-white p-3 rounded-lg flex-row justify-between items-center"
            >
              <Text className="text-neutral-800">
                {formatTimeOnly(dueDate)}
              </Text>
              <MaterialIcons name="access-time" size={20} color="#757575" />
            </TouchableOpacity>
          </View>

          {showDueDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDueDateChange}
              minimumDate={assignedDate}
            />
          )}

          {showDueTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onDueTimeChange}
            />
          )}

          {validationErrors.dueDate && (
            <Text className="text-alert-500 text-xs mt-1">
              {validationErrors.dueDate}
            </Text>
          )}
        </View>

        {/* Assessment Criteria */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-2">
              Assessment Criteria <Text className="text-alert-500">*</Text>
            </Text>
            <Button
              title="Add Criteria"
              onPress={handleAddCriteria}
              type="text"
              color="primary"
              icon={<MaterialIcons name="add" size={16} color="#233D90" />}
              iconPosition="left"
              className="bg-primary-50 py-1 px-3 rounded-full"
            />
          </View>

          {criteria.map((item, index) => (
            <Card
              key={item.id}
              title={`Criteria ${index + 1}`}
              variant="neutral"
              className="mb-3"
              collapsible={false}
              action={
                criteria.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => handleRemoveCriteria(item.id)}
                    className="flex-row items-center justify-center py-2"
                  >
                    <MaterialIcons name="delete" size={16} color="#CB3A31" />
                    <Text className="text-alert-500 ml-1">Remove</Text>
                  </TouchableOpacity>
                ) : null
              }
            >
              <View className="mb-3">
                <Text
                  style={fonts.ecTextBody3}
                  className="text-neutral-700 mb-2"
                >
                  Description <Text className="text-alert-500">*</Text>
                </Text>
                <TextArea
                  variant="rounded"
                  placeholder="Enter criteria description"
                  rows={3}
                  value={item.description}
                  onChangeText={(text) => {
                    handleUpdateCriteria(item.id, "description", text);
                    if (validationErrors[`criteria_${index}`]) {
                      const newErrors = { ...validationErrors };
                      delete newErrors[`criteria_${index}`];
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                {validationErrors[`criteria_${index}`] && (
                  <Text className="text-alert-500 text-xs mt-1">
                    {validationErrors[`criteria_${index}`]}
                  </Text>
                )}
              </View>

              <View>
                <Text
                  style={fonts.ecTextBody3}
                  className="text-neutral-700 mb-2"
                >
                  Weight
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {
                      const currentWeight = parseInt(item.weight) || 1;
                      if (currentWeight > 1) {
                        handleUpdateCriteria(
                          item.id,
                          "weight",
                          String(currentWeight - 1)
                        );
                      }
                    }}
                    className="h-10 w-10 bg-neutral-100 rounded-l-lg justify-center items-center border border-neutral-300"
                  >
                    <MaterialIcons name="remove" size={20} color="#575757" />
                  </TouchableOpacity>

                  <View className="h-10 px-4 justify-center items-center border-t border-b border-neutral-300 bg-white">
                    <Text style={fonts.ecTextBody2}>{item.weight}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      const currentWeight = parseInt(item.weight) || 1;
                      handleUpdateCriteria(
                        item.id,
                        "weight",
                        String(currentWeight + 1)
                      );
                    }}
                    className="h-10 w-10 bg-neutral-100 rounded-r-lg justify-center items-center border border-neutral-300"
                  >
                    <MaterialIcons name="add" size={20} color="#575757" />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}

          {/* Add more criteria note */}
          {criteria.length === 0 ? (
            <Text className="text-neutral-500 text-xs mt-1">
              At least one criteria is required.
            </Text>
          ) : (
            <Button
              title={isLoading ? "Loading..." : "Add Criteria"}
              variant="primary"
              onPress={handleAddCriteria}
              loading={isLoading}
              className="w-full mt-2"
              icon={
                !isLoading ? (
                  <MaterialIcons name="add" size={18} color="#FFFFFF" />
                ) : null
              }
              iconPosition="left"
              textClassName={isLoading ? "text-neutral-500" : ""}
            />
          )}
        </View>

        {/* Form Actions */}
        <View className="flex-row justify-between mb-6">
          <Button
            title="Cancel"
            variant="neutral"
            type="outlined"
            onPress={onCancel}
            className="flex-1 mr-2"
          />
          <Button
            title={isLoading ? "Creating..." : "Add Task to Batch"}
            variant="primary"
            onPress={handleSubmit}
            loading={isLoading}
            className="flex-1 ml-2"
            icon={
              !isLoading ? (
                <MaterialIcons name="check" size={18} color="#FFFFFF" />
              ) : null
            }
            iconPosition="left"
          />
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={successModal}
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white p-6 rounded-lg w-5/6 max-w-md">
            <View className="items-center mb-4">
              <MaterialIcons name="check-circle" size={60} color="#43936C" />
              <Text
                style={fonts.ecTextHeader2M}
                className="text-success-700 mt-2"
              >
                Success!
              </Text>
            </View>

            <Text
              style={fonts.ecTextBody1}
              className="text-center text-neutral-700 mb-4"
            >
              Task "{taskName}" has been added to batch "{batchName}"
              successfully.
            </Text>

            <Button
              title="Go to Tasks"
              variant="success"
              onPress={closeSuccessModal}
              className="w-full"
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ExistingTaskForm;
