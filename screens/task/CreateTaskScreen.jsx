import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fonts } from "../../utils/font";
import CreateTaskForm from "../../components/tasks/CreateTaskForm";
import Select from "../../components/common/Select";
import { fetchAllBatchByMe } from "../../query/batch";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";

const CreateTaskScreen = ({ navigation }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTaskTypeSelection, setShowTaskTypeSelection] = useState(false);

  // Fetch batches when the screen loads
  const {
    data: batchData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: () =>
      fetchAllBatchByMe({
        page: 1,
        size: 100,
        sortBy: "name",
        direction: "asc",
      }),
    onError: (error) => {
      console.error("Error fetching batches:", error);
    },
  });

  const batchOptions = React.useMemo(() => {
    if (!batchData?.data) return [];

    return batchData.data.map((batch) => ({
      label: batch.name,
      value: batch.id,
    }));
  }, [batchData?.data]);

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
  };

  const handleContinue = () => {
    if (selectedBatch) {
      setShowTaskTypeSelection(true);
    }
  };

  const handleNewTask = () => {
    setShowForm(true);
    setShowTaskTypeSelection(false);
  };

  const handleExistingTask = () => {
    navigation.navigate("ExistingTaskScreen", {
      batchId: selectedBatch,
      batchName: batchData.data.find((b) => b.id === selectedBatch)?.name,
    });
  };

  const goBackToSelection = () => {
    setShowTaskTypeSelection(false);
  };

  const goBackToBatchSelection = () => {
    setShowForm(false);
    setShowTaskTypeSelection(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="light-content" backgroundColor="#233D90" />

      <View className="bg-primary-500 p-4 flex-row items-center">
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="#FFFFFF"
          onPress={() => {
            if (showForm) {
              goBackToBatchSelection();
            } else if (showTaskTypeSelection) {
              goBackToSelection();
            } else {
              navigation.goBack();
            }
          }}
        />
        <View className="flex-1 items-center">
          <Text style={fonts.ecTextSubtitle1M} className="text-white">
            Create New Task
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {!showForm && !showTaskTypeSelection ? (
        // Batch selection screen
        <View className="p-4">
          <Text style={fonts.ecTextHeader2M} className="text-neutral-800 mb-6">
            Select Batch
          </Text>

          <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-2">
            Select a batch to create a task for{" "}
            <Text className="text-alert-500">*</Text>
          </Text>

          {isLoading ? (
            <View className="flex-row items-center justify-center p-3">
              <ActivityIndicator size="small" color="#233D90" />
              <Text className="ml-2 text-neutral-600">Loading batches...</Text>
            </View>
          ) : isError ? (
            <Alert
              variant="alert"
              title="Error"
              message={
                error?.message || "Failed to load batches. Please try again."
              }
              className="mb-4"
            />
          ) : (
            <>
              <Select
                variant="rounded"
                options={batchOptions}
                value={selectedBatch}
                onValueChange={handleBatchSelect}
                placeholder="Select a batch"
              />

              <View className="mt-4">
                <Button
                  title="Continue"
                  variant="primary"
                  onPress={handleContinue}
                  disabled={!selectedBatch}
                  icon={
                    <MaterialIcons
                      name="arrow-forward"
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                  iconPosition="right"
                />
              </View>
            </>
          )}
        </View>
      ) : showTaskTypeSelection ? (
        // Task type selection screen
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={goBackToSelection} className="p-1 mr-2">
              <MaterialIcons name="arrow-back" size={20} color="#233D90" />
            </TouchableOpacity>
            <Text style={fonts.ecTextBody2} className="text-primary-500">
              Back to Batch Selection
            </Text>
          </View>

          <Text style={fonts.ecTextHeader2M} className="text-neutral-800 mb-6">
            Select Task Type
          </Text>

          {/* Selected batch info */}
          {batchData && selectedBatch && (
            <View className="bg-primary-50 p-3 rounded-lg mb-4 flex-row items-center">
              <MaterialIcons name="group" size={20} color="#233D90" />
              <Text style={fonts.ecTextBody2} className="text-primary-700 ml-2">
                Selected batch:{" "}
                {batchData.data.find((b) => b.id === selectedBatch)?.name}
              </Text>
            </View>
          )}

          <View className="space-y-4">
            <TouchableOpacity
              onPress={handleNewTask}
              className="bg-white p-4 rounded-lg border border-neutral-200 flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <View className="bg-primary-100 p-2 rounded-full mr-3">
                  <MaterialIcons name="add-task" size={24} color="#233D90" />
                </View>
                <View>
                  <Text style={fonts.ecTextBody1} className="text-neutral-800">
                    Create New Task
                  </Text>
                  <Text style={fonts.ecTextBody3} className="text-neutral-500">
                    Create a new task from scratch
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExistingTask}
              className="bg-white p-4 rounded-lg border border-neutral-200 flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <View className="bg-primary-100 p-2 rounded-full mr-3">
                  <MaterialIcons
                    name="content-copy"
                    size={24}
                    color="#233D90"
                  />
                </View>
                <View>
                  <Text style={fonts.ecTextBody1} className="text-neutral-800">
                    Use Existing Task
                  </Text>
                  <Text style={fonts.ecTextBody3} className="text-neutral-500">
                    Copy from an existing task template
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Task creation form
        <CreateTaskForm
          navigation={navigation}
          batchId={selectedBatch}
          goBack={goBackToBatchSelection}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateTaskScreen;
