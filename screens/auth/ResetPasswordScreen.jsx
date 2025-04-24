import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";
import InputGroup from "../../components/common/InputGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { resetPassword } from "../../redux/slices/auth";

const ResetPasswordScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Get token from route params if available
  const { token } = route.params || {};

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    validateFields();
    setIsFormValid(
      formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== "" &&
        Object.keys(errors).length === 0
    );
  }, [formData]);

  const validateFields = (fieldName = null) => {
    const newErrors = { ...errors };

    const validatePassword = () => {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        delete newErrors.password;
      }
    };

    const validateConfirmPassword = () => {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    };

    if (
      fieldName === "password" ||
      (fieldName === null && touchedFields.password)
    ) {
      validatePassword();
    }

    if (
      fieldName === "confirmPassword" ||
      (fieldName === null && touchedFields.confirmPassword)
    ) {
      validateConfirmPassword();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
    validateFields(fieldName);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const validate = () => {
    setTouchedFields({
      password: true,
      confirmPassword: true,
    });

    return validateFields();
  };

  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await dispatch(
          resetPassword({
            token,
            password: formData.password,
          })
        ).unwrap();

        Alert.alert(
          "Password Reset Successful",
          "Your password has been successfully reset. You can now log in with your new password.",
          [
            {
              text: "Go to Login",
              onPress: navigateToLogin,
            },
          ]
        );
      } catch (err) {
        Alert.alert(
          "Error",
          err.message ||
            "There was a problem resetting your password. Please try again."
        );
      }
    }
  };

  // Password icon
  const renderPasswordIcon = (field, showState, setShowState) => {
    return (
      <TouchableOpacity
        onPress={() => setShowState(!showState)}
        className="ml-2"
      >
        <MaterialIcons
          name={showState ? "visibility" : "visibility-off"}
          size={24}
          color="#757575"
        />
      </TouchableOpacity>
    );
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
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="lock-reset" size={40} color="white" />
            </View>
            <Text
              className="text-primary-800 text-center"
              style={fonts.ecTextHeader2}
            >
              Reset Password
            </Text>
            <Text
              className="text-neutral-600 text-center mt-2"
              style={fonts.ecTextBody2}
            >
              Create a new password for your account
            </Text>
          </View>

          {/* Form Area */}
          <View className="w-full mb-6">
            <InputGroup
              label="New Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              onBlur={() => handleFieldBlur("password")}
              placeholder="Enter new password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              error={touchedFields.password ? errors.password : undefined}
              variant="rounded"
              className="mb-4"
              iconPosition="left"
              prefixIcon="lock"
              // Custom right icon for password visibility
              rightIcon={() =>
                renderPasswordIcon("password", showPassword, setShowPassword)
              }
            />

            <InputGroup
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              onBlur={() => handleFieldBlur("confirmPassword")}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              error={
                touchedFields.confirmPassword
                  ? errors.confirmPassword
                  : undefined
              }
              variant="rounded"
              className="mb-6"
              iconPosition="left"
              prefixIcon="lock"
              // Custom right icon for password visibility
              rightIcon={() =>
                renderPasswordIcon(
                  "confirmPassword",
                  showConfirmPassword,
                  setShowConfirmPassword
                )
              }
            />

            <Button
              title={loading ? "Resetting..." : "Reset Password"}
              disabled={loading || !isFormValid}
              className={
                !isFormValid || loading
                  ? "bg-neutral-300 border-neutral-100"
                  : ""
              }
              textClassName={!isFormValid || loading ? "text-neutral-500" : ""}
              onPress={handleSubmit}
            />
          </View>

          {/* Password Requirements */}
          <View className="bg-neutral-100 p-4 rounded-lg mb-6">
            <Text className="text-neutral-800 font-medium mb-2">
              Password requirements:
            </Text>
            <View className="flex-row items-center mb-1">
              <MaterialIcons
                name={formData.password.length >= 8 ? "check-circle" : "cancel"}
                size={16}
                color={formData.password.length >= 8 ? "#43936C" : "#CB3A31"}
                className="mr-2"
              />
              <Text className="text-neutral-600" style={fonts.ecTextBody3}>
                At least 8 characters
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons
                name={
                  /[A-Z]/.test(formData.password) ? "check-circle" : "cancel"
                }
                size={16}
                color={/[A-Z]/.test(formData.password) ? "#43936C" : "#CB3A31"}
                className="mr-2"
              />
              <Text className="text-neutral-600" style={fonts.ecTextBody3}>
                At least one uppercase letter
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons
                name={
                  /[0-9]/.test(formData.password) ? "check-circle" : "cancel"
                }
                size={16}
                color={/[0-9]/.test(formData.password) ? "#43936C" : "#CB3A31"}
                className="mr-2"
              />
              <Text className="text-neutral-600" style={fonts.ecTextBody3}>
                At least one number
              </Text>
            </View>
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

export default ResetPasswordScreen;
