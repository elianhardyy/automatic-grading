import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/auth";
import { useRoleCheck } from "../../hooks/useRoleCheck";
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

// Placeholder data (replace with actual data from your API/Redux)
const BATCHES = [
  { id: 1, name: "Batch 1 - Torvalds", trainees: 25, progress: 70 },
  { id: 2, name: "Batch 2 - Torvalds", trainees: 18, progress: 45 },
  { id: 3, name: "Batch 3 - Torvalds", trainees: 20, progress: 90 },
];

const TASKS = [
  {
    id: 1,
    name: "Ujian Frontend",
    category: "Coding",
    assessed: 10,
    total: 25,
    deadline: "2025-04-25",
  },
  {
    id: 2,
    name: "Project Review",
    category: "Project",
    assessed: 15,
    total: 25,
    deadline: "2025-04-20",
  },
  {
    id: 3,
    name: "Presentasi Final",
    category: "Soft Skills",
    assessed: 5,
    total: 18,
    deadline: "2025-04-30",
  },
];

const HomeScreen = () => {
  useRoleCheck("[ROLE_TRAINER]");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalBatches: 3,
    activeTrainees: 63,
    tasksGiven: 24,
    pendingAssessments: 38,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="light-content" backgroundColor="#233D90" />

      {/* Fixed Header Section */}
      <View className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row justify-between items-center px-4 pt-12 pb-4 bg-primary-500">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary-300 justify-center items-center mr-3">
              <Text
                className="text-white text-lg font-bold"
                style={fonts.ecTextBody1}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : "T"}
              </Text>
            </View>
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

        {/* Search Input */}
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

      {/* Scrollable Content with top padding to account for fixed header */}
      <ScrollView
        className="flex-1 bg-neutral-50"
        contentContainerStyle={{ paddingTop: 140 }} // Adjust this value based on your header height
      >
        {/* Statistics Section */}
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Dashboard
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {/* Stat Card 1 */}
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

            {/* Stat Card 2 */}
            <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
              <View className="w-10 h-10 rounded-lg bg-secondary-50 items-center justify-center mb-2">
                <FontAwesome5 name="user-graduate" size={16} color="#FF6B18" />
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

            {/* Stat Card 3 */}
            <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
              <View className="w-10 h-10 rounded-lg bg-tertiary-50 items-center justify-center mb-2">
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={20}
                  color="#B5AE02"
                />
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

            {/* Stat Card 4 */}
            <View className="bg-white w-[48%] rounded-xl p-4 mb-3 shadow-sm border border-neutral-200">
              <View className="w-10 h-10 rounded-lg bg-alert-50 items-center justify-center mb-2">
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={20}
                  color="#CB3A31"
                />
              </View>
              <Text
                className="text-neutral-500 text-sm"
                style={fonts.ecTextBody3}
              >
                Pending Reviews
              </Text>
              <Text
                className="text-neutral-800 text-xl font-bold"
                style={fonts.ecTextSubtitle2}
              >
                {stats.pendingAssessments}
              </Text>
            </View>
          </View>
        </View>

        {/* Active Batches Section - Using Card Component */}
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Active Batches
          </Text>
          {BATCHES.map((batch) => (
            <Card
              key={batch.id}
              title={batch.name}
              variant="primary"
              collapsible={false}
              className="mb-3"
            >
              <View className="flex-row items-center my-1">
                <FontAwesome5 name="users" size={12} color="#757575" />
                <Text
                  className="text-neutral-500 text-sm ml-2"
                  style={fonts.ecTextBody3}
                >
                  {batch.trainees} Trainees
                </Text>
              </View>

              {/* Progress Bar */}
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
                    {batch.progress}%
                  </Text>
                </View>
                <View className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <View
                    className={`h-full bg-success-500 rounded-full`}
                    style={{ width: `${batch.progress}%` }}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Recent Tasks Section */}
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Recent Tasks
          </Text>
          {TASKS.map((task) => {
            const daysLeft = getDaysRemaining(task.deadline);
            const isUrgent = daysLeft <= 3;

            return (
              <Card
                key={task.id}
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
                      {task.assessed}/{task.total} assessed
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
            );
          })}
        </View>

        {/* Quick Actions Section */}
        <View className="px-4 py-2">
          <Text
            className="text-neutral-800 text-lg font-bold mb-3"
            style={fonts.ecTextSubtitle1}
          >
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {/* Create Task Button */}
            <Button
              title="Create Task"
              variant="primary"
              className="w-[48%] mb-3 h-24 flex-col"
              icon={
                <MaterialCommunityIcons name="plus" size={24} color="white" />
              }
              iconPosition="top"
            />

            {/* View Assessments Button */}
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

            {/* View Trainees Button */}
            <Button
              title="View Trainees"
              variant="secondary"
              className="w-[48%] mb-3 h-24 flex-col"
              icon={<FontAwesome5 name="users" size={20} color="white" />}
              iconPosition="top"
            />

            {/* Manage Criteria Button */}
            <Button
              title="Manage Criteria"
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
            />
          </View>
        </View>

        {/* Notifications/Reminders Section - Using Alert Component */}
        {stats.pendingAssessments > 0 && (
          <View className="px-4 mb-8">
            <Alert
              title="Reminders"
              message={`You have ${stats.pendingAssessments} pending assessments to complete.`}
              variant="warning"
            />
          </View>
        )}

        {/* Upcoming Tasks Alert */}
        <View className="px-4 mb-20">
          <Alert
            title="Upcoming Deadline"
            message="Project Review task deadline is approaching in 3 days."
            variant="alert"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
