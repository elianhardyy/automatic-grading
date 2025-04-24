import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Select = ({
  placeholder = "Select Options",
  options = [],
  value = null,
  onValueChange,
  disabled = false,
  variant = "base", // base, rounded, underline
  ...props
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const variantStyles = {
    base: "border border-neutral-300 bg-white p-2",
    rounded: "border border-neutral-300 bg-white p-2 rounded-lg",
    underline: "border-b border-neutral-300 bg-white p-2",
  };

  const stateStyles = disabled ? "bg-neutral-100 text-neutral-400" : "";

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setModalVisible(true)}
        className={`w-full flex-row justify-between items-center ${variantStyles[variant]} ${stateStyles}`}
        {...props}
      >
        <Text
          className={`${
            !selectedOption ? "text-neutral-400" : "text-neutral-800"
          }`}
        >
          {displayText}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#757575" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white rounded-t-lg">
            <View className="p-4 border-b border-neutral-200 flex-row justify-between items-center">
              <Text className="text-lg font-medium">{placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#202020" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-neutral-100 ${
                    item.value === value ? "bg-primary-50" : ""
                  }`}
                  onPress={() => {
                    if (onValueChange) onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    className={`${
                      item.value === value
                        ? "text-primary-500 font-medium"
                        : "text-neutral-800"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Select;
