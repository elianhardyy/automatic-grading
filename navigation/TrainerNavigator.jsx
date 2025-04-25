import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import CreateTaskScreen from "../screens/task/CreateTaskScreen";
import DetailTaskScreen from "../screens/task/DetailTaskScreen";
import ExistingTaskScreen from "../screens/task/ExistingTaskScreen";
import ChangePasswordScreen from "../screens/password/ChangePasswordScreen";
import TraineeDetailScreen from "../screens/trainee/TraineeDetailScreen";
import AssessmentTaskScreen from "../screens/assessment/AssessmentTaskScreen";
import DetailAssessmentTaskScreen from "../screens/assessment/DetailAssessmentTaskScreen";
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
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CreateTaskScreen" component={CreateTaskScreen} />
      <Stack.Screen name="DetailTaskScreen" component={DetailTaskScreen} />
      <Stack.Screen name="ExistingTaskScreen" component={ExistingTaskScreen} />
      <Stack.Screen name="AssessmentTaskScreen" component={AssessmentTaskScreen} />
      <Stack.Screen name="DetailAssessmentTaskScreen" component={DetailAssessmentTaskScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="TraineeDetailScreen"
        component={TraineeDetailScreen}
        options={{ title: "Trainee Profile" }}
      />
    </Stack.Navigator>
  );
};

export default TrainerNavigator;
