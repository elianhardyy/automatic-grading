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
import { fonts } from "../../utils/font";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthError } from "../../redux/slice/auth";
const LoginForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    validateField();

    setIsFormValid(
      username.trim() !== "" &&
        password.trim() !== "" &&
        Object.keys(errors).length === 0
    );
  }, [username, password]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Please check your credentials and try again."
      );
    }
  }, [error]);

  const validateField = (fieldName = null) => {
    const newErrors = { ...errors };

    const validateUsername = () => {
      if (!username.trim()) {
        newErrors.username = "Username is required";
      } else {
        delete newErrors.username;
      }
    };

    const validatePassword = () => {
      if (!password.trim()) {
        newErrors.password = "Password is required";
      } else {
        delete newErrors.password;
      }
    };
    if (
      fieldName === "username" ||
      (fieldName === null && touchedFields.username)
    ) {
      validateUsername();
    }

    if (
      fieldName === "password" ||
      (fieldName === null && touchedFields.password)
    ) {
      validatePassword();
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
      username: true,
      password: true,
    });

    return validateField();
  };

  const navigateToRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);

      const credentials = {
        username,
        password,
      };

      try {
        await dispatch(loginUser(credentials)).unwrap();
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <View className="w-full">
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        onBlur={() => handleFieldBlur("username")}
        placeholder="Username"
        keyboardType="default"
        error={touchedFields.username ? errors.username : undefined}
        variant="rounded"
        className="mb-4"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        onBlur={() => handleFieldBlur("password")}
        placeholder="Password"
        secureTextEntry
        error={touchedFields.password ? errors.password : undefined}
        variant="rounded"
        className="mb-4"
      />
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
        <Text className="text-neutral-600">Don't have an account?</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text className="text-primary-500">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
