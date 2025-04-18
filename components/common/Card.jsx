import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const Card = ({
  imageSource,
  imageAlt = "card-image",
  title,
  description,
  footer,
  action,
  icon,
  collapsible = true,
  variant = "primary",
  className = "",
  initiallyExpanded = true,
  ...props
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const variantClasses = {
    primary: "border-primary-200 bg-neutral-50",
    secondary: "border-secondary-200 bg-neutral-50",
    tertiary: "border-tertiary-200 bg-neutral-50",
    info: "border-info-200 bg-neutral-50",
    success: "border-success-200 bg-neutral-50",
    warning: "border-warning-200 bg-neutral-50",
    alert: "border-alert-200 bg-neutral-50",
    goingdark: "border-goingdark-200 bg-neutral-50",
    neutral: "border-neutral-200 bg-neutral-50",
  };

  const variantClass = variantClasses[variant] || variantClasses.neutral;

  const toggleExpand = () => {
    if (collapsible) {
      Animated.timing(animation, {
        toValue: expanded ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      setExpanded(!expanded);
    }
  };

  // Ini akan membuat animasi untuk height content
  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, "auto"],
  });

  const iconRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      className={`rounded-lg shadow border overflow-hidden ${variantClass} mb-4 ${className}`}
      {...props}
    >
      {/* Card Header with Title and Toggle */}
      <View className="flex-row justify-between items-center p-3 border-b border-neutral-200">
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className="font-bold text-lg text-neutral-800">{title}</Text>
        </View>

        {collapsible && (
          <TouchableOpacity onPress={toggleExpand}>
            <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
              <FontAwesome name="chevron-down" size={16} color="#757575" />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      {/* Card Figure/Image */}
      {imageSource && (
        <View>
          <Image
            source={imageSource}
            accessibilityLabel={imageAlt}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Card Body - Animated for expand/collapse */}
      <Animated.View
        style={{
          height: collapsible ? bodyHeight : "auto",
          overflow: "hidden",
        }}
      >
        {/* Card Content */}
        <View className="p-4">
          {description && (
            <Text className="text-neutral-700 mb-2">{description}</Text>
          )}

          {props.children}
        </View>

        {/* Card Footer */}
        {footer && (
          <View className="px-4 py-3 border-t border-neutral-200">
            {footer}
          </View>
        )}

        {/* Card Action */}
        {action && <View className="px-4 py-3 bg-neutral-100">{action}</View>}
      </Animated.View>
    </View>
  );
};

export default Card;
