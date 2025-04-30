import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { authService, resetAuthError } from "../../services/slice/authService";
import InputGroup from "../common/InputGroup";
import { MaterialIcons } from "@expo/vector-icons";

const LoginForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  useEffect(() => {
    return () => {
      dispatch(resetAuthError());
    };
  }, []);

  useEffect(() => {
    validateForm();
  }, [username, password]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Please check your credentials and try again."
      );
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 5) {
      newErrors.username = "Username should contains 5 characters or more";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password should contains 8 characters or more";
    }

    setErrors(newErrors);

    // Form is valid when there are no errors and both fields have values
    const valid =
      Object.keys(newErrors).length === 0 &&
      username.trim() !== "" &&
      password.trim() !== "";

    setIsFormValid(valid);
    return valid;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const validate = () => {
    setTouchedFields({
      username: true,
      password: true,
    });

    return validateForm();
  };

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);

      const credentials = {
        username,
        password,
      };

      try {
        await dispatch(authService.loginUser(credentials)).unwrap();
      } catch (err) {
        // Error handling is already done in the useEffect
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View className="w-full">
      <InputGroup
        label="Username"
        value={username}
        onChangeText={setUsername}
        onBlur={() => handleFieldBlur("username")}
        placeholder="Username"
        keyboardType="default"
        error={touchedFields.username ? errors.username : undefined}
        variant="rounded"
        className="mb-4"
        iconPosition="left"
        prefixIcon="person-outline"
      />
      <View className="mb-4 relative">
        <InputGroup
          label="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => handleFieldBlur("password")}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          error={touchedFields.password ? errors.password : undefined}
          variant="rounded"
          iconPosition="left"
          prefixIcon="lock-outline"
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          className="absolute right-3 top-2.5"
          style={{ zIndex: 1 }}
        >
          <MaterialIcons
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            size={24}
            color="#757575"
          />
        </TouchableOpacity>
      </View>
      <Button
        title={isLoading || loading ? "Loading..." : "Login"}
        disabled={isLoading || loading || !isFormValid}
        className={
          !isFormValid || isLoading || loading
            ? "bg-neutral-300 border-neutral-100"
            : ""
        }
        textClassName={
          !isFormValid || isLoading || loading ? "text-neutral-500" : ""
        }
        onPress={handleSubmit}
      />
      <View className="flex-row justify-between items-center mt-4">
        <TouchableOpacity onPress={navigateToForgotPassword}>
          <Text className="text-primary-500">Forgot Password?</Text>
        </TouchableOpacity>
        {/* <Text className="text-neutral-600">Don't have an account?</Text> */}
      </View>
    </View>
  );
};

export default LoginForm;
