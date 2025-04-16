import React from "react";

const VARIANTS = {
  info: "bg-info-50 border-info-500",
  success: "bg-success-50 border-success-500",
  warning: "bg-warning-50 border-warning-500",
  alert: "bg-alert-50 border-alert-500",
  primary: "bg-primary-50 border-primary-500",
  secondary: "bg-secondary-50 border-secondary-500",
  tertiary: "bg-tertiary-50 border-tertiary-500",
};

const TEXT_VARIANTS = {
  info: "text-info-800",
  success: "text-success-800",
  warning: "text-warning-800",
  alert: "text-alert-800",
  primary: "text-primary-800",
  secondary: "text-secondary-800",
  tertiary: "text-tertiary-800",
};
const Alert = ({
  title,
  message,
  variant = "info",
  onClose,
  className = "",
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.info;
  const textVariantClass = TEXT_VARIANTS[variant] || TEXT_VARIANTS.info;
  return (
    <View
      className={`border-l-4 p-4 rounded-r-lg mb-4 ${variantClass} ${className}`}
      {...props}
    >
      <View className="flex flex-row justify-between items-start">
        {title && (
          <Text className={`font-bold ${textVariantClass}`}>{title}</Text>
        )}
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Text className={`font-bold ${textVariantClass}`}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      {message && <Text className={`mt-1 ${textVariantClass}`}>{message}</Text>}
    </View>
  );
};

export default Alert;
