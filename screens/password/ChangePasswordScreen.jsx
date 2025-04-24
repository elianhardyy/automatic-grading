import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, resetProfileError } from "../../redux/slice/profile";

// Components
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fonts } from "../../utils/font";
import InputGroup from "../../components/common/InputGroup";

const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(resetProfileError());
    return () => {
      dispatch(resetProfileError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    // Validate confirm password
    if (!passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm password is required";
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await dispatch(changePassword(passwordForm)).unwrap();
        Alert.alert("Success", "Password changed successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } catch (err) {
        const errorMessage = err?.message || "Failed to change password";
        Alert.alert("Error", errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setPasswordForm({
      ...passwordForm,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <View className="p-4">
        <Text style={fonts.ecTextHeader1M} className="text-neutral-800 mb-6">
          Change Password
        </Text>

        <Card
          title="Password Settings"
          variant="primary"
          icon={<MaterialIcons name="lock" size={24} color="#233D90" />}
          initiallyExpanded={true}
          collapsible={false}
        >
          <View className="space-y-4">
            {/* Current Password */}
            <View>
              <Text style={fonts.ecTextBody2} className="mb-1 text-neutral-700">
                Current Password
              </Text>
              <View className="relative">
                <InputGroup
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChangeText={(text) =>
                    handleInputChange("currentPassword", text)
                  }
                  secureTextEntry={!showCurrentPassword}
                  variant="rounded"
                  error={errors.currentPassword}
                  iconPosition="left"
                  prefixIcon="lock-outline"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => togglePasswordVisibility("current")}
                >
                  <MaterialIcons
                    name={showCurrentPassword ? "visibility-off" : "visibility"}
                    size={24}
                    color="#757575"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View>
              <Text style={fonts.ecTextBody2} className="mb-1 text-neutral-700">
                New Password
              </Text>
              <View className="relative">
                <InputGroup
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChangeText={(text) =>
                    handleInputChange("newPassword", text)
                  }
                  secureTextEntry={!showNewPassword}
                  variant="rounded"
                  error={errors.newPassword}
                  iconPosition="left"
                  prefixIcon="lock-outline"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => togglePasswordVisibility("new")}
                >
                  <MaterialIcons
                    name={showNewPassword ? "visibility-off" : "visibility"}
                    size={24}
                    color="#757575"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm New Password */}
            <View>
              <Text style={fonts.ecTextBody2} className="mb-1 text-neutral-700">
                Confirm New Password
              </Text>
              <View className="relative">
                <InputGroup
                  placeholder="Confirm new password"
                  value={passwordForm.confirmNewPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmNewPassword", text)
                  }
                  secureTextEntry={!showConfirmPassword}
                  variant="rounded"
                  error={errors.confirmNewPassword}
                  iconPosition="left"
                  prefixIcon="lock-outline"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => togglePasswordVisibility("confirm")}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility-off" : "visibility"}
                    size={24}
                    color="#757575"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password requirements info */}
            <View className="bg-info-50 p-3 mt-6 rounded-lg border border-info-200">
              <Text
                style={fonts.ecTextBody3}
                className="text-info-700 flex-row items-center"
              >
                <MaterialIcons name="info-outline" size={16} color="#4888D3" />{" "}
                Password requirements:
              </Text>
              <View className="ml-5 mt-1">
                <Text style={fonts.ecTextBody3} className="text-neutral-700">
                  • Minimum 8 characters
                </Text>
                <Text style={fonts.ecTextBody3} className="text-neutral-700">
                  • At least one uppercase letter recommended
                </Text>
                <Text style={fonts.ecTextBody3} className="text-neutral-700">
                  • At least one number recommended
                </Text>
              </View>
            </View>

            {/* Error display */}
            {error && (
              <View className="bg-alert-50 p-3 rounded-lg border border-alert-200">
                <Text
                  style={fonts.ecTextBody3}
                  className="text-alert-700 flex-row items-center"
                >
                  <MaterialIcons
                    name="error-outline"
                    size={16}
                    color="#CB3A31"
                  />{" "}
                  {error.message || "An error occurred"}
                </Text>
              </View>
            )}

            {/* Action buttons */}
            <View className="flex-row justify-end space-x-3 mt-4">
              <Button
                title="Cancel"
                type="outlined"
                color="neutral"
                onPress={() => navigation.goBack()}
                className="px-6"
              />
              <Button
                title="Change Password"
                variant="primary"
                loading={isSubmitting || loading}
                onPress={handleChangePassword}
              />
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ChangePasswordScreen;
