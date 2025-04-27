import { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
// Pastikan MaterialIcons diimpor dengan benar
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// --- Import Query ---
import { traineeTaskService } from "../../services/query/traineeTaskService";

// --- Import Utils ---
import { fonts } from "../../utils/font";

// --- Import Komponen Kustom Anda ---
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import InputGroup from "../../components/common/InputGroup"; // Pastikan InputGroup mendukung ikon

// --- Import Redux ---
import { useDispatch } from "react-redux";
import { setOngoing } from "../../services/slice/ongoing";
import GradingAssessmentTaskModal from "../../components/assessment/GradingAssessmentTaskModal";

const AssessmentTaskScreen = ({ route, navigation }) => {
  const { batchTaskId } = route.params;
  const [showForm, setShowForm] = useState(false);
  const [showTraineeTaskTypeSelection, setShowTraineeTaskTypeSelection] =
    useState(false);

  const [sortBy, setSortBy] = useState("submitTime");
  const [pageSize, setPageSize] = useState(10);
  const [gradeModal, setGradeModal] = useState(false);
  // const isFilterDataLoading = isCategoriesLoading || isBatchesLoading;
  const [selectedTraineeTask, setSelectedTraineeTask] = useState(null);
  const isOverallLoading = isTraineeTasksLoading;
  const isOverallError = isTraineeTasksError;
  const overallError = tasksError;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // pakai jam 24 jam
        timeZone: "Asia/Jakarta", // jika ingin pakai zona lokal Indonesia
      };

      return date.toLocaleString("en-US", options); // atau "id-ID" kalau mau gaya Indonesia
    } catch {
      return "Invalid Date";
    }
  };

  const queryFilter = useMemo(
    () => ({
      size: pageSize,
      sortBy: sortBy,
      direction:
        sortBy === "assignedDate" || sortBy === "dueDate" ? "desc" : "asc",
      //   batchId: selectedBatch || undefined,
      //   categoryId: selectedCategory || undefined,
    }),
    [pageSize, sortBy]
  );

  const handleGradeModal = (traineeTask) => {
    setSelectedTraineeTask(traineeTask);
    setGradeModal(true);
  };

  const closeGradeModal = () => {
    setGradeModal(false);
  };
  const {
    data: traineeTaskPages,
    error: tasksError,
    isError: isTraineeTasksError,
    fetchNextPage,
    hasNextPage,
    isLoading: isTraineeTasksLoading,
    isFetchingNextPage,
    refetch: reFetchAllTraineeTaskByBatchTaskId,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["traineeTask", queryFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const response =
        await traineeTaskService.fetchAllTraineeTaskByBatchTaskId(batchTaskId, {
          ...queryFilter,
          page: pageParam,
        });

      if (!response || typeof response !== "object")
        throw new Error("Invalid API response");
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.paging?.hasNext ? lastPage.paging.page + 1 : undefined,
    onError: (error) =>
      console.error(
        "Error fetching traineeTask query:",
        error?.message,
        error?.response?.data
      ),
  });
  const traineetaskpagess = traineeTaskPages?.data;
  console.log("ini trainee task page:", traineetaskpagess);
  // const transformedTasks = useMemo(
  //       () =>
  //         traineeTaskPages?.pages?.flatMap((page) =>
  //           Array.isArray(page?.data) ? page.data.map(transformTaskData) : []
  //         ) ?? [],
  //       [traineeTaskPages?.pages]
  //     );

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <MaterialIcons name="assignment-late" size={56} color="#D1D5DB" />
    </View>
  );

  const renderTraineeTaskItem = ({ item }) => {
    return (
      <Card
        title={item.traineeName}
        variant="neutral"
        className="mb-3"
        collapsible={false}
        action={
          <View style={styles.cardActionContainer}>
            {/* --- PERBAIKAN ICON BUTTON --- */}
            <Button
              title="View Details"
              color="primary"
              type="outlined"
              onPress={() =>
                navigation.navigate("DetailAssessmentTaskScreen", {
                  data: item,
                })
              }
              icon={
                <MaterialIcons name="visibility" size={16} color="#233D90" />
              } // Kembali ke visibility
              iconPosition="left"
              className="flex-1 mr-1"
            />
            <Button
              title="Grade"
              color="primary"
              type="base"
              onPress={() => handleGradeModal(item)}
              icon={<MaterialIcons name="grade" size={16} color="#FFFFFF" />} // Tetap assessment
              iconPosition="left"
              className="flex-1 ml-1"
              //   disabled={assessed === total && total > 0}
            />
            {/* ----------------------------- */}
          </View>
        }
      >
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardTopLeft}>
              {/* Badge Kategori */}
              {item.category && item.category !== "Uncategorized" && (
                <Badge
                  text={item.category}
                  color="primary"
                  size="small"
                  variant="outlined"
                  style={styles.categoryBadge}
                />
              )}

              {/* Info Batch */}
              {item.batch && item.batch !== "N/A" && (
                <View style={styles.batchContainer}>
                  <MaterialIcons
                    name="group"
                    size={14}
                    color="#616161"
                    style={styles.batchIcon}
                  />
                  <Text style={[fonts.ecTextCaption, styles.batchText]}>
                    {item.batch}
                  </Text>
                </View>
              )}
            </View>

            {/* Deadline */}
            <View style={styles.cardTopRight}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="event"
                  size={16}
                  color="#616161"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    fonts.ecTextBody3,
                    styles.deadlineText,
                    // isOverdue && progressPercentage < 100 && styles.overdueText,
                  ]}
                >
                  {item.batchTask.dueDate
                    ? formatDate(item.batchTask.dueDate)
                    : "No Deadline"}
                </Text>
              </View>
            </View>
          </View>

          {/* {total > 0 && (
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBarTrack}>
                            <View
                              style={[
                                styles.progressBarFill,
                                {
                                  width: `${progressPercentage}%`,
                                  backgroundColor: statusColor,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      )} */}

          <View style={styles.cardBottomRow}>
            {item.grade ? (
              <>
                <Badge
                  text={`Grade: ${item.grade}`}
                  color="success"
                  size="small"
                  variant="filled"
                />
                {item.submitTime <= item.dueDate ? (
                  <Badge
                    text="On Time"
                    color="success"
                    size="small"
                    variant="filled"
                  />
                ) : (
                  <Badge
                    text="Late"
                    color="warning"
                    size="small"
                    variant="filled"
                  />
                )}
              </>
            ) : (
              <Badge
                text="Not Graded Yet"
                color="alert"
                size="small"
                variant="filled"
              />
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderListFooter = () => {
    if (isFetchingNextPage) {
      return (
        <ActivityIndicator
          size="large"
          color="#233D90"
          style={styles.listFooterLoader}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#233D90" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={[fonts.ecTextHeader2M, styles.headerTitle]}>
            Trainees' TraineeTask
          </Text>
        </View>
      </View>

      {isOverallLoading && !isRefetching && !tasksPages?.pages?.length ? (
        renderSkeletonList()
      ) : isOverallError && !tasksPages?.pages?.length ? (
        <View style={styles.errorContainer}>
          <Alert
            variant="alert"
            title="Failed to Load TraineeTasks"
            message={
              overallError?.message ||
              "Could not fetch traineeTask. Please check connection and retry."
            }
            className="w-full mb-4"
          />
          <Button
            title="Retry"
            onPress={() => reFetchAllTraineeTaskByBatchTaskId()}
            color="primary"
            type="base"
          />
        </View>
      ) : (
        // <FlatList
        //     data={filteredTraineeTasks}
        //     renderItem={renderTraineeTaskItem}
        //     keyExtractor={(item) => item.id}
        //     contentContainerStyle={styles.listContentContainer}
        //     ListEmptyComponent={
        //         !isOverallLoading && !isRefetching ? renderEmptyList : null
        //     }
        //     onEndReached={() => {
        //         if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        //     }}
        //     onEndReachedThreshold={0.7}
        //     ListFooterComponent={renderListFooter}
        //     refreshing={isRefetching}
        //     onRefresh={reFetchAllTraineeTaskByBatchTaskId}
        //     showsVerticalScrollIndicator={false}
        // />
        <FlatList
          data={
            traineeTaskPages?.pages?.flatMap((page) =>
              Array.isArray(page?.data) ? page.data : []
            ) ?? []
          }
          renderItem={renderTraineeTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            !isOverallLoading && !isRefetching ? renderEmptyList : null
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.7}
          ListFooterComponent={renderListFooter}
          refreshing={isRefetching}
          onRefresh={reFetchAllTraineeTaskByBatchTaskId}
          showsVerticalScrollIndicator={false}
        />
      )}
      {gradeModal && (
        <GradingAssessmentTaskModal
          navigation={navigation}
          gradeModal={gradeModal}
          closeGradeModal={closeGradeModal}
          traineeTaskData={selectedTraineeTask}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" }, // neutral-50
  // Header
  headerContainer: {
    backgroundColor: "#233D90",
    padding: 16,
    paddingTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { color: "#FFFFFF" },
  headerAddButton: { padding: 4 },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  }, // neutral-200
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabItemActive: { backgroundColor: "#E0E7FF" }, // primary-50
  tabContent: { flexDirection: "row", alignItems: "center" },
  tabText: { color: "#4B5563" }, // neutral-600
  tabTextActive: { color: "#1D4ED8", fontWeight: "500" }, // primary-600
  tabBadge: { marginLeft: 6 },
  // Filter Toggle
  filterToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterToggleLeft: { flexDirection: "row", alignItems: "center" },
  filterToggleText: { color: "#1D4ED8", marginLeft: 6 }, // primary-600
  filterActiveIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    marginLeft: 8,
  }, // secondary-500
  // Filter Panel
  filterPanel: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterColumn: { flex: 1, marginHorizontal: 4 },
  filterLabel: { color: "#4B5563", marginBottom: 4 }, // neutral-600
  filterButtonContainer: { flexDirection: "row", marginTop: 8 },
  // Filter Skeletons
  filterSkeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterSkeletonColumn: { flex: 1, marginHorizontal: 4 },
  filterSkeletonLabel: {
    height: 14,
    width: "40%",
    marginBottom: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  filterButtonSkeletonContainer: { flexDirection: "row", marginTop: 8 },
  filterButtonSkeleton: {
    height: 44,
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  // Card Item
  cardActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardBody: { marginBottom: 4 },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTopLeft: { flexShrink: 1, marginRight: 8 },
  categoryBadge: { marginBottom: 4 },
  batchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  batchIcon: { marginRight: 4 },
  batchText: { color: "#4B5563" }, // neutral-600
  cardTopRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: "auto",
    paddingTop: 4,
  },
  deadlineText: { marginLeft: 4 },
  overdueText: { color: "#EF4444" }, // alert-500
  progressBarContainer: { marginVertical: 8 },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  }, // neutral-200
  progressBarFill: { height: "100%", borderRadius: 3 },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  progressText: { color: "#4B5563" }, // neutral-600
  // List
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
  },
  listFooterLoader: { marginVertical: 32 },
  // Empty List
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 32,
  }, // Added paddingBottom
  emptyListTitle: { color: "#4B5563", marginTop: 16, textAlign: "center" }, // neutral-600
  emptyListMessage: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  }, // neutral-500
  emptyListRefreshButton: { marginTop: 16 },
  // Error State
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  // Skeleton List
  skeletonListContainer: { paddingHorizontal: 16, paddingTop: 16 },
  // Skeleton Card Styles
  skeletonCardContainer: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#F3F4F6",
  }, // neutral-100
  skeletonTransition: {
    loop: true,
    type: "timing",
    duration: 800,
    easing: Easing.inOut(Easing.ease),
  },
  skeletonLineLong: {
    height: 22,
    width: "70%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 12,
  }, // neutral-200
  skeletonRowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skeletonLineMedium: {
    height: 16,
    width: "40%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  skeletonLineShort: {
    height: 16,
    width: "25%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  skeletonProgressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 8,
  },
  skeletonButton: {
    height: 44,
    width: "48%",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  skeletonFilter: {
    height: 48,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 8,
  },
  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B18",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default AssessmentTaskScreen;
