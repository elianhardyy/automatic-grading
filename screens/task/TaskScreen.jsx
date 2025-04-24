import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../../utils/font";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";

const TaskScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sortBy, setSortBy] = useState("deadline");

  // Mocked data
  const mockTasks = [
    {
      id: "1",
      name: "React Native Basics",
      category: "Frontend",
      batch: "Batch 12",
      deadline: "2025-04-20",
      totalTrainees: 25,
      assessedTrainees: 18,
      createdAt: "2025-04-10",
      status: "ongoing",
    },
    {
      id: "2",
      name: "API Integration",
      category: "Backend",
      batch: "Batch 12",
      deadline: "2025-04-25",
      totalTrainees: 25,
      assessedTrainees: 5,
      createdAt: "2025-04-12",
      status: "ongoing",
    },
    {
      id: "3",
      name: "Database Design",
      category: "Backend",
      batch: "Batch 11",
      deadline: "2025-04-15",
      totalTrainees: 22,
      assessedTrainees: 22,
      createdAt: "2025-04-05",
      status: "completed",
    },
    {
      id: "4",
      name: "UI/UX Principles",
      category: "Design",
      batch: "Batch 12",
      deadline: "2025-04-28",
      totalTrainees: 25,
      assessedTrainees: 0,
      createdAt: "2025-04-14",
      status: "not_started",
    },
    {
      id: "5",
      name: "Redux State Management",
      category: "Frontend",
      batch: "Batch 11",
      deadline: "2025-04-12",
      totalTrainees: 22,
      assessedTrainees: 20,
      createdAt: "2025-04-01",
      status: "ongoing",
    },
  ];

  // Sample data for dropdowns
  const batchOptions = [
    { label: "All Batches", value: null },
    { label: "Batch 11", value: "Batch 11" },
    { label: "Batch 12", value: "Batch 12" },
  ];

  const categoryOptions = [
    { label: "All Categories", value: null },
    { label: "Frontend", value: "Frontend" },
    { label: "Backend", value: "Backend" },
    { label: "Design", value: "Design" },
  ];

  const statusOptions = [
    { label: "All Status", value: null },
    { label: "Assessed", value: "assessed" },
    { label: "Not Assessed", value: "not_assessed" },
  ];

  const sortOptions = [
    { label: "Deadline (closest first)", value: "deadline" },
    { label: "Date Created (newest first)", value: "created" },
    { label: "Name (A-Z)", value: "name" },
  ];

  useEffect(() => {
    // Simulate API call to fetch tasks
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      const matchesSearch = task.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Tab filter
      const matchesTab =
        selectedTab === "all" ||
        (selectedTab === "pending" &&
          task.assessedTrainees < task.totalTrainees) ||
        (selectedTab === "completed" &&
          task.assessedTrainees === task.totalTrainees);

      // Additional filters
      const matchesBatch = !selectedBatch || task.batch === selectedBatch;
      const matchesCategory =
        !selectedCategory || task.category === selectedCategory;

      const isFullyAssessed = task.assessedTrainees === task.totalTrainees;
      const matchesStatus =
        !selectedStatus ||
        (selectedStatus === "assessed" && isFullyAssessed) ||
        (selectedStatus === "not_assessed" && !isFullyAssessed);

      return (
        matchesSearch &&
        matchesTab &&
        matchesBatch &&
        matchesCategory &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      // Sort functionality
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "deadline":
        default:
          return new Date(a.deadline) - new Date(b.deadline);
      }
    });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTaskStatusColor = (task) => {
    const ratio = task.assessedTrainees / task.totalTrainees;

    if (ratio === 0) return "#E1E1E1"; // Not started - Neutral
    if (ratio === 1) return "#43936C"; // Completed - Success

    // Check if task is past deadline
    const isOverdue = new Date(task.deadline) < new Date();
    if (isOverdue) return "#CB3A31"; // Overdue - Alert

    return "#233D90"; // In progress - Primary
  };

  const renderTaskItem = ({ item }) => {
    const progressPercentage =
      (item.assessedTrainees / item.totalTrainees) * 100;
    const statusColor = getTaskStatusColor(item);
    const isOverdue = new Date(item.deadline) < new Date();

    return (
      <Card
        title={item.name}
        variant="neutral"
        className="mb-3"
        collapsible={false}
        action={
          <View className="flex-row justify-between">
            <Button
              title="View Details"
              variant="primary"
              type="outlined"
              icon={
                <MaterialIcons name="visibility" size={16} color="#233D90" />
              }
              iconPosition="left"
            />
            <Button
              title="Assess"
              variant="primary"
              icon={
                <MaterialIcons name="assessment" size={16} color="#FFFFFF" />
              }
              iconPosition="left"
            />
          </View>
        }
      >
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Text
                style={fonts.ecTextSubtitle2}
                className="text-primary-500 mr-2"
              >
                {item.category}
              </Text>
              <View className="bg-neutral-100 px-2 py-1 rounded">
                <Text style={fonts.ecTextBody3} className="text-neutral-600">
                  {item.batch}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons
                name="event"
                size={16}
                color={isOverdue ? "#CB3A31" : "#757575"}
              />
              <Text
                style={fonts.ecTextBody2}
                className={`ml-1 ${
                  isOverdue ? "text-alert-500" : "text-neutral-500"
                }`}
              >
                {formatDate(item.deadline)}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View className="mb-1">
            <View className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: statusColor,
                }}
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text style={fonts.ecTextBody3} className="text-neutral-600">
              {item.assessedTrainees}/{item.totalTrainees} trainees assessed
            </Text>

            {isOverdue && (
              <View className="bg-alert-50 px-2 py-1 rounded">
                <Text style={fonts.ecTextBody3} className="text-alert-700">
                  Overdue
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-8">
      <MaterialIcons name="assignment" size={48} color="#C2C2C2" />
      <Text style={fonts.ecTextSubtitle1} className="text-neutral-500 mt-2">
        No tasks found
      </Text>
      <Text
        style={fonts.ecTextBody2}
        className="text-neutral-400 text-center mt-1 px-6"
      >
        Try adjusting your filters or create a new task to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar backgroundColor="#233D90" barStyle="light-content" />

      {/* Header */}
      <View className="bg-primary-500 p-4">
        <View className="flex-row justify-between items-center">
          <Text style={fonts.ecTextHeader2M} className="text-white">
            Tasks
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="add-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-3 flex-row items-center bg-white rounded-lg px-3 py-1">
          <MaterialIcons name="search" size={20} color="#757575" />
          <TextInput
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 p-2"
            placeholderTextColor="#9A9A9A"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="clear" size={20} color="#757575" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tab Filter */}
      <View className="flex-row p-2 bg-neutral-100">
        <TouchableOpacity
          className={`flex-1 py-2 items-center ${
            selectedTab === "all" ? "border-b-2 border-primary-500" : ""
          }`}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={fonts.ecTextBody2}
            className={
              selectedTab === "all" ? "text-primary-500" : "text-neutral-600"
            }
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2 items-center ${
            selectedTab === "pending" ? "border-b-2 border-primary-500" : ""
          }`}
          onPress={() => setSelectedTab("pending")}
        >
          <Text
            style={fonts.ecTextBody2}
            className={
              selectedTab === "pending"
                ? "text-primary-500"
                : "text-neutral-600"
            }
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2 items-center ${
            selectedTab === "completed" ? "border-b-2 border-primary-500" : ""
          }`}
          onPress={() => setSelectedTab("completed")}
        >
          <Text
            style={fonts.ecTextBody2}
            className={
              selectedTab === "completed"
                ? "text-primary-500"
                : "text-neutral-600"
            }
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Toggle Button */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-neutral-50 p-3 border-b border-neutral-200"
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      >
        <View className="flex-row items-center">
          <MaterialIcons name="filter-list" size={20} color="#233D90" />
          <Text style={fonts.ecTextBody2} className="text-primary-500 ml-1">
            Filters & Sort
          </Text>
        </View>
        <MaterialIcons
          name={isFilterVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#757575"
        />
      </TouchableOpacity>

      {/* Filter Panel */}
      {isFilterVisible && (
        <View className="bg-neutral-50 p-4 border-b border-neutral-200">
          <View className="flex-row justify-between mb-3">
            <View className="flex-1 mr-2">
              <Text style={fonts.ecTextBody3} className="text-neutral-600 mb-1">
                Batch
              </Text>
              <Select
                options={batchOptions}
                value={selectedBatch}
                onValueChange={setSelectedBatch}
                placeholder="Select Batch"
                variant="rounded"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text style={fonts.ecTextBody3} className="text-neutral-600 mb-1">
                Category
              </Text>
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Select Category"
                variant="rounded"
              />
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text style={fonts.ecTextBody3} className="text-neutral-600 mb-1">
                Status
              </Text>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                placeholder="Select Status"
                variant="rounded"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text style={fonts.ecTextBody3} className="text-neutral-600 mb-1">
                Sort By
              </Text>
              <Select
                options={sortOptions}
                value={sortBy}
                onValueChange={setSortBy}
                placeholder="Sort By"
                variant="rounded"
              />
            </View>
          </View>

          <View className="flex-row">
            <Button
              title="Reset Filters"
              variant="neutral"
              type="outlined"
              className="flex-1 mr-2"
              onPress={() => {
                setSelectedBatch(null);
                setSelectedCategory(null);
                setSelectedStatus(null);
                setSortBy("deadline");
              }}
            />
            <Button
              title="Apply Filters"
              variant="primary"
              className="flex-1 ml-2"
              onPress={() => setIsFilterVisible(false)}
            />
          </View>
        </View>
      )}

      {/* Task List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text style={fonts.ecTextBody1}>Loading tasks...</Text>
        </View>
      ) : error ? (
        <View className="p-4">
          <Alert
            variant="alert"
            title="Error"
            message="Failed to load tasks. Please try again later."
          />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-500 items-center justify-center elevation-5"
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TaskScreen;
