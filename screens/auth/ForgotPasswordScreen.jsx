import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";
import InputGroup from "../../components/common/InputGroup";
import { MaterialIcons } from "@expo/vector-icons";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
  });

  useEffect(() => {
    validateField();
    setIsFormValid(email.trim() !== "" && Object.keys(errors).length === 0);
  }, [email]);

  const validateField = (fieldName = null) => {
    const newErrors = { ...errors };

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email";
      } else {
        delete newErrors.email;
      }
    };

    if (fieldName === "email" || (fieldName === null && touchedFields.email)) {
      validateEmail();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
    validateField(fieldName);
  };

  const validate = () => {
    setTouchedFields({
      email: true,
    });

    return validateField();
  };

  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);

      try {
        // Simulating API call
        setTimeout(() => {
          Alert.alert(
            "Recovery Email Sent",
            "If an account exists with this email, you will receive password reset instructions."
          );
          setIsLoading(false);
        }, 1500);
      } catch (err) {
        Alert.alert(
          "Error",
          "There was a problem sending the recovery email. Please try again."
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-neutral-50"
      >
        <View className="flex-1 px-6 py-8 justify-center">
          {/* Logo/Header Area */}
          <View className="items-center mb-8">
            {/* You can replace this with your actual logo */}
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="lock-open" size={40} color="white" />
            </View>
            <Text
              className="text-primary-800 text-center"
              style={fonts.ecTextHeader2}
            >
              Forgot Password
            </Text>
            <Text
              className="text-neutral-600 text-center mt-2"
              style={fonts.ecTextBody2}
            >
              Enter your email and we'll send you instructions to reset your
              password
            </Text>
          </View>

          {/* Form Area */}
          <View className="w-full mb-6">
            <InputGroup
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => handleFieldBlur("email")}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={touchedFields.email ? errors.email : undefined}
              variant="rounded"
              className="mb-6"
              iconPosition="left"
              prefixIcon="email"
            />

            <Button
              title={isLoading ? "Sending..." : "Send Recovery Email"}
              disabled={isLoading || !isFormValid}
              className={
                !isFormValid || isLoading
                  ? "bg-neutral-300 border-neutral-100"
                  : ""
              }
              textClassName={
                !isFormValid || isLoading ? "text-neutral-500" : ""
              }
              onPress={handleSubmit}
            />
          </View>

          {/* Back to Login Link */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-neutral-600">Remember your password?</Text>
            <TouchableOpacity onPress={navigateToLogin} className="ml-1">
              <Text className="text-primary-500 font-medium">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
