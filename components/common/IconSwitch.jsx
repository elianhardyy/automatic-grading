import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const IconSwitch = ({
  value = false,
  onValueChange,
  disabled = false,
  size = "lg", // base, lg
  iconOff = "light-mode",
  iconOn = "dark-mode",
  ...props
}) => {
  // Size configuration
  const switchSizes = {
    base: {
      container: "w-12 h-6",
      thumb: "w-5 h-5",
      thumbOn: "right-0.5",
      thumbOff: "left-0.5",
      iconSize: 12,
    },
    lg: {
      container: "w-14 h-7",
      thumb: "w-6 h-6",
      thumbOn: "right-0.5",
      thumbOff: "left-0.5",
      iconSize: 16,
    },
  };

  const activeStyles = value
    ? "bg-neutral-900 border-neutral-400"
    : "bg-white border-primary-200";

  const disabledStyles = disabled ? "opacity-50" : "";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (!disabled && onValueChange) {
          onValueChange(!value);
        }
      }}
      disabled={disabled}
      className={`relative ${switchSizes[size].container} rounded-full border ${activeStyles} ${disabledStyles}`}
      {...props}
    >
      <View
        className={`absolute ${
          switchSizes[size].thumb
        } rounded-full bg-white top-0.5 ${
          value ? switchSizes[size].thumbOn : switchSizes[size].thumbOff
        } items-center justify-center shadow`}
      >
        <MaterialIcons
          name={value ? iconOn : iconOff}
          size={switchSizes[size].iconSize}
          color={value ? "#3E3E3E" : "#233D90"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default IconSwitch;
