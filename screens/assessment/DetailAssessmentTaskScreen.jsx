import { useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, StatusBar, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setOngoing } from "../../redux/slice/ongoing";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";

const DetailAssessmentTaskScreen = ({ route, navigation }) => {
  const { data: traineeTaskData } = route.params; // ambil data dari route.params
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOngoing("DetailAssessment"));
  }, []);

  const renderItem = ({ item }) => (
    <Card style={{ marginBottom: 12 }}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardTopLeft}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 16 }}>
            {item.traineeName}
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 4 }}>
            Task: {item.batchTask.taskName}
          </Text>
          <Text style={{ color: "#6B7280" }}>
            Batch: {item.batchTask.batchName}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottomRow}>
        <View>
          <Text style={{ color: "#4B5563" }}>
            Grade: {item.grade ?? "-"}
          </Text>
          <Text style={{ color: "#4B5563" }}>
            Notes: {item.notes ?? "-"}
          </Text>
        </View>
        {item.submittedUrl ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("WebViewScreen", {
                url: item.submittedUrl,
              });
            }}
          >
            <Text style={{ color: "#1D4ED8" }}>Lihat Submit</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: "#9CA3AF" }}>Belum Submit</Text>
        )}
      </View>
    </Card>
  );

  if (!traineeTaskData) {
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
            <Text style={[styles.headerTitle, { fontSize: 18, fontFamily: fonts.medium }]}>
              Detail Assessment
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
  
        <View style={{ padding: 16 }}>
          {traineeTaskData ? (
            <>
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
                  {traineeTaskData.traineeName}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#555",
                    marginTop: 4,
                  }}
                >
                  Batch: {traineeTaskData.batchTask.batchName}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#555",
                    marginTop: 4,
                  }}
                >
                  Task: {traineeTaskData.batchTask.taskName}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#555",
                    marginTop: 4,
                  }}
                >
                  Due Date: {new Date(traineeTaskData.batchTask.dueDate).toLocaleString()}
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
                  Score: {traineeTaskData.grade ?? "-"}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#333",
                    marginTop: 8,
                  }}
                >
                  Notes: {traineeTaskData.notes || "No notes"}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#333",
                    marginTop: 8,
                  }}
                >
                  Submitted URL: {traineeTaskData.submittedUrl ?? "-"}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#333",
                    marginTop: 8,
                  }}
                >
                  Submitted Time:{" "}
                  {traineeTaskData.submitTime
                    ? new Date(traineeTaskData.submitTime).toLocaleString()
                    : "-"}
                </Text>
              </Card>
            </>
          ) : (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListTitle}>Data tidak ditemukan</Text>
              <Text style={styles.emptyListMessage}>
                Tidak ada trainee yang terkait dengan task ini.
              </Text>
              <Button
                title="Muat Ulang"
                onPress={() => navigation.goBack()}
                style={styles.emptyListRefreshButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- StyleSheet ---
// ... (StyleSheet tetap sama seperti sebelumnya) ...
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

export default DetailAssessmentTaskScreen;
