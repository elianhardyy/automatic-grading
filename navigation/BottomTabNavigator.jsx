import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/home/HomeScreen";
import TaskScreen from "../screens/task/TaskScreen";
import TraineeScreen from "../screens/trainee/TraineeScreen";
import TraineeDetailScreen from "../screens/trainee/TraineeDetailScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Home Stack Screens
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: "Dashboard" }}
    />
    <HomeStack.Screen
      name="HomeDetails"
      component={HomeDetailsScreen}
      options={{ title: "Details" }}
    />
    <HomeStack.Screen
      name="HomeNotifications"
      component={HomeNotificationsScreen}
      options={{ title: "Notifications" }}
    />
  </HomeStack.Navigator>
);

// Task Stack Screens
const TaskStack = createStackNavigator();
const TaskStackScreen = () => (
  <TaskStack.Navigator screenOptions={{ headerShown: false }}>
    <TaskStack.Screen
      name="TaskList"
      component={TaskScreen}
      options={{ title: "Tasks" }}
    />
    <TaskStack.Screen
      name="CreateTask"
      component={CreateTaskScreen}
      options={{ title: "Create New Task" }}
    />
    <TaskStack.Screen
      name="TaskDetails"
      component={TaskDetailsScreen}
      options={{ title: "Task Details" }}
    />
    <TaskStack.Screen
      name="EditTask"
      component={EditTaskScreen}
      options={{ title: "Edit Task" }}
    />
  </TaskStack.Navigator>
);

// Trainee Stack Screens
const TraineeStack = createStackNavigator();
const TraineeStackScreen = () => (
  <TraineeStack.Navigator screenOptions={{ headerShown: false }}>
    <TraineeStack.Screen
      name="TraineeList"
      component={TraineeScreen}
      options={{ title: "Trainees" }}
    />
    <TraineeStack.Screen
      name="CreateTrainee"
      component={CreateTraineeScreen}
      options={{ title: "Add New Trainee" }}
    />
    <TraineeStack.Screen
      name="TraineeDetails"
      component={TraineeDetailScreen}
      options={{ title: "Trainee Profile" }}
    />
    <TraineeStack.Screen
      name="EditTrainee"
      component={EditTraineeScreen}
      options={{ title: "Edit Trainee" }}
    />
  </TraineeStack.Navigator>
);

// Profile Stack Screens
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: "My Profile" }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
    <ProfileStack.Screen
      name="Account"
      component={AccountScreen}
      options={{ title: "Account" }}
    />
    <ProfileStack.Screen
      name="Help"
      component={HelpScreen}
      options={{ title: "Help & Support" }}
    />
  </ProfileStack.Navigator>
);

// Placeholder Screen Components
const HomeDetailsScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const HomeNotificationsScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);

const TaskListScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const CreateTaskScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const TaskDetailsScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const EditTaskScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);

const TraineeListScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const CreateTraineeScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const EditTraineeScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);

const SettingsScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const AccountScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);
const HelpScreen = () => (
  <View className="flex-1 justify-center items-center"></View>
);

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // State to track whether the tab bar is collapsed
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Animation value for tab bar position
  const tabBarAnimation = useRef(new Animated.Value(0)).current;

  // Animation value for toggle button rotation
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  // Get screen dimensions
  const { height } = Dimensions.get("window");

  // Toggle tab bar visibility with bouncing animation
  const toggleTabBar = () => {
    // Start animation for tab bar position
    Animated.spring(tabBarAnimation, {
      toValue: isCollapsed ? 0 : 1,
      friction: 5, // Lower friction for more bounce
      tension: 40, // Controls the speed
      useNativeDriver: true,
    }).start();

    // Start animation for arrow rotation
    Animated.spring(rotateAnimation, {
      toValue: isCollapsed ? 0 : 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // Update state
    setIsCollapsed(!isCollapsed);
  };

  // Calculate the translateY value based on animation
  const translateY = tabBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust this value based on the height of your tab bar
  });

  // Calculate rotation for arrow icon
  const arrowRotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Custom tab bar component
  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <Animated.View
        style={{
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          transform: [{ translateY }],
        }}
      >
        {/* Toggle Button */}
        <View
          style={{
            alignItems: "center",
            marginBottom: -12, // Overlap with the tab bar
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            onPress={toggleTabBar}
            style={{
              backgroundColor: "#FFFFFF",
              width: 50,
              height: 24,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
              <Ionicons name="chevron-down" size={18} color="#233D90" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Define icon based on route name
            let iconName;
            if (route.name === "HomeTab") {
              iconName = isFocused ? "home" : "home-outline";
            } else if (route.name === "TaskTab") {
              iconName = isFocused ? "list-circle" : "list-circle-outline";
            } else if (route.name === "TraineeTab") {
              iconName = isFocused ? "people" : "people-outline";
            } else if (route.name === "ProfileTab") {
              iconName = isFocused ? "person" : "person-outline";
            }

            // Custom tab button
            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
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
                  {route.name.replace("Tab", "")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 0,
          display: "none",
        },
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="TaskTab"
        component={TaskStackScreen}
        options={{
          title: "Tasks",
        }}
      />
      <Tab.Screen
        name="TraineeTab"
        component={TraineeStackScreen}
        options={{
          title: "Trainees",
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
