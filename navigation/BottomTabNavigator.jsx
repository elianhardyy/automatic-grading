import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import TaskScreen from "../screens/task/TaskScreen";
import TraineeScreen from "../screens/trainee/TraineeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const TopTab = createMaterialTopTabNavigator();

const BottomTabNavigator = () => {
  const tabDisplayNames = ["Home", "Tasks", "Trainees", "Profile"];

  return (
    <View style={{ flex: 1 }}>
      <TopTab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
        }}
        tabBar={({ state, navigation }) => {
          const activeTabIndex = state.index;

          return (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                paddingVertical: 7,
                paddingHorizontal: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {tabDisplayNames.map((tabName, index) => {
                  const isFocused = activeTabIndex === index;

                  let iconName;
                  if (tabName === "Home") {
                    iconName = isFocused ? "home" : "home-outline";
                  } else if (tabName === "Tasks") {
                    iconName = isFocused
                      ? "list-circle"
                      : "list-circle-outline";
                  } else if (tabName === "Trainees") {
                    iconName = isFocused ? "people" : "people-outline";
                  } else if (tabName === "Profile") {
                    iconName = isFocused ? "person" : "person-outline";
                  }

                  // Custom tab button
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (navigation) {
                          const routes = [
                            "HomeScreen",
                            "TaskScreen",
                            "TraineeScreen",
                            "ProfileScreen",
                          ];
                          navigation.navigate(routes[index]);
                        }
                      }}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: isFocused ? "#E9ECF4" : "transparent",
                        borderRadius: 12,
                        paddingVertical: 8,
                        marginHorizontal: 4,
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={iconName}
                        size={22}
                        color={isFocused ? "#233D90" : "#9A9A9A"}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 4,
                          color: isFocused ? "#233D90" : "#757575",
                          fontWeight: isFocused ? "600" : "normal",
                        }}
                      >
                        {tabName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        }}
        backBehavior="initialRoute"
        tabBarPosition="bottom"
        initialLayout={{ width: 1 }} // This helps with initial layout calculations
        style={{ flex: 1 }}
      >
        <TopTab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Dashboard" }}
        />
        <TopTab.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: "Tasks" }}
        />
        <TopTab.Screen
          name="TraineeScreen"
          component={TraineeScreen}
          options={{ title: "Trainees" }}
        />
        <TopTab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: "My Profile" }}
        />
      </TopTab.Navigator>
    </View>
  );
};

export default BottomTabNavigator;
