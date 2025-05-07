import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native"; // Added ActivityIndicator import
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fonts } from "../../utils/font";
import { MaterialIcons } from "@expo/vector-icons";
import { traineeService } from "../../services/query/traineeService";
import { SafeAreaView } from "react-native-safe-area-context";

const TraineeDetailScreen = ({ trainee, onBack }) => {
  // Fetch trainee details using the passed trainee's ID
  const {
    data: queryResult, // Rename data to queryResult to avoid naming conflicts
    isLoading,
    isError, // Add isError state
    error, // Add error object
  } = useQuery({
    queryKey: ["trainee", trainee.id],
    queryFn: () => traineeService.fetchTraineeById(trainee.id),
    // Keep initialData if desired, ensuring 'trainee' prop has a compatible structure
    // If 'trainee' prop might lack 'traineeTasks', removing initialData might be safer
    // initialData: { data: trainee }, // Assuming trainee prop has the basic structure
  });

  // Extract the actual trainee data from the API response structure
  // Use optional chaining for safety
  const traineeData = queryResult?.data;

  // Use traineeTasks from fetched data, fallback to empty array if not available yet
  const traineeTasks = traineeData?.traineeTasks || [];

  // --- Recalculate based on the new API structure ---

  // Count tasks that have been graded (assuming grade > 0 means graded)
  // If grade can be 0, you might need another indicator like submitTime !== null
  const completedTasks = traineeTasks.filter(
    (task) => task.grade !== null && task.grade > 0 // Changed from score !== null to grade !== null && grade > 0
  ).length;
  const totalTasks = traineeTasks.length;

  // Calculate total score from graded tasks
  const totalScore = traineeTasks
    .filter((task) => task.grade !== null && task.grade > 0) // Filter only graded tasks
    .reduce((sum, task) => sum + task.grade, 0); // Sum task.grade

  // Calculate average score, handle division by zero
  const averageScore =
    completedTasks > 0 ? Math.round(totalScore / completedTasks) : 0;

  // Determine performance status based on average score
  const getPerformanceStatus = (average) => {
    if (average >= 90) return { text: "Excellent", color: "success" };
    if (average >= 80) return { text: "Good", color: "info" };
    if (average >= 70) return { text: "Satisfactory", color: "warning" };
    return { text: "Needs Improvement", color: "alert" };
  };

  const performance = getPerformanceStatus(averageScore);

  // --- Render Task Item ---
  const renderTaskItem = (task, index) => {
    // Check if task is pending (assuming grade 0 or null means pending)
    const isPending = task.grade === null || task.grade === 0; // Changed from !task.score
    const taskName = task.batchTask?.taskName || `Task ${index + 1}`; // Get task name from batchTask

    if (isPending) {
      return (
        <View
          key={task.id || index} // Use task.id as key if available
          className="flex-row justify-between items-center py-3 border-b border-neutral-100"
        >
          <Text style={fonts.ecTextBody2} className="text-neutral-800">
            {taskName}
          </Text>
          <View className="bg-neutral-100 px-3 py-1 rounded-full">
            <Text style={fonts.ecTextBody3} className="text-neutral-500">
              Pending
            </Text>
          </View>
        </View>
      );
    }

    // Task is graded
    const scorePercentage = task.grade; // Use task.grade
    let scoreColor = "text-neutral-800";

    if (scorePercentage >= 90) scoreColor = "text-success-500";
    else if (scorePercentage >= 80) scoreColor = "text-info-500";
    else if (scorePercentage >= 70) scoreColor = "text-warning-500";
    else scoreColor = "text-alert-500";

    return (
      <View
        key={task.id || index} // Use task.id as key
        className="flex-row justify-between items-center py-3 border-b border-neutral-100"
      >
        <Text style={fonts.ecTextBody2} className="text-neutral-800">
          {taskName}
        </Text>
        <Text style={fonts.ecTextBody2} className={scoreColor}>
          {task.grade}/100
          {/* Assuming max score is 100. Adjust if needed */}
        </Text>
      </View>
    );
  };

  // --- Performance Circle (No changes needed in logic, but relies on correct averageScore) ---
  const renderPerformanceCircle = () => {
    // Ensure averageScore is calculated correctly before this renders
    return (
      <View className="items-center justify-center my-4">
        <View className="relative w-32 h-32 items-center justify-center">
          {/* Background Circle */}
          <View className="absolute w-32 h-32 rounded-full border-8 border-neutral-200" />
          {/* Progress Arc - Simplified example, might need a dedicated library for perfect arcs */}
          <View
            className={`absolute w-32 h-32 rounded-full border-8 border-${performance.color}-500`}
            style={{
              borderTopColor: "transparent",
              // This rotation logic is complex and might not be accurate for all percentages.
              // Consider using a circular progress library for better visuals.
              transform: [{ rotate: `${45 + (averageScore / 100) * 360}deg` }],
            }}
          />
          {/* Inner Circle with Text */}
          <View className="absolute bg-white rounded-full w-24 h-24 items-center justify-center shadow-md">
            <Text
              style={fonts.ecTextHeader2M}
              className={`text-${performance.color}-500`}
            >
              {averageScore}%
            </Text>
            <Text style={fonts.ecTextBody3} className="text-neutral-500">
              {performance.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // --- Loading and Error States ---
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center">
        <ActivityIndicator size="large" color="#233D90" />
        <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-2">
          Loading details...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={64} color="#CB3A31" />
        <Text
          style={fonts.ecTextHeader2M}
          className="text-neutral-800 mt-4 text-center"
        >
          Error Loading Trainee Details
        </Text>
        <Text
          style={fonts.ecTextBody2}
          className="text-neutral-600 mt-2 text-center"
        >
          {error?.message ||
            "Could not fetch trainee details. Please try again later."}
        </Text>
        <Button
          title="Back"
          variant="primary"
          onPress={onBack}
          className="mt-6"
          icon={<MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />}
          iconPosition="left"
        />
      </SafeAreaView>
    );
  }

  // Ensure traineeData is available before rendering main content
  if (!traineeData) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center p-4">
        <MaterialIcons name="person-off" size={64} color="#C2C2C2" />
        <Text
          style={fonts.ecTextHeader2M}
          className="text-neutral-800 mt-4 text-center"
        >
          Trainee Not Found
        </Text>
        <Text
          style={fonts.ecTextBody2}
          className="text-neutral-600 mt-2 text-center"
        >
          The requested trainee data could not be found.
        </Text>
        <Button
          title="Back"
          variant="primary"
          onPress={onBack}
          className="mt-6"
          icon={<MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />}
          iconPosition="left"
        />
      </SafeAreaView>
    );
  }

  // --- Main Render ---
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header with Back Button */}
          <View className="flex-row items-center mb-4">
            <Button
              title="Back"
              variant="text"
              color="primary"
              onPress={onBack}
              icon={
                <MaterialIcons name="arrow-back" size={24} color="#233D90" />
              }
              iconPosition="left"
              className="pl-0 pr-2 py-1"
            />
            <Text
              style={fonts.ecTextHeader2M}
              className="text-neutral-800"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {traineeData.name}'s Details
            </Text>
          </View>

          {/* Personal Information Card */}
          <Card
            title="Personal Information"
            variant="primary"
            className="mb-4"
            icon={<MaterialIcons name="person" size={20} color="#233D90" />}
            initiallyExpanded={true} // Keep this expanded by default
          >
            <View className="space-y-2">
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Name:
                </Text>
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-800 flex-1"
                >
                  {traineeData.name}
                </Text>
              </View>
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Phone:
                </Text>
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-800 flex-1"
                >
                  {traineeData.phoneNumber || "-"}
                </Text>
              </View>
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Address:
                </Text>
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-800 flex-1"
                >
                  {traineeData.address || "-"}
                </Text>
              </View>
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Progress:
                </Text>
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-800 flex-1"
                >
                  {completedTasks}/{totalTasks} tasks graded
                </Text>
              </View>
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Status:
                </Text>
                <Text
                  style={[
                    fonts.ecTextBody2,
                    { color: traineeData.isActive ? "#43936C" : "#CB3A31" },
                  ]} // Use success/alert colors
                  className="font-bold"
                >
                  {traineeData.isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </Card>

          <Card
            title="Performance Overview"
            variant="info"
            className="mb-4"
            icon={<MaterialIcons name="insights" size={20} color="#4888D3" />}
            initiallyExpanded={true}
          >
            {renderPerformanceCircle()}
            <Text
              style={fonts.ecTextBody3}
              className="text-neutral-600 text-center mt-2"
            >
              Average score based on {completedTasks} graded task(s).
            </Text>
          </Card>

          {/* Task Assessments Card */}
          <Card
            title="Task Assessments"
            variant="primary"
            className="mb-4"
            icon={<MaterialIcons name="assignment" size={20} color="#233D90" />}
            initiallyExpanded={false} // Collapse this by default maybe?
          >
            {traineeTasks.length > 0 ? (
              <View className="mb-2">{traineeTasks.map(renderTaskItem)}</View>
            ) : (
              <View className="py-4 items-center">
                <Text style={fonts.ecTextBody2} className="text-neutral-500">
                  No tasks assigned yet for this trainee.
                </Text>
              </View>
            )}

            {totalTasks > 0 && (
              <View className="mt-4 border-t border-neutral-200 pt-4">
                <Button
                  title="Grade Tasks" // More specific title?
                  variant="primary"
                  icon={
                    <MaterialIcons name="add-task" size={20} color="#FFFFFF" />
                  } // More specific icon?
                  iconPosition="left"
                  // onPress={() => { /* Navigate to grading screen?
                  // disabled={completedTasks === totalTasks} // Disable if all graded
                />
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TraineeDetailScreen;
