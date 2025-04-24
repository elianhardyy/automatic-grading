import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { fonts } from "../../utils/font";

// Enable LayoutAnimation untuk Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(
    new Animated.Value(initiallyExpanded ? 1 : 0)
  ).current;

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

  // Mengkonfigurasi animasi
  useEffect(() => {
    if (collapsible) {
      // Menggunakan LayoutAnimation untuk transisi yang lebih halus
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // Animasi untuk rotasi ikon
      Animated.timing(animatedHeight, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded]);

  const toggleExpand = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  // Membuat animasi untuk rotasi ikon
  const iconRotation = animatedHeight.interpolate({
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
          <Text
            className="font-bold text-neutral-800"
            style={fonts.ecTextHeader2M}
          >
            {title}
          </Text>
        </View>

        {collapsible && (
          <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7}>
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

      {/* Card Body - Menggunakan height: 0 dan overflow: hidden untuk collapse */}
      {expanded || !collapsible ? (
        <View ref={contentRef}>
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
        </View>
      ) : null}
    </View>
  );
};

export default Card;
