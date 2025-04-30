import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert as RNAlert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../../utils/font";
import Input from "../common/Input";
import Button from "../common/Button";
import TextArea from "../common/TextArea";
import { gradingService } from "../../services/query/gradingService";

import { format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setGradingEdit } from "../../services/slice/grading";

function formatDateToLocal(dateString) {
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

const EditGradingAssessmentTaskModal = ({
  visible,
  onClose,
  traineeTaskData,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    submitTime: "",
    grade: "",
    notes: "",
    submittedUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { grading } = useSelector((state) => state.grading);
  useEffect(() => {
    if (traineeTaskData && visible) {
      // Format the date to yyyy-MM-ddThh:mm format for input
      let formattedDate = "";
      if (traineeTaskData.submitTime) {
        const date = new Date(traineeTaskData.submitTime);
        formattedDate = formatDateToLocal(traineeTaskData.submitTime);
      }

      setFormData({
        submitTime: formattedDate,
        grade: traineeTaskData?.grade ? traineeTaskData?.grade.toString() : "",
        notes: traineeTaskData.notes || "",
        submittedUrl: traineeTaskData.submittedUrl || "",
      });
      setErrors({});
    }
  }, [traineeTaskData, visible, grading]);
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate grade (if provided)
    if (formData.grade && isNaN(Number(formData.grade))) {
      newErrors.grade = "Grade must be a number";
    } else if (
      formData.grade &&
      (Number(formData.grade) < 0 || Number(formData.grade) > 100)
    ) {
      newErrors.grade = "Grade must be between 0 and 100";
    }

    // Validate URL (if provided)
    if (formData.submittedUrl && !formData.submittedUrl.startsWith("http")) {
      newErrors.submittedUrl = "URL must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        grade: formData.grade ? Number(formData.grade) : null,
      };
      dispatch(setGradingEdit(dataToSubmit));
      await gradingService.updategradingTraineeTask(
        traineeTaskData.id,
        dataToSubmit
      );

      setLoading(false);
      RNAlert.alert("Success", "Assessment has been updated successfully", [
        {
          text: "OK",
          onPress: () => {
            onClose();
            onSuccess?.();
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      RNAlert.alert("Error", error.message || "Failed to update assessment", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, fonts.ecTextSubtitle1]}>
              Edit Assessment
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#3E3E3E" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, fonts.ecTextBody2]}>
                Submission Time
              </Text>
              <Input
                placeholder="YYYY-MM-DDThh:mm"
                value={formData.submitTime}
                onChangeText={(value) => handleChange("submitTime", value)}
                error={errors.submitTime}
                variant="rounded"
              />
              <Text style={styles.helperText}>
                Format: YYYY-MM-DDThh:mm (e.g., 2025-04-30T14:30)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, fonts.ecTextBody2]}>
                Grade (0-100)
              </Text>
              <Input
                placeholder="Enter grade"
                value={formData?.grade || grading?.grade}
                onChangeText={(value) => handleChange("grade", value)}
                keyboardType="numeric"
                error={errors?.grade}
                variant="rounded"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, fonts.ecTextBody2]}>
                Submitted URL
              </Text>
              <Input
                placeholder="https://example.com"
                value={formData.submittedUrl}
                onChangeText={(value) => handleChange("submittedUrl", value)}
                error={errors.submittedUrl}
                variant="rounded"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, fonts.ecTextBody2]}>Notes</Text>
              <TextArea
                placeholder="Enter assessment notes"
                value={formData.notes}
                onChangeText={(value) => handleChange("notes", value)}
                rows={5}
                variant="rounded"
                className="h-32"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={onClose}
              type="outlined"
              color="neutral"
              className="mr-2 flex-1"
            />
            <Button
              title={loading ? "Saving..." : "Save Changes"}
              onPress={handleSubmit}
              disabled={loading}
              variant="primary"
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#3E3E3E",
  },
  modalBody: {
    padding: 16,
    maxHeight: 500,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E1E1E1",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "#3E3E3E",
  },
  helperText: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
});

export default EditGradingAssessmentTaskModal;
