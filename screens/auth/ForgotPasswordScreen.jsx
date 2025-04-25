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
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";
import InputGroup from "../../components/common/InputGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { forgotPassword } from "../../redux/slice/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
  });

  // Countdown timer states
  const [showCountdown, setShowCountdown] = useState(false);
  const [resetTime, setResetTime] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [countdown, setCountdown] = useState({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    validateField();
    setIsFormValid(email.trim() !== "" && Object.keys(errors).length === 0);
  }, [email]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (showCountdown && expiryTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(expiryTime).getTime();
        const timeLeft = expiry - now;

        if (timeLeft <= 0) {
          clearInterval(timer);
          setShowCountdown(false);
        } else {
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setCountdown({ minutes, seconds });
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showCountdown, expiryTime]);

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
      try {
        const result = await dispatch(forgotPassword({ email })).unwrap();

        if (result && result.data) {
          setResetTime(result.data.resetTime);
          setExpiryTime(result.data.expiredTime);
          setShowCountdown(true);

          Alert.alert(
            "Recovery Email Sent",
            "If an account exists with this email, you will receive password reset instructions."
          );
        }
      } catch (err) {
        Alert.alert(
          "Error",
          err.message ||
            "There was a problem sending the recovery email. Please try again."
        );
      }
    }
  };

  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
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

            {showCountdown ? (
              <View className="bg-primary-50 p-4 rounded-lg mb-6">
                <Text
                  className="text-center text-primary-700"
                  style={fonts.ecTextBody3}
                >
                  Password reset link sent! It will expire in:
                </Text>
                <Text className="text-center text-primary-800 text-xl font-bold mt-2">
                  {formatTime(countdown.minutes)}:
                  {formatTime(countdown.seconds)}
                </Text>
                <Text
                  className="text-center text-neutral-600 mt-2"
                  style={fonts.ecTextBody4}
                >
                  Check your email and follow the instructions
                </Text>
              </View>
            ) : (
              <Button
                title={loading ? "Sending..." : "Send Recovery Email"}
                disabled={loading || !isFormValid}
                className={
                  !isFormValid || loading
                    ? "bg-neutral-300 border-neutral-100"
                    : ""
                }
                textClassName={
                  !isFormValid || loading ? "text-neutral-500" : ""
                }
                onPress={handleSubmit}
              />
            )}
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
