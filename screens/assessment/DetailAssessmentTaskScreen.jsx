import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setOngoing } from "../../services/slice/ongoing";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";
import EditGradingAssessmentTaskModal from "../../components/assessment/EditGradingAssessmentTaskModal";

const DetailAssessmentTaskScreen = ({ route, navigation }) => {
  const { data: traineeTaskData } = route.params;
  const dispatch = useDispatch();
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [taskData, setTaskData] = useState(traineeTaskData);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { grading } = useSelector((state) => state.grading);
  useEffect(() => {
    dispatch(setOngoing("DetailAssessment"));
  }, [grading]);

  const toggleNotesDisplay = () => {
    setShowFullNotes(!showFullNotes);
  };

  const handleEditSuccess = () => {
    navigation.setParams({ data: { ...taskData } });
  };

  const renderNotes = (notes) => {
    if (!notes) return "No notes";

    const MAX_LENGTH = 100;
    const isLongNotes = notes.length > MAX_LENGTH;

    if (!isLongNotes) return notes;

    if (showFullNotes) {
      return (
        <View>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              color: "#333",
            }}
          >
            {notes}
          </Text>
          <TouchableOpacity onPress={toggleNotesDisplay}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: "#1D4ED8",
                marginTop: 4,
              }}
            >
              Read Less
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              color: "#333",
            }}
          >
            {`${notes.substring(0, MAX_LENGTH)}...`}
          </Text>
          <TouchableOpacity onPress={toggleNotesDisplay}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: "#1D4ED8",
                marginTop: 4,
              }}
            >
              Read More
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (!taskData) {
    return (
      <View style={styles.errorContainer}>
        <Alert type="error" message="Data tidak ditemukan" />
        <Button onPress={() => navigation.goBack()} title="Kembali" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#233D90" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ flex: 1, backgroundColor: "#FFF" }}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, fonts.ecTextHeader2M]}>
              Detail Assessment
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: "#F0F4FF",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#D0DCFF",
            }}
          >
            <MaterialIcons name="person" size={20} color="#233D90" />
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 16,
                color: "#233D90",
                marginTop: 8,
              }}
            >
              {taskData.traineeName}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: "#555",
                marginTop: 4,
              }}
            >
              Batch: {taskData.batchTask.batchName}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: "#555",
                marginTop: 4,
              }}
            >
              Task: {taskData.batchTask.taskName}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: "#555",
                marginTop: 4,
              }}
            >
              Due Date: {new Date(taskData.batchTask.dueDate).toLocaleString()}
            </Text>
          </View>

          <Card
            title="Task Assessment"
            variant="info"
            icon={<MaterialIcons name="check" size={20} color="#336196" />}
            collapsible={false}
          >
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: "#333",
                lineHeight: 22,
              }}
            >
              Score: {taskData?.grade || grading?.grade || "-"}
            </Text>

            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: "#333",
                }}
              >
                Notes: {renderNotes(taskData.notes)}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: "#333",
                marginTop: 8,
              }}
            >
              Submitted URL:
              {taskData.submittedUrl ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("WebViewScreen", {
                      url: taskData.submittedUrl,
                    });
                  }}
                >
                  <Text style={{ color: "#1D4ED8" }}> View Submission</Text>
                </TouchableOpacity>
              ) : (
                " -"
              )}
            </Text>

            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: "#333",
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              Submitted Time:{" "}
              {taskData.submitTime
                ? new Date(taskData.submitTime).toLocaleString()
                : "-"}
            </Text>

            <Button
              title="Edit Assessment"
              variant="info"
              icon={<MaterialIcons name="edit" size={16} color="#FFFFFF" />}
              iconPosition="left"
              onPress={() => setIsEditModalVisible(true)}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Edit Assessment Modal */}
      <EditGradingAssessmentTaskModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        traineeTaskData={taskData}
        onSuccess={handleEditSuccess}
      />
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
  // Card Item
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTopLeft: { flexShrink: 1, marginRight: 8 },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  // Empty List
  emptyListContainer: {
    flex: 1,
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
  // Error State
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});

export default DetailAssessmentTaskScreen;
