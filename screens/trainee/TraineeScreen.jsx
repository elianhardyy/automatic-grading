import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fonts } from "../../utils/font";
import TraineeDetailScreen from "./TraineeDetailScreen";
import { batchService } from "../../services/query/batchService";
import { traineeService } from "../../services/query/traineeService";
import { SafeAreaView } from "react-native-safe-area-context";

const TraineeScreen = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const {
    data: batchesData,
    isLoading: batchesLoading,
    error: batchesError,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: () =>
      batchService.fetchAllBatchByMe({
        page: 1,
        size: 10,
        sortBy: "name",
        direction: "asc",
      }),
  });

  const {
    data: traineesData,
    isLoading: traineesLoading,
    error: traineesError,
  } = useQuery({
    queryKey: ["trainees", selectedBatch],
    queryFn: () =>
      traineeService.fetchAllTrainees({
        page: 1,
        size: 10,
        sortBy: "name",
        direction: "asc",
      }),
    enabled: !!selectedBatch,
  });

  const batchOptions =
    batchesData?.data?.map((batch) => ({
      label: `Batch ${batch.batchNumber} (${batch.city}) - ${batch.name}`,
      value: batch.id,
    })) || [];

  useEffect(() => {
    if (traineesData?.data && selectedBatch) {
      const batchTrainees = traineesData.data.filter(
        (trainee) => trainee.batchId === selectedBatch
      );

      const filtered = batchTrainees.filter((trainee) =>
        trainee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredTrainees(filtered);
    }
  }, [searchQuery, traineesData, selectedBatch]);

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

  const renderProgressBar = (trainee) => {
    const completedTasks =
      trainee.traineeTasks?.filter((task) => task.score !== null)?.length || 0;
    const totalTasks = trainee.traineeTasks?.length || 0;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const statusColor =
      percentage < 50 ? "warning" : percentage < 100 ? "info" : "success";

    // return (
    // <View className="mt-2">
    {
      /* <View className="flex-row justify-between mb-1">
          <Text style={fonts.ecTextBody3} className="text-neutral-600">
            Assessment Status: {completedTasks}/{totalTasks} tasks
          </Text>
          <Text style={fonts.ecTextBody3} className="text-neutral-600">
            {Math.round(percentage)}%
          </Text>
        </View> */
    }
    {
      /* <View className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <View
            className={`h-full bg-${statusColor}-500`}
            style={{ width: `${percentage}%` }}
          />
        </View> */
    }
    {
      /* </View> */
    }
    // );
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
      {renderProgressBar(item)}
    </Card>
  );

  if (selectedTrainee) {
    return (
      <TraineeDetailScreen trainee={selectedTrainee} onBack={handleBackPress} />
    );
  }

  const renderContent = () => {
    if (traineesLoading && selectedBatch) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#233D90" />
        </View>
      );
    } else if (selectedBatch) {
      if (traineesError) {
        return (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="error" size={64} color="#C2C2C2" />
            <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-4">
              Error loading trainees. Please try again.
            </Text>
          </View>
        );
      } else if (filteredTrainees.length > 0) {
        return (
          <FlatList
            data={filteredTrainees}
            renderItem={renderTraineeItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Disable FlatList scrolling
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        );
      } else {
        return (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="person-search" size={64} color="#C2C2C2" />
            <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-4">
              No trainees found
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="group" size={64} color="#C2C2C2" />
          <Text style={fonts.ecTextBody1} className="text-neutral-500 mt-4">
            Select a batch to view trainees
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Fixed Header */}
      <View className="bg-primary-500 p-6 z-10">
        <Text style={[fonts.ecTextHeader2M]} className="text-white">
          Trainee Management
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-4">
          <View className="mb-4">
            <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-1">
              Select Batch
            </Text>
            {batchesLoading ? (
              <ActivityIndicator size="small" color="#233D90" />
            ) : batchesError ? (
              <Text style={fonts.ecTextBody3} className="text-alert-500">
                Error loading batches. Please try again.
              </Text>
            ) : (
              <Select
                placeholder="Select Batch"
                options={batchOptions}
                value={selectedBatch}
                onValueChange={handleBatchChange}
                variant="rounded"
              />
            )}
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

          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TraineeScreen;
