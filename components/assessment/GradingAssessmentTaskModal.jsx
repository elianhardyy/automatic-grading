import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Import komponen custom
import Button from "../common/Button";
import InputGroup from "../common/InputGroup";
import Alert from "../common/Alert";

// Import fonts dan utils
import { fonts } from "../../utils/font";
import { traineeService } from "../../services/query/traineeService";
import { gradingService } from "../../services/query/gradingService";

// Function to format current date and time to yyyy-MM-dd HH:mm:ss
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const GradingAssessmentTaskModal = ({
  navigation,
  gradeModal,
  closeGradeModal,
  traineeTaskData, // Data tugas trainee yang akan dinilai
}) => {
  //console.log("ini modal untuk grading: ", traineeTaskData);
  const [error, setError] = useState("");
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [touched, setTouched] = useState(false);

  const queryClient = useQueryClient();

  // Fetch trainee details
  const { data: traineeDetail } = useQuery({
    queryKey: ["trainee"],
    queryFn: () => traineeService.fetchTraineeById(traineeTaskData.traineeId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: gradingService.updategradingTrainee,
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["traineeTask"] });
      setTimeout(() => {
        navigation.navigate("GradingResultScreen", {
          gradingData: response.data,
        });

        // Close the modal
        handleClose();
      }, 5000);
    },
    onError: (error) => {
      setError(error.message || "Failed to update grade. Please try again.");
    },
  });

  // Validate Git repo URL in real-time
  useEffect(() => {
    if (touched) {
      validateGitRepoUrl(gitRepoUrl);
    }
  }, [gitRepoUrl, touched]);

  const validateGitRepoUrl = (url) => {
    if (!url.trim()) {
      setUrlError("Git repository URL is required");
      return false;
    }

    // const gitRepoRegex =
    //   /^(https?:\/\/)?(www\.)?github\.com\/|gitlab\.com\/|bitbucket\.org\/.+$/i;
    // if (!gitRepoRegex.test(url)) {
    //   setUrlError("Please enter a valid Git repository URL");
    //   return false;
    // }

    setUrlError("");
    return true;
  };

  const handleSubmit = () => {
    setTouched(true);

    // Validate gitRepoUrl
    if (!validateGitRepoUrl(gitRepoUrl)) {
      return;
    }

    // Get traineeTaskId from traineeDetail
    const traineeTaskId = traineeDetail?.data?.traineeTasks?.[0]?.id;
    if (!traineeTaskId) {
      setError("Could not find trainee task ID. Please try again.");
      return;
    }

    const submitDate = getCurrentDateTime();

    mutate({
      traineeTaskId: traineeTaskId,
      gitRepoUrl: gitRepoUrl,
      submitDate: submitDate,
    });
  };

  const handleClose = () => {
    setError("");
    setGitRepoUrl("");
    setUrlError("");
    setTouched(false);
    closeGradeModal();
  };

  return (
    <Modal
      transparent={true}
      visible={gradeModal}
      onRequestClose={handleClose}
      animationType="slide"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[fonts.ecTextBody3M, styles.modalTitle]}>
                Grade Assessment Task
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {error ? (
              <Alert
                variant="alert"
                title="Error"
                message={error}
                className="mb-4"
              />
            ) : null}

            <ScrollView style={styles.modalContent}>
              <View style={styles.infoSection}>
                <Text style={[fonts.ecTextBody2, styles.infoLabel]}>
                  Trainee:
                </Text>
                <Text style={[fonts.ecTextBody1M, styles.infoValue]}>
                  {traineeTaskData?.traineeName || "N/A"}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={[fonts.ecTextBody2, styles.infoLabel]}>Task:</Text>
                <Text style={[fonts.ecTextBody1M, styles.infoValue]}>
                  {traineeTaskData?.batchTask?.taskName || "N/A"}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={[fonts.ecTextBody2, styles.infoLabel]}>
                  Submission Time:
                </Text>
                <Text style={[fonts.ecTextBody1M, styles.infoValue]}>
                  {traineeTaskData?.submitTime
                    ? new Date(traineeTaskData.submitTime).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Jakarta",
                        }
                      )
                    : "Not submitted yet"}
                </Text>
              </View>

              {traineeTaskData?.submitTime && traineeTaskData?.dueDate && (
                <View style={styles.statusBadge}>
                  <MaterialIcons
                    name={
                      new Date(traineeTaskData.submitTime) <=
                      new Date(traineeTaskData.dueDate)
                        ? "check-circle"
                        : "error"
                    }
                    size={16}
                    color={
                      new Date(traineeTaskData.submitTime) <=
                      new Date(traineeTaskData.dueDate)
                        ? "#10B981"
                        : "#F59E0B"
                    }
                  />
                  <Text
                    style={[
                      fonts.ecTextBody3,
                      {
                        color:
                          new Date(traineeTaskData.submitTime) <=
                          new Date(traineeTaskData.dueDate)
                            ? "#10B981"
                            : "#F59E0B",
                      },
                    ]}
                  >
                    {new Date(traineeTaskData.submitTime) <=
                    new Date(traineeTaskData.dueDate)
                      ? "Submitted on time"
                      : "Submitted late"}
                  </Text>
                </View>
              )}

              <View style={styles.inputSection}>
                <InputGroup
                  label="Git Repository URL"
                  placeholder="Enter repository URL (e.g., https://github.com/username/repo)"
                  value={gitRepoUrl}
                  onChangeText={(text) => setGitRepoUrl(text)}
                  onBlur={() => setTouched(true)}
                  error={touched ? urlError : ""}
                  required
                  prefixIcon={
                    <MaterialIcons name="link" size={20} color="#233D90" />
                  }
                  iconPosition="left"
                  className="flex-1 overflow-hidden" // Add overflow-hidden here
                  multiline={true} // Allow multi-line input for long URLs
                  numberOfLines={2}
                />
              </View>
            </ScrollView>

            <View style={styles.actionButtons}>
              <Button
                title="Cancel"
                color="neutral"
                type="outlined"
                onPress={handleClose}
                className="flex-1 mr-2"
              />
              <Button
                title={isPending ? "Submitting..." : "Submit Grade"}
                color="primary"
                type="base"
                onPress={handleSubmit}
                className="flex-1 ml-2"
                disabled={isPending}
                icon={<MaterialIcons name="send" size={16} color="#FFFFFF" />}
                iconPosition="right"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    color: "#233D90",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: "70%",
  },
  infoSection: {
    marginBottom: 12,
  },
  infoLabel: {
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    color: "#111827",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  inputSection: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

export default GradingAssessmentTaskModal;
