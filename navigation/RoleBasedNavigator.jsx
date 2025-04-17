import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import TrainerNavigator from "./TrainerNavigator";
import LoginScreen from "../screens/auth/LoginScreen";

const Stack = createStackNavigator();

const RoleBasedNavigator = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const userRole = user?.role || "";

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {userRole === "[ROLE_TRAINER]" ? (
        <Stack.Screen name="TrainerFlow" component={TrainerNavigator} />
      ) : (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RoleBasedNavigator;
