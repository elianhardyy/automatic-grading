import React from "react";
import { TextInput } from "react-native";

const TextArea = ({
  placeholder = "Textarea",
  value = "",
  onChangeText,
  disabled = false,
  readonly = false,
  variant = "base", // base, rounded, underline
  rows = 5,
  className = "",
  ...props
}) => {
  const variantStyles = {
    base: "border border-neutral-300 bg-white p-2",
    rounded: "border border-neutral-300 bg-white p-2 rounded-lg",
    underline: "border-b border-neutral-300 bg-white p-2",
  };

  const stateStyles = disabled ? "bg-neutral-100 text-neutral-400" : "";

  return (
    <TextInput
      className={`w-full ${variantStyles[variant]} ${stateStyles} ${className}`}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={!disabled && !readonly}
      placeholderTextColor="#9A9A9A"
      multiline
      numberOfLines={rows}
      textAlignVertical="top"
      {...props}
    />
  );
};

export default TextArea;
