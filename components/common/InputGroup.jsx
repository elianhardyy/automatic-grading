import React from "react";
import { View, TextInput, Text } from "react-native";
import * as Icon from "@expo/vector-icons";
import { fonts } from "../../utils/font";

const InputGroup = ({
  placeholder = "Input Box",
  value = "",
  onChangeText,
  disabled = false,
  readonly = false,
  variant = "base", // base, rounded, underline
  prefixIcon = "",
  prefixText = "",
  className = "",
  iconPosition = "left", // left, right
  error = "",
  isPhoneNumber = false, // New prop to identify phone number fields
  maxLength = 15, // Default max length for phone numbers
  minLength = 10, // Default min length for phone numbers
  ...props
}) => {
  // Base variant styles
  const getVariantStyles = () => {
    // Error state takes precedence in border styling
    const baseStyles = {
      base: `border ${
        error ? "border-alert-500" : "border-neutral-300"
      } bg-white px-3 py-2`,
      rounded: `border ${
        error ? "border-alert-500" : "border-neutral-300"
      } rounded-lg overflow-hidden bg-white py-1`,
      underline: `border-b ${
        error ? "border-alert-500" : "border-neutral-300"
      } bg-white px-3 py-2`,
    };

    return baseStyles[variant];
  };

  const stateStyles = disabled ? "bg-neutral-100 text-neutral-400" : "";

  const PrefixContainer = () => (
    <View className="bg-neutral-100 px-3 justify-center items-center">
      {prefixIcon && (
        <Icon.MaterialIcons name={prefixIcon} size={20} color="#757575" />
      )}
      {prefixText && <Text className="text-neutral-500">{prefixText}</Text>}
    </View>
  );

  // Character counter for phone numbers with visual indication when below minLength
  const CharacterCounter = () => {
    const isUnderMinLength = isPhoneNumber && value?.length < minLength;
    const counterColor = isUnderMinLength
      ? "text-alert-500"
      : "text-neutral-500";

    return (
      <View className="px-2 justify-center">
        <Text className={`text-xs ${counterColor}`}>
          {value?.length || 0}/{maxLength}
        </Text>
      </View>
    );
  };

  return (
    <View className="w-full">
      <View
        className={`flex flex-row w-full ${getVariantStyles()} ${className}`}
      >
        {(prefixIcon || prefixText) && iconPosition === "left" && (
          <PrefixContainer />
        )}

        <TextInput
          style={[
            fonts.ecTextBody3,
            {
              fontSize: 16,
              height: 40,
              flex: 1,
              paddingVertical: 12,
            },
          ]}
          className={`flex-1 p-2 ${stateStyles}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && !readonly}
          placeholderTextColor="#9A9A9A"
          maxLength={isPhoneNumber ? maxLength : undefined}
          {...props}
        />

        {(prefixIcon || prefixText) && iconPosition === "right" && (
          <PrefixContainer />
        )}

        {/* Character counter for phone numbers */}
        {isPhoneNumber && <CharacterCounter />}
      </View>
      {error && <Text className="text-alert-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};

export default InputGroup;
