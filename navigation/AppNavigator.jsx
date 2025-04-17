import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../screens/home/HomeScreen";
import { useSelector } from "react-redux";
import RoleBasedNavigator from "./RoleBasedNavigator";

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
    </Stack.Navigator>
  );
};

export default AppNavigator;
