// screens/errors/Error403Screen.jsx

import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../components/common/Button"; // Adjust path as needed
import { useNavigation } from "@react-navigation/native"; // Optional

const Error403Screen = ({ navigation }) => {
  const nav = useNavigation();
  const currentNavigation = navigation || nav;

  const handleGoBack = () => {
    if (currentNavigation?.canGoBack()) {
      currentNavigation.goBack();
    } else if (currentNavigation?.navigate) {
      currentNavigation.navigate("LoginScreen");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 justify-center items-center p-5">
        {/* Using 'block' or 'do-not-disturb' for forbidden */}
        <MaterialIcons
          name="block"
          size={80}
          color="#757575" /* neutral-500 */
        />
        <Text className="text-6xl font-bold text-neutral-800 my-4">403</Text>
        <Text className="text-2xl font-semibold text-neutral-700 mb-2 text-center">
          Access Forbidden
        </Text>
        <Text className="text-base text-neutral-500 text-center mb-6">
          Sorry, you don't have permission to access this resource.
        </Text>
        <Button
          title="Go Back"
          onPress={handleGoBack}
          variant="primary"
          // Or: type="base" color="primary"
          className="w-4/5"
        />
      </View>
    </SafeAreaView>
  );
};

export default Error403Screen;
