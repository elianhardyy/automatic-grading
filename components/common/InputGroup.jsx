import React from "react";
import { View, TextInput, Text } from "react-native";
import * as Icon from "@expo/vector-icons";

const InputGroup = ({
  placeholder = "Input Box",
  value = "",
  onChangeText,
  disabled = false,
  readonly = false,
  variant = "base", // base, rounded, underline
  prefixIcon,
  prefixText,
  iconPosition = "left", // left, right
  ...props
}) => {
  const variantStyles = {
    base: "border border-neutral-300",
    rounded: "border border-neutral-300 rounded-lg overflow-hidden",
    underline: "border-b border-neutral-300",
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

  return (
    <View className={`flex flex-row w-full ${variantStyles[variant]}`}>
      {(prefixIcon || prefixText) && iconPosition === "left" && (
        <PrefixContainer />
      )}

      <TextInput
        className={`flex-1 p-2 ${stateStyles}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled && !readonly}
        placeholderTextColor="#9A9A9A"
        {...props}
      />

      {(prefixIcon || prefixText) && iconPosition === "right" && (
        <PrefixContainer />
      )}
    </View>
  );
};

export default InputGroup;
