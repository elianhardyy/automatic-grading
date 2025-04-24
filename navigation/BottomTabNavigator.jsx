import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "../screens/home/HomeScreen";
import TaskScreen from "../screens/task/TaskScreen";
import TraineeScreen from "../screens/trainee/TraineeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Create a context to share the active tab index across components
import { createContext } from "react";

export const TabIndexContext = createContext({
  activeTabIndex: 0,
  setActiveTabIndex: () => {},
});

// Create the Material Top Tab Navigator for swipeable screens
const TopTab = createMaterialTopTabNavigator();

const BottomTabNavigator = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const navigation = useNavigation();

  // State to track whether the tab bar is collapsed
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Animation value for tab bar position
  const tabBarAnimation = useRef(new Animated.Value(0)).current;

  // Animation value for toggle button rotation
  const rotateAnimation = useRef(new Animated.Value(0)).current;

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

  // Function to handle tab selection - now using index directly to switch tabs
  const handleTabPress = (index) => {
    setActiveTabIndex(index);
    // Instead of navigating by name, just set the index
    // This will use jumpTo which is the proper way to navigate between tabs
  };

  // Map tab names to display names
  const tabDisplayNames = ["Home", "Tasks", "Trainees", "Profile"];

  return (
    <TabIndexContext.Provider value={{ activeTabIndex, setActiveTabIndex }}>
      <View style={{ flex: 1 }}>
        <TopTab.Navigator
          initialRouteName="HomeScreen"
          tabBar={() => null} // Hide the default tab bar
          screenOptions={{
            swipeEnabled: true,
            animationEnabled: true,
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
            listeners={{
              focus: () => setActiveTabIndex(0),
            }}
          />
          <TopTab.Screen
            name="TaskScreen"
            component={TaskScreen}
            options={{ title: "Tasks" }}
            listeners={{
              focus: () => setActiveTabIndex(1),
            }}
          />
          <TopTab.Screen
            name="TraineeScreen"
            component={TraineeScreen}
            options={{ title: "Trainees" }}
            listeners={{
              focus: () => setActiveTabIndex(2),
            }}
          />
          <TopTab.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ title: "My Profile" }}
            listeners={{
              focus: () => setActiveTabIndex(3),
            }}
          />
        </TopTab.Navigator>

        {/* Custom Tab Bar */}
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
            {tabDisplayNames.map((tabName, index) => {
              const isFocused = activeTabIndex === index;

              // Define icon based on tab name
              let iconName;
              if (tabName === "Home") {
                iconName = isFocused ? "home" : "home-outline";
              } else if (tabName === "Tasks") {
                iconName = isFocused ? "list-circle" : "list-circle-outline";
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
                      // Use the screen name directly in an array to navigate to that tab
                      const routes = [
                        "HomeScreen",
                        "TaskScreen",
                        "TraineeScreen",
                        "ProfileScreen",
                      ];
                      navigation.navigate(routes[index]);
                      setActiveTabIndex(index);
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
        </Animated.View>
      </View>
    </TabIndexContext.Provider>
  );
};

export default BottomTabNavigator;
