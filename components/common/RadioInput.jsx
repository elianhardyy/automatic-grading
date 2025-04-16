import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const RadioInput = ({
  label = "Radio",
  size = "md",
  selected = false,
  onSelect,
  disabled = false,
  value = "",
  groupName = "",
}) => {
  const handleSelect = () => {
    if (disabled) return;
    if (onSelect) onSelect(value);
  };

  // Size variations
  const outerSizeStyles = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const innerSizeStyles = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <TouchableOpacity
      className={`flex flex-row items-center gap-2 ${
        disabled ? "opacity-50" : ""
      }`}
      onPress={handleSelect}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <View
        className={`${
          outerSizeStyles[size]
        } items-center justify-center rounded-full border ${
          selected ? "border-primary-500" : "border-neutral-300"
        }`}
      >
        {selected && (
          <View
            className={`${innerSizeStyles[size]} rounded-full bg-primary-500`}
          />
        )}
      </View>
      <Text className="text-neutral-800">{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioInput;
