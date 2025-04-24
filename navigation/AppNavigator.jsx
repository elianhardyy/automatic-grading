import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../screens/home/HomeScreen";
import { useSelector } from "react-redux";
import RoleBasedNavigator from "./RoleBasedNavigator";
import TaskScreen from "../screens/task/TaskScreen";

const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="RoleBasedFlow" component={RoleBasedNavigator} />
      {/* Add HomeScreen directly here for direct navigation */}
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TaskScreen" component={TaskScreen} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
