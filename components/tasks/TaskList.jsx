import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

import { fonts } from "../../utils/font";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

const SkeletonCard = () => (
  <MotiView
    style={styles.skeletonCardContainer}
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{
      type: "timing",
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      loop: true,
      repeatReverse: true,
    }}
  >
    <MotiView
      style={styles.skeletonLineLong}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={styles.skeletonTransition}
    />
    <View style={styles.skeletonRowSpaceBetween}>
      <MotiView
        style={styles.skeletonLineMedium}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
      <MotiView
        style={styles.skeletonLineShort}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
    </View>
    <MotiView
      style={styles.skeletonProgressBar}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={styles.skeletonTransition}
    />
    <MotiView
      style={styles.skeletonLineMedium}
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={styles.skeletonTransition}
    />
    <View style={[styles.skeletonRowSpaceBetween, { marginTop: 12 }]}>
      <MotiView
        style={styles.skeletonButton}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
      <MotiView
        style={styles.skeletonButton}
        from={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={styles.skeletonTransition}
      />
    </View>
  </MotiView>
);

const TaskList = ({
  tasks,
  isLoading,
  isRefetching,
  isFetchingNextPage,
  hasNextPage,
  onEndReached,
  onRefresh,
  onItemPress,
  onAssessPress,
  onAddTaskPress,
  onResetFiltersPress,
  searchQuery,
  filtersApplied,
  isError,
}) => {
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString(undefined, options);
    } catch {
      return "Invalid Date";
    }
  };

  const getTaskStatusColor = (task) => {
    const total = task.ungradedCount ?? 0;
    const assessed = task.gradedCount ?? 0;
    const ratio = total > 0 ? assessed / total : 0;
    let isOverdue = false;
    try {
      isOverdue = new Date(task.deadline) < new Date();
      if (isNaN(new Date(task.deadline).getTime())) isOverdue = false;
    } catch {
      isOverdue = false;
    }
    if (ratio === 1 && total > 0) return "#43936C";
    if (isOverdue) return "#CB3A31";
    if (ratio === 0) return "#E1E1E1";
    return "#233D90";
  };

  const renderTaskItem = ({ item }) => {
    console.log("ini raded count: ", item.ungradedCount);
    const total = item.ungradedCount ?? 0;
    const assessed = item.gradedCount ?? 0;
    const progressPercentage = total > 0 ? (assessed / total) * 100 : 0;
    const statusColor = getTaskStatusColor(item);
    let isOverdue = false;
    try {
      isOverdue = new Date(item.deadline) < new Date();
      if (isNaN(new Date(item.deadline).getTime())) isOverdue = false;
    } catch {
      isOverdue = false;
    }

    return (
      <Card
        title={item.name}
        variant="neutral"
        className="mb-3"
        collapsible={false}
        action={
          <View style={styles.cardActionContainer}>
            <Button
              title="View Details"
              color="primary"
              type="outlined"
              onPress={() => onItemPress(item.id)}
              icon={
                <MaterialIcons name="visibility" size={16} color="#233D90" />
              }
              iconPosition="left"
              className="flex-1 mr-1"
            />
            <Button
              title="Assess"
              color="primary"
              type="base"
              onPress={() =>
                onAssessPress(item.id, item.batchId, item, item.batchTaskId)
              }
              icon={
                <MaterialIcons name="assessment" size={16} color="#FFFFFF" />
              }
              iconPosition="left"
              className="flex-1 ml-1"
              disabled={assessed === total && total > 0}
            />
          </View>
        }
      >
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardTopLeft}>
              {item.category && item.category !== "Uncategorized" && (
                <Badge
                  text={item.category}
                  color="primary"
                  size="small"
                  variant="outlined"
                  style={styles.categoryBadge}
                />
              )}
              {item.batch && item.batch !== "N/A" && (
                <View style={styles.batchContainer}>
                  <MaterialIcons
                    name="group"
                    size={12}
                    color="#757575"
                    style={styles.batchIcon}
                  />
                  <Text style={[fonts.ecTextCaption, styles.batchText]}>
                    {item.batch}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.cardTopRight}>
              <MaterialIcons
                name="event"
                size={16}
                color={
                  isOverdue && progressPercentage < 100 ? "#CB3A31" : "#757575"
                }
              />
              <Text
                style={[
                  fonts.ecTextBody3,
                  styles.deadlineText,
                  isOverdue && progressPercentage < 100 && styles.overdueText,
                ]}
              >
                {formatDate(item.deadline)}
              </Text>
            </View>
          </View>
          {/* 
          {total > 0 && (
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
            {/* <Text
              style={[fonts.ecTextCaption, styles.progressText]}
            >{`${assessed}/${total} assessed`}</Text>
            {isOverdue && progressPercentage < 100 && (
              <Badge
                text="Overdue"
                color="alert"
                size="small"
                variant="filled"
              /> */}
            {/* )} */}
            {progressPercentage === 100 && total > 0 && (
              <Badge
                text="Completed"
                color="success"
                size="small"
                variant="filled"
              />
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <MaterialIcons name="assignment-late" size={56} color="#D1D5DB" />
      <Text style={[fonts.ecTextSubtitle1, styles.emptyListTitle]}>
        No Tasks Found
      </Text>
      <Text style={[fonts.ecTextBody2, styles.emptyListMessage]}>
        {!searchQuery && !filtersApplied
          ? "There are no tasks matching your current view. Try creating one!"
          : "No tasks match your current search or filter criteria. Try adjusting them."}
      </Text>
      {!searchQuery && !filtersApplied && !isLoading && (
        <Button
          title="Create New Task"
          onPress={onAddTaskPress}
          color="primary"
          type="base"
        />
      )}
      {(searchQuery || filtersApplied) && !isLoading && (
        <Button
          title="Reset Filters"
          onPress={onResetFiltersPress}
          color="neutral"
          type="outlined"
        />
      )}
      {isError && !isLoading && !isRefetching && (
        <Button
          title="Try Refresh"
          onPress={onRefresh}
          color="primary"
          type="outlined"
          style={styles.emptyListRefreshButton}
        />
      )}
    </View>
  );

  const renderSkeletonList = () => (
    <View style={styles.skeletonListContainer}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </View>
  );

  const renderListFooter = () =>
    isFetchingNextPage ? (
      <ActivityIndicator
        size="large"
        color="#233D90"
        style={styles.listFooterLoader}
      />
    ) : null;

  if (isLoading && !isRefetching) {
    return renderSkeletonList();
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContentContainer}
      ListEmptyComponent={!isLoading && !isRefetching ? renderEmptyList : null}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) onEndReached();
      }}
      onEndReachedThreshold={0.7}
      ListFooterComponent={renderListFooter}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
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
  batchText: { color: "#4B5563" },
  cardTopRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: "auto",
    paddingTop: 4,
  },
  deadlineText: { marginLeft: 4 },
  overdueText: { color: "#EF4444" },
  progressBarContainer: { marginVertical: 8 },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  progressText: { color: "#4B5563" },

  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
  },
  listFooterLoader: { marginVertical: 32 },

  emptyListContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  emptyListTitle: { color: "#4B5563", marginTop: 16, textAlign: "center" },
  emptyListMessage: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  emptyListRefreshButton: { marginTop: 16 },

  skeletonListContainer: { paddingHorizontal: 16, paddingTop: 16 },
  skeletonCardContainer: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
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
  },
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
});

export default TaskList;
