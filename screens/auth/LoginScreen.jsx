import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if form is valid whenever username or password changes
  useEffect(() => {
    setIsFormValid(username.trim() !== "" && password.trim() !== "");
  }, [username, password]);

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigateToRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 flex justify-between">
        <ScrollView
          className="flex-grow"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View className="items-center justify-center px-6">
            <View className="items-center mb-8">
              <Image
                source={{
                  uri: "https://media-exp1.licdn.com/dms/image/C560BAQHWNcYaGW_Tjw/company-logo_200_200/0?e=2159024400&v=beta&t=YKTBWjEmyayXc9Xu8jRGy8i5taG6ziIxlku0iGP89r0",
                }}
                style={{ width: 100, height: 100, marginBottom: 16 }}
                resizeMode="contain"
              />
              <Text style={fonts.ecTextBody1} className="text-primary-800">
                Login
              </Text>
              <Text className="text-base text-primary-500">
                Please login to your account
              </Text>
            </View>
            <View className="w-full">
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                keyboardType="default"
                error={errors.username}
                variant="rounded"
                className="mb-4"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                error={errors.password}
                variant="rounded"
                className="mb-4"
              />
              <Button
                title={loading ? "Loading..." : "Login"}
                disabled={loading || !isFormValid}
                // style={!isFormValid ? { backgroundColor: "#D1D5DB" } : {}}
                className={
                  !isFormValid ? "bg-neutral-300 border-neutral-100" : ""
                }
                textClassName={!isFormValid ? "text-neutral-500" : ""}
                onPress={() => {
                  if (validate()) {
                    setLoading(true);
                  }
                }}
              />
              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-neutral-600">Don't have an account?</Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text className="text-primary-500">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="w-full">
          <View className="h-px bg-gray-200 w-full mb-4" />
          <View className="flex-row justify-center items-center pb-6">
            <Text className="text-neutral-900">Copyright 2025 - </Text>
            <Text className="text-secondary-500">Enigma Cipta Humanika</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
