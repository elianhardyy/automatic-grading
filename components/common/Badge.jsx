import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts } from "../../utils/font"; // Import the font styles

/**
 * Badge Component for React Native
 * @param {object} props - Component props
 * @param {string} props.text - Text to display in the badge
 * @param {string} props.size - Size of the badge ('small', 'medium', 'large')
 * @param {string} props.color - Color theme of the badge ('primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'alert', 'neutral', 'goingdark')
 * @param {string} props.variant - Badge variant ('filled', 'outlined')
 * @param {object} props.style - Additional style for the badge container
 * @param {object} props.textStyle - Additional style for the badge text
 * @param {string} props.customColor - Custom background color (overrides color prop)
 * @param {string} props.customTextColor - Custom text color
 * @returns {JSX.Element}
 */
const Badge = ({
  text,
  size = "medium",
  color = "primary",
  variant = "filled",
  style,
  textStyle,
  customColor,
  customTextColor,
}) => {
  // Get sizing styles
  const sizeStyles = getBadgeSize(size);

  // Get color styles
  const colorStyles = getBadgeColors(
    color,
    variant,
    customColor,
    customTextColor
  );

  return (
    <View
      style={[styles.badge, sizeStyles.container, colorStyles.container, style]}
    >
      <Text
        style={[
          variant === "outlined" ? fonts.ecTextBody3 : fonts.ecTextBody3M,
          sizeStyles.text,
          colorStyles.text,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
};

/**
 * Get badge size styles based on size prop
 */
const getBadgeSize = (size) => {
  switch (size) {
    case "small":
      return {
        container: {
          paddingVertical: 2,
          paddingHorizontal: 6,
          borderRadius: 4,
        },
        text: {
          ...fonts.ecTextBody3M,
        },
      };
    case "large":
      return {
        container: {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
        },
        text: {
          ...fonts.ecTextBody2M,
        },
      };
    case "medium":
    default:
      return {
        container: {
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 6,
        },
        text: {
          ...fonts.ecTextBody3,
        },
      };
  }
};

/**
 * Get badge color styles based on color prop and variant
 */
const getBadgeColors = (color, variant, customColor, customTextColor) => {
  // Color palette from tailwind.config.js
  const colors = {
    primary: {
      bg: "#233D90",
      text: "#FFFFFF",
      border: "#233D90",
    },
    secondary: {
      bg: "#FF6B18",
      text: "#FFFFFF",
      border: "#FF6B18",
    },
    tertiary: {
      bg: "#FFF503",
      text: "#000000",
      border: "#FFF503",
    },
    info: {
      bg: "#4888D3",
      text: "#FFFFFF",
      border: "#4888D3",
    },
    success: {
      bg: "#43936C",
      text: "#FFFFFF",
      border: "#43936C",
    },
    warning: {
      bg: "#FFB800",
      text: "#000000",
      border: "#FFB800",
    },
    alert: {
      bg: "#CB3A31",
      text: "#FFFFFF",
      border: "#CB3A31",
    },
    neutral: {
      bg: "#757575",
      text: "#FFFFFF",
      border: "#757575",
    },
    goingdark: {
      bg: "#546881",
      text: "#FFFFFF",
      border: "#546881",
    },
  };

  const selectedColor = colors[color] || colors.primary;

  if (variant === "outlined") {
    return {
      container: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: customColor || selectedColor.border,
      },
      text: {
        color: customTextColor || selectedColor.border,
      },
    };
  } else {
    return {
      container: {
        backgroundColor: customColor || selectedColor.bg,
      },
      text: {
        color: customTextColor || selectedColor.text,
      },
    };
  }
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Badge;
