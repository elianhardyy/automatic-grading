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
import LoginForm from "../../components/auth/LoginForm";

const LoginScreen = ({ navigation }) => {
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
            {/* ini form login */}
            <LoginForm navigation={navigation} />
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
