import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CheckboxInput = ({
  label = "Checkbox",
  size = "md",
  initialValue = false,
  onValueChange,
  disabled = false,
  name = "",
}) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <TouchableOpacity
      className={`flex flex-row items-center gap-2 ${
        disabled ? "opacity-50" : ""
      }`}
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={label}
    >
      <View
        className={`${
          sizeStyles[size]
        } items-center justify-center rounded border ${
          isChecked
            ? "bg-primary-500 border-primary-500"
            : "border-neutral-300 bg-white"
        }`}
      >
        {isChecked && (
          <MaterialIcons name="check" size={iconSize[size]} color="white" />
        )}
      </View>
      <Text className="text-neutral-800">{label}</Text>
    </TouchableOpacity>
  );
};

export default CheckboxInput;
