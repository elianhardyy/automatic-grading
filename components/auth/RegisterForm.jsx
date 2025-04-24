import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  registerUser,
  resetAuthError,
  resetRegistrationStatus,
} from "../../redux/slice/auth";
import { TouchableOpacity, Alert, View, Text } from "react-native";

const RegisterForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    loading: reduxLoading,
    error,
    registrationSuccess,
  } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("trainer");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    return () => {
      dispatch(resetAuthError());
      dispatch(resetRegistrationStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    // Validate the form whenever any field changes
    validateField();

    setIsFormValid(
      email.trim() !== "" &&
        username.trim() !== "" &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        password === confirmPassword &&
        Object.keys(errors).length === 0
    );
  }, [email, username, password, confirmPassword]);

  useEffect(() => {
    if (registrationSuccess) {
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. Please login to continue.",
        [{ text: "OK", onPress: () => navigation.navigate("LoginScreen") }]
      );
      dispatch(resetRegistrationStatus());
      setLoading(false);
    }
  }, [registrationSuccess, navigation, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        "Registration Error",
        error.message || "Failed to register. Please try again."
      );
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    setLoading(reduxLoading);
  }, [reduxLoading]);

  const validateField = (fieldName = null) => {
    const newErrors = { ...errors };

    const validateEmail = () => {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid";
      } else {
        delete newErrors.email;
      }
    };

    const validateUsername = () => {
      if (!username.trim()) {
        newErrors.username = "Username is required";
      } else if (username.length < 5) {
        newErrors.username = "Username must be at least 5 characters";
      } else {
        delete newErrors.username;
      }
    };

    const validatePassword = () => {
      if (!password.trim()) {
        newErrors.password = "Password is required";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        delete newErrors.password;
      }
    };

    const validateConfirmPassword = () => {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (confirmPassword.length < 8) {
        newErrors.confirmPassword =
          "Confirm password must be at least 8 characters";
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    };

    if (fieldName === "email" || (fieldName === null && touchedFields.email)) {
      validateEmail();
    }

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
    validateField(fieldName);
  };

  const validate = () => {
    setTouchedFields({
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
    });

    return validateField();
  };

  const handleRegister = () => {
    if (validate()) {
      setLoading(true);

      const userData = {
        email,
        username,
        password,
        confirmPassword,
        role,
      };
      console.log("Registering user:", userData);
      dispatch(registerUser(userData));
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <View className="w-full">
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={() => handleFieldBlur("email")}
        placeholder="Email"
        keyboardType="email-address"
        variant="rounded"
        autoCapitalize="none"
        error={touchedFields.email ? errors.email : undefined}
        className="mb-4"
      />
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
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={() => handleFieldBlur("confirmPassword")}
        placeholder="Confirm Password"
        secureTextEntry
        error={
          touchedFields.confirmPassword ? errors.confirmPassword : undefined
        }
        variant="rounded"
        className="mb-4"
      />
      <Button
        title={loading ? "Loading..." : "Register"}
        disabled={loading || !isFormValid}
        className={!isFormValid ? "bg-neutral-300 border-neutral-100" : ""}
        textClassName={!isFormValid ? "text-neutral-500" : ""}
        onPress={handleRegister}
      />
      <View className="flex-row justify-between items-center mt-4">
        <Text className="text-neutral-600">Already have an account?</Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text className="text-primary-500">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;
