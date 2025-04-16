import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

const PointSlider = ({
  min = 0,
  max = 100,
  step = 10,
  value = 50,
  onValueChange,
  disabled = false,
  showPoints = true,
  ...props
}) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    // Generate points based on min, max, and step
    const pointsArray = [];
    for (let i = min; i <= max; i += step) {
      pointsArray.push(i);
    }
    setPoints(pointsArray);
  }, [min, max, step]);

  return (
    <View className="w-full">
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        minimumTrackTintColor="#233D90"
        maximumTrackTintColor="#E1E1E1"
        thumbTintColor="#233D90"
        {...props}
      />

      {showPoints && (
        <View className="flex-row justify-between mt-1">
          {points.map((point) => (
            <View key={point} className="items-center">
              <View className="h-1 w-1 bg-neutral-400 rounded-full" />
              <Text className="text-xs text-neutral-500">{point}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default PointSlider;
