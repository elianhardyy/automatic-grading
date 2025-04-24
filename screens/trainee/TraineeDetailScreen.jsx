import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fonts } from "../../utils/font";
import { MaterialIcons } from "@expo/vector-icons";

const TraineeDetailScreen = ({ trainee, onBack }) => {
  // Calculate average score
  const completedTasks = trainee.tasks.filter((task) => !task.pending);
  const totalScore = completedTasks.reduce((sum, task) => sum + task.score, 0);
  const averageScore =
    completedTasks.length > 0
      ? Math.round(totalScore / completedTasks.length)
      : 0;

  // Calculate performance status
  const getPerformanceStatus = (average) => {
    if (average >= 90) return { text: "Excellent", color: "success" };
    if (average >= 80) return { text: "Good", color: "info" };
    if (average >= 70) return { text: "Satisfactory", color: "warning" };
    return { text: "Needs Improvement", color: "alert" };
  };

  const performance = getPerformanceStatus(averageScore);

  const renderTaskItem = (task, index) => {
    if (task.pending) {
      return (
        <View
          key={index}
          className="flex-row justify-between items-center py-3 border-b border-neutral-100"
        >
          <Text style={fonts.ecTextBody2} className="text-neutral-800">
            {task.name}
          </Text>
          <View className="bg-neutral-100 px-3 py-1 rounded-full">
            <Text style={fonts.ecTextBody3} className="text-neutral-500">
              Pending
            </Text>
          </View>
        </View>
      );
    }

    const scorePercentage = (task.score / task.maxScore) * 100;
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
          {task.name}
        </Text>
        <Text style={fonts.ecTextBody2} className={scoreColor}>
          {task.score}/{task.maxScore}
        </Text>
      </View>
    );
  };

  // Performance visualization with a circle progress
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
                  {trainee.name}
                </Text>
              </View>
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Email:
                </Text>
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-800 flex-1"
                >
                  {trainee.email}
                </Text>
              </View>
              <View className="flex-row">
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-600 w-24"
                >
                  Batch:
                </Text>
                <Text
                  style={fonts.ecTextBody2}
                  className="text-neutral-800 flex-1"
                >
                  {trainee.id.includes("1")
                    ? "Batch A - Spring 2025"
                    : trainee.id.includes("4") || trainee.id.includes("5")
                    ? "Batch B - Winter 2024"
                    : "Batch C - Fall 2024"}
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
                  {trainee.completedTasks}/{trainee.totalTasks} tasks completed
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
            <View className="mb-2">{trainee.tasks.map(renderTaskItem)}</View>

            {trainee.completedTasks < trainee.totalTasks && (
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
