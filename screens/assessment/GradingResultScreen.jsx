import React, { useEffect } from "react"; // Removed useState
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  // ActivityIndicator, // Removed ActivityIndicator import
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../../utils/font";
import Button from "../../components/common/Button";

const GradingResultScreen = ({ route, navigation }) => {
  const { gradingData } = route.params;
  console.log("ini hasil grading: ", gradingData);

  // Removed state variables for typing animation:
  // const [displayedNotes, setDisplayedNotes] = useState("");
  // const [isTyping, setIsTyping] = useState(true);
  // const [typingComplete, setTypingComplete] = useState(false);

  // Format the submit time to yyyy-MM-dd HH:mm:ss
  const formatSubmitTime = (dateString) => {
    if (!dateString) return "N/A"; // Handle cases where dateString might be null/undefined
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Removed useEffect hook for typing animation

  // Calculate the total score
  const totalScore = gradingData.finalScore ?? "N/A"; // Added fallback for score

  const handleBackToAssessments = () => {
    navigation.goBack();
  };

  const handleViewFullReport = () => {
    navigation.navigate("FullGradingReport", { gradingData });
  };

  // Added a helper to safely get notes
  const getEvaluatorNotes = () => {
    return gradingData.codeEvaluation?.notes || "No notes provided.";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[fonts.ecTextHeading2, styles.headerTitle]}>
          Grading Result
        </Text>
        <TouchableOpacity
          onPress={handleBackToAssessments}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#233D90" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.scoreSection}>
            <Text style={[fonts.ecTextBody2, styles.scoreLabel]}>
              Final Score
            </Text>
            <View style={styles.scoreCircle}>
              <Text style={[fonts.ecTextHeading1, styles.scoreValue]}>
                {totalScore}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[fonts.ecTextBody3, styles.infoLabel]}>
              Submit Time:
            </Text>
            <Text style={[fonts.ecTextBody3M, styles.infoValue]}>
              {formatSubmitTime(gradingData.submitTime)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[fonts.ecTextBody3, styles.infoLabel]}>
              Git Repository:
            </Text>
            <Text
              style={[fonts.ecTextBody3M, styles.infoValue, styles.gitRepo]}
            >
              {gradingData.gitRepository || "N/A"} {/* Added fallback */}
            </Text>
          </View>
        </View>

        <View style={styles.criteriaContainer}>
          <Text style={[fonts.ecTextBody1M, styles.sectionTitle]}>
            Evaluation Criteria
          </Text>

          {gradingData.codeEvaluation?.result?.map(
            (
              item,
              index // Added optional chaining for result
            ) => (
              <View key={index} style={styles.criteriaItem}>
                <View style={styles.criteriaHeader}>
                  <Text style={[fonts.ecTextBody3M, styles.criteriaText]}>
                    {item.criteria || "N/A"} {/* Added fallback */}
                  </Text>
                  <View style={styles.scoreWeightRow}>
                    <Text style={[fonts.ecTextBody3, styles.criteriaLabel]}>
                      Score:
                    </Text>
                    <Text style={[fonts.ecTextBody3M, styles.criteriaScore]}>
                      {item.score ?? "N/A"} {/* Added fallback */}
                    </Text>
                    <Text
                      style={[
                        fonts.ecTextBody3,
                        styles.criteriaLabel,
                        styles.weightLabel,
                      ]}
                    >
                      Weight:
                    </Text>
                    <Text style={[fonts.ecTextBody3M, styles.criteriaWeight]}>
                      {item.weight ?? "N/A"}% {/* Added fallback */}
                    </Text>
                  </View>
                </View>
              </View>
            )
          ) ?? ( // Handle case where result array might be missing
            <Text style={[fonts.ecTextBody3, styles.noDataText]}>
              No criteria data available.
            </Text>
          )}
        </View>

        <View style={styles.notesContainer}>
          <Text style={[fonts.ecTextBody1M, styles.sectionTitle]}>
            Evaluator Notes
          </Text>
          <View style={styles.notesContent}>
            {/* Directly display notes, handle missing notes */}
            <Text style={[fonts.ecTextBody3, styles.notesText]}>
              {getEvaluatorNotes()}
            </Text>
            {/* Removed typing cursor and activity indicator */}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back to Assessments"
          color="neutral"
          type="outlined"
          onPress={handleBackToAssessments}
          className="flex-1 mr-2"
          icon={<MaterialIcons name="arrow-back" size={16} color="#6B7280" />}
          iconPosition="left"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    position: "relative",
  },
  headerTitle: {
    color: "#233D90",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  scoreLabel: {
    color: "#6B7280",
    marginBottom: 8,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#233D90",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    color: "#FFFFFF",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  infoLabel: {
    color: "#6B7280",
    width: "30%",
    marginRight: 4, // Added small margin
  },
  infoValue: {
    color: "#111827",
    // Adjust width to be flexible
    flex: 1, // Allow text to take remaining space
    minWidth: "65%", // Ensure it takes up reasonable space
  },
  gitRepo: {
    // flexShrink: 1, // Removed, handled by flex: 1 on infoValue
  },
  criteriaContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    color: "#233D90",
    marginBottom: 12,
  },
  criteriaItem: {
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#233D90",
    paddingLeft: 12,
  },
  criteriaHeader: {
    marginBottom: 4,
  },
  criteriaText: {
    color: "#111827",
    marginBottom: 4,
  },
  scoreWeightRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // Allow wrapping on small screens
  },
  criteriaLabel: {
    color: "#6B7280",
    marginRight: 4, // Spacing
  },
  criteriaScore: {
    color: "#111827",
    marginRight: 12, // Spacing
  },
  weightLabel: {
    // Removed marginLeft: 8, handled by marginRight on score
  },
  criteriaWeight: {
    color: "#111827",
    // Removed marginLeft: 4
  },
  notesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notesContent: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 60, // Ensure a minimum height even if notes are short/missing
  },
  notesText: {
    color: "#374151",
    lineHeight: 20,
  },
  // Removed cursor style
  // Removed typingIndicator style
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  noDataText: {
    // Added style for missing criteria
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default GradingResultScreen;
