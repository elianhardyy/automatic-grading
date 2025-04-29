import React from "react";
import { TextInput, View, Text } from "react-native";
import { fonts } from "../../utils/font";

const Input = ({
  placeholder = "",
  value = "",
  onChangeText,
  disabled = false,
  readonly = false,
  variant = "base", // base, rounded, underline
  className = "",
  label = "",
  error = "",
  ...props
}) => {
  const variantStyles = {
    base: "border border-neutral-300 bg-white px-3 py-2",
    rounded: "border border-neutral-300 bg-white px-3 py-2 rounded-lg",
    underline: "border-b border-neutral-300 bg-white px-3 py-2",
  };

  const stateStyles = disabled ? "bg-neutral-100 text-neutral-400" : "";

  // Enhanced error styling for the border
  const errorStyle = error ? "border-alert-500" : "";

  return (
    <View className="w-full">
      {/* {label && (
        <Text
          className="text-neutral-700 mb-1 font-medium"
          style={fonts.ecTextBody2}
        >
          {label}
        </Text>
      )} */}

      <TextInput
        style={[
          fonts.ecTextBody3,
          {
            fontSize: 16,
            paddingVertical: 12, // Explicit padding to ensure text doesn't get cut off
            height: 48, // Set a fixed height to accommodate text
          },
        ]}
        className={`w-full ${variantStyles[variant]} ${stateStyles} ${errorStyle} ${className}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled && !readonly}
        placeholderTextColor="#9A9A9A"
        {...props}
      />

      {error && (
        <Text
          className="text-alert-500 text-xs mb-2"
          style={{ marginTop: -10 }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
