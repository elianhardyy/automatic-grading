import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fonts } from "../../utils/font";
import { MaterialIcons } from "@expo/vector-icons";
import { traineeService } from "../../services/query/traineeService";
import { SafeAreaView } from "react-native-safe-area-context";

const TraineeDetailScreen = ({ trainee, onBack }) => {
  const { data: traineeDetails, isLoading } = useQuery({
    queryKey: ["trainee", trainee.id],
    queryFn: () => traineeService.fetchTraineeById(trainee.id),
    initialData: { data: trainee },
  });

  const traineeData = traineeDetails?.data || trainee;

  const traineeTasks = traineeData.traineeTasks || [];

  const completedTasks = traineeTasks.filter(
    (task) => task.score !== null
  ).length;
  const totalTasks = traineeTasks.length;

  const totalScore = traineeTasks
    .filter((task) => task.score !== null)
    .reduce((sum, task) => sum + task.score, 0);

  const averageScore =
    completedTasks > 0 ? Math.round(totalScore / completedTasks) : 0;

  const getPerformanceStatus = (average) => {
    if (average >= 90) return { text: "Excellent", color: "success" };
    if (average >= 80) return { text: "Good", color: "info" };
    if (average >= 70) return { text: "Satisfactory", color: "warning" };
    return { text: "Needs Improvement", color: "alert" };
  };

  const performance = getPerformanceStatus(averageScore);

  const renderTaskItem = (task, index) => {
    if (!task.score) {
      return (
        <View
          key={index}
          className="flex-row justify-between items-center py-3 border-b border-neutral-100"
        >
          <Text style={fonts.ecTextBody2} className="text-neutral-800">
            {task.taskName || `Task ${index + 1}`}
          </Text>
          <View className="bg-neutral-100 px-3 py-1 rounded-full">
            <Text style={fonts.ecTextBody3} className="text-neutral-500">
              Pending
            </Text>
          </View>
        </View>
      );
    }

    const scorePercentage = task.score;
    let scoreColor = "text-neutral-800";

    if (scorePercentage >= 90) scoreColor = "text-success-500";
    else if (scorePercentage >= 80) scoreColor = "text-info-500";
    else if (scorePercentage >= 70) scoreColor = "text-warning-500";
    else scoreColor = "text-alert-500";

    return (
      <View
        key={index}
        className="flex-row justify-between items-center py-3 border-b border-neutral-100"
      >
        <Text style={fonts.ecTextBody2} className="text-neutral-800">
          {task.taskName || `Task ${index + 1}`}
        </Text>
        <Text style={fonts.ecTextBody2} className={scoreColor}>
          {task.score}/100
        </Text>
      </View>
    );
  };

  const renderPerformanceCircle = () => {
    return (
      <View className="items-center justify-center my-4">
        <View className="relative w-32 h-32 items-center justify-center">
          <View className="absolute w-32 h-32 rounded-full border-8 border-neutral-200" />
          <View
            className={`absolute w-32 h-32 rounded-full border-8 border-${performance.color}-500`}
            style={{
              borderTopColor: "transparent",
              borderRightColor: averageScore >= 50 ? undefined : "transparent",
              borderBottomColor: averageScore >= 75 ? undefined : "transparent",
              borderLeftColor: averageScore >= 25 ? undefined : "transparent",
              transform: [{ rotate: "45deg" }],
            }}
          />
          <View className="bg-white rounded-full w-24 h-24 items-center justify-center">
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center">
        <ActivityIndicator size="large" color="#233D90" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <Button
              title="Back"
              variant="text"
              color="primary"
              icon={
                <MaterialIcons name="arrow-back" size={24} color="#233D90" />
              }
              iconPosition="left"
              onPress={onBack}
            />
            <Text
              style={fonts.ecTextHeader2M}
              className="text-neutral-800 ml-2"
            >
              Trainee Details
            </Text>
          </View>

          <Card
            title="Personal Information"
            variant="primary"
            className="mb-4"
            icon={<MaterialIcons name="person" size={20} color="#233D90" />}
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
                  {completedTasks}/{totalTasks} tasks completed
                </Text>
              </View>
            </View>
          </Card>

          <Card
            title="Performance Overview"
            variant="info"
            className="mb-4"
            icon={<MaterialIcons name="insights" size={20} color="#4888D3" />}
          >
            {renderPerformanceCircle()}
          </Card>

          <Card
            title="Task Assessments"
            variant="primary"
            className="mb-4"
            icon={<MaterialIcons name="assignment" size={20} color="#233D90" />}
          >
            {traineeTasks.length > 0 ? (
              <View className="mb-2">{traineeTasks.map(renderTaskItem)}</View>
            ) : (
              <View className="py-4 items-center">
                <Text style={fonts.ecTextBody2} className="text-neutral-500">
                  No tasks assigned yet
                </Text>
              </View>
            )}

            {completedTasks < totalTasks && (
              <View className="mt-4">
                <Button
                  title="Add Assessment"
                  variant="primary"
                  icon={<MaterialIcons name="add" size={20} color="#FFFFFF" />}
                  iconPosition="left"
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
