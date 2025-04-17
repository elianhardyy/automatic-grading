import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import BottomTabNavigator from "./BottomTabNavigator";
const Stack = createStackNavigator();
const TrainerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default TrainerNavigator;
