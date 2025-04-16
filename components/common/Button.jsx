import React from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { fonts } from "../../utils/font";

const VARIANTS = {
  primary: "bg-primary-500 border-primary-600",
  secondary: "bg-secondary-500 border-secondary-600",
  tertiary: "bg-tertiary-500 border-tertiary-600",
  info: "bg-info-500 border-info-600",
  success: "bg-success-500 border-success-600",
  warning: "bg-warning-500 border-warning-600",
  alert: "bg-alert-500 border-alert-600",
  goingdark: "bg-goingdark-500 border-goingdark-600",
  neutral: "bg-neutral-500 border-neutral-600",
  // New variants
  base: "bg-neutral-100 border-neutral-200",
  outlined: "bg-transparent",
  text: "bg-transparent border-transparent",
};

const TEXT_VARIANTS = {
  primary: "text-white",
  secondary: "text-white",
  tertiary: "text-neutral-900",
  info: "text-white",
  success: "text-white",
  warning: "text-neutral-900",
  alert: "text-white",
  goingdark: "text-white",
  neutral: "text-white",
  // New text variants
  base: "text-neutral-800",
  outlined: "text-primary-500",
  text: "text-primary-500",
};

// Border styles for outlined variants
const BORDER_VARIANTS = {
  primary: "border-primary-500",
  secondary: "border-secondary-500",
  tertiary: "border-tertiary-500",
  info: "border-info-500",
  success: "border-success-500",
  warning: "border-warning-500",
  alert: "border-alert-500",
  goingdark: "border-goingdark-500",
  neutral: "border-neutral-500",
};

const Button = ({
  title,
  onPress,
  variant = "",
  type = "base", // base, outlined, text
  color = "primary", // primary, secondary, tertiary, etc.
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  textClassName = "",
  icon = null,
  iconPosition = "left",
  ...props
}) => {
  let variantClass;
  let textVariantClass;

  if (type === "outlined") {
    variantClass = `bg-transparent ${
      BORDER_VARIANTS[color] || BORDER_VARIANTS.primary
    }`;
    textVariantClass = `text-${color}-500`;
  } else if (type === "text") {
    variantClass = "bg-transparent border-transparent";
    textVariantClass = `text-${color}-500`;
  } else {
    variantClass = VARIANTS[variant] || VARIANTS.primary;
    textVariantClass = TEXT_VARIANTS[variant] || TEXT_VARIANTS.primary;
  }

  const baseClasses =
    "py-3 px-4 rounded-lg border flex flex-row justify-center items-center";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50" : "";

  const typeSpecificClasses = type === "text" ? "py-2 px-3" : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${typeSpecificClasses} ${widthClass} ${disabledClass} ${variantClass} ${className}`}
      {...props}
    >
      <View className="flex flex-row items-center justify-center">
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              type === "outlined" || type === "text"
                ? `#233D90`
                : variant === "warning" ||
                  variant === "tertiary" ||
                  variant === "base"
                ? "#202020"
                : "#FFFFFF"
            }
          />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <View className="mr-2">{icon}</View>
            )}

            <Text
              className={`font-medium text-center ${textVariantClass} ${textClassName}`}
              style={fonts.ecTextBody2}
            >
              {title}
            </Text>

            {icon && iconPosition === "right" && (
              <View className="ml-2">{icon}</View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
