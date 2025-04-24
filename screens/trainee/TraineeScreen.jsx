import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fonts } from "../../utils/font";
import TraineeDetailScreen from "./TraineeDetailScreen";

const TraineeScreen = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  // Mock batch data
  const batchOptions = [
    { label: "Batch A - Spring 2025", value: "batch-a" },
    { label: "Batch B - Winter 2024", value: "batch-b" },
    { label: "Batch C - Fall 2024", value: "batch-c" },
  ];

  // Mock trainee data
  const mockTrainees = {
    "batch-a": [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex.j@example.com",
        completedTasks: 8,
        totalTasks: 10,
        tasks: [
          { name: "Task 1", score: 85, maxScore: 100 },
          { name: "Task 2", score: 92, maxScore: 100 },
          { name: "Task 3", score: 78, maxScore: 100 },
          { name: "Task 4", score: 88, maxScore: 100 },
          { name: "Task 5", score: 95, maxScore: 100 },
          { name: "Task 6", score: 81, maxScore: 100 },
          { name: "Task 7", score: 90, maxScore: 100 },
          { name: "Task 8", score: 76, maxScore: 100 },
          { name: "Task 9", pending: true },
          { name: "Task 10", pending: true },
        ],
      },
      {
        id: "2",
        name: "Sarah Miller",
        email: "sarah.m@example.com",
        completedTasks: 6,
        totalTasks: 10,
        tasks: [
          { name: "Task 1", score: 88, maxScore: 100 },
          { name: "Task 2", score: 76, maxScore: 100 },
          { name: "Task 3", score: 92, maxScore: 100 },
          { name: "Task 4", score: 85, maxScore: 100 },
          { name: "Task 5", score: 79, maxScore: 100 },
          { name: "Task 6", score: 93, maxScore: 100 },
          { name: "Task 7", pending: true },
          { name: "Task 8", pending: true },
          { name: "Task 9", pending: true },
          { name: "Task 10", pending: true },
        ],
      },
      {
        id: "3",
        name: "Michael Lee",
        email: "michael.l@example.com",
        completedTasks: 10,
        totalTasks: 10,
        tasks: [
          { name: "Task 1", score: 95, maxScore: 100 },
          { name: "Task 2", score: 98, maxScore: 100 },
          { name: "Task 3", score: 92, maxScore: 100 },
          { name: "Task 4", score: 87, maxScore: 100 },
          { name: "Task 5", score: 91, maxScore: 100 },
          { name: "Task 6", score: 94, maxScore: 100 },
          { name: "Task 7", score: 89, maxScore: 100 },
          { name: "Task 8", score: 93, maxScore: 100 },
          { name: "Task 9", score: 96, maxScore: 100 },
          { name: "Task 10", score: 90, maxScore: 100 },
        ],
      },
    ],
    "batch-b": [
      {
        id: "4",
        name: "Jessica Wang",
        email: "jessica.w@example.com",
        completedTasks: 4,
        totalTasks: 8,
        tasks: [
          { name: "Task 1", score: 82, maxScore: 100 },
          { name: "Task 2", score: 78, maxScore: 100 },
          { name: "Task 3", score: 85, maxScore: 100 },
          { name: "Task 4", score: 90, maxScore: 100 },
          { name: "Task 5", pending: true },
          { name: "Task 6", pending: true },
          { name: "Task 7", pending: true },
          { name: "Task 8", pending: true },
        ],
      },
      {
        id: "5",
        name: "David Smith",
        email: "david.s@example.com",
        completedTasks: 7,
        totalTasks: 8,
        tasks: [
          { name: "Task 1", score: 88, maxScore: 100 },
          { name: "Task 2", score: 92, maxScore: 100 },
          { name: "Task 3", score: 79, maxScore: 100 },
          { name: "Task 4", score: 85, maxScore: 100 },
          { name: "Task 5", score: 94, maxScore: 100 },
          { name: "Task 6", score: 87, maxScore: 100 },
          { name: "Task 7", score: 91, maxScore: 100 },
          { name: "Task 8", pending: true },
        ],
      },
    ],
    "batch-c": [
      {
        id: "6",
        name: "Robert Chen",
        email: "robert.c@example.com",
        completedTasks: 3,
        totalTasks: 5,
        tasks: [
          { name: "Task 1", score: 84, maxScore: 100 },
          { name: "Task 2", score: 76, maxScore: 100 },
          { name: "Task 3", score: 91, maxScore: 100 },
          { name: "Task 4", pending: true },
          { name: "Task 5", pending: true },
        ],
      },
      {
        id: "7",
        name: "Emma Davis",
        email: "emma.d@example.com",
        completedTasks: 5,
        totalTasks: 5,
        tasks: [
          { name: "Task 1", score: 95, maxScore: 100 },
          { name: "Task 2", score: 89, maxScore: 100 },
          { name: "Task 3", score: 92, maxScore: 100 },
          { name: "Task 4", score: 88, maxScore: 100 },
          { name: "Task 5", score: 94, maxScore: 100 },
        ],
      },
    ],
  };

  useEffect(() => {
    if (selectedBatch) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTrainees(mockTrainees[selectedBatch] || []);
        setLoading(false);
      }, 500);
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (trainees.length > 0) {
      const filtered = trainees.filter((trainee) =>
        trainee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrainees(filtered);
    }
  }, [searchQuery, trainees]);

  const handleBatchChange = (value) => {
    setSelectedBatch(value);
    setSearchQuery("");
  };

  const handleTraineePress = (trainee) => {
    setSelectedTrainee(trainee);
  };

  const handleBackPress = () => {
    setSelectedTrainee(null);
  };

  const renderProgressBar = (completed, total) => {
    const percentage = (completed / total) * 100;
    const statusColor =
      percentage < 50 ? "warning" : percentage < 100 ? "info" : "success";

    return (
      <View className="mt-2">
        <View className="flex-row justify-between mb-1">
          <Text style={fonts.ecTextBody3} className="text-neutral-600">
            Assessment Status: {completed}/{total} tasks
          </Text>
          <Text style={fonts.ecTextBody3} className="text-neutral-600">
            {Math.round(percentage)}%
          </Text>
        </View>
        <View className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <View
            className={`h-full bg-${statusColor}-500`}
            style={{ width: `${percentage}%` }}
          />
        </View>
      </View>
    );
  };

  const renderTraineeItem = ({ item }) => (
    <Card
      title={item.name}
      variant="primary"
      className="mb-3"
      collapsible={false}
      action={
        <Button
          title="View Details"
          variant="primary"
          onPress={() => handleTraineePress(item)}
          className="mt-2"
        />
      }
    >
      {renderProgressBar(item.completedTasks, item.totalTasks)}
    </Card>
  );

  if (selectedTrainee) {
    return (
      <TraineeDetailScreen trainee={selectedTrainee} onBack={handleBackPress} />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 p-4">
        <Text style={fonts.ecTextHeader2} className="text-neutral-800 mb-6">
          Trainee Management
        </Text>

        <View className="mb-4">
          <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-1">
            Select Batch
          </Text>
          <Select
            placeholder="Select Batch"
            options={batchOptions}
            value={selectedBatch}
            onValueChange={handleBatchChange}
            variant="rounded"
          />
        </View>

        {selectedBatch && (
          <View className="mb-4">
            <Input
              placeholder="Search trainees..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              variant="rounded"
              prefixIcon="search"
            />
          </View>
        )}

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#233D90" />
          </View>
        ) : selectedBatch ? (
          filteredTrainees.length > 0 ? (
            <FlatList
              data={filteredTrainees}
              renderItem={renderTraineeItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <MaterialIcons name="person-search" size={64} color="#C2C2C2" />
              <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-4">
                No trainees found
              </Text>
            </View>
          )
        ) : (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="group" size={64} color="#C2C2C2" />
            <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-4">
              Select a batch to view trainees
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TraineeScreen;
