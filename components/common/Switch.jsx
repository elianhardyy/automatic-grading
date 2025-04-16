import React, { useState } from "react";
import { Switch } from "react-native";

const CustomSwitch = ({
  value = false,
  onValueChange,
  disabled = false,
  size = "base", // base, lg
  trackColor = {
    false: "#E1E1E1",
    true: "#233D90",
  },
  thumbColor = {
    false: "#FFFFFF",
    true: "#FFFFFF",
  },
  ...props
}) => {
  // Size variations - adjusting in parent component
  const sizeStyle = {
    base: { transform: [{ scale: 1 }] },
    lg: { transform: [{ scale: 1.2 }] },
  };

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={trackColor}
      thumbColor={value ? thumbColor.true : thumbColor.false}
      ios_backgroundColor="#E1E1E1"
      style={sizeStyle[size]}
      {...props}
    />
  );
};

export default CustomSwitch;
