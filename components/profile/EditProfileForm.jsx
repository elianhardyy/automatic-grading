import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import Card from "../common/Card";
import Button from "../common/Button";
import InputGroup from "../common/InputGroup";
import { fonts } from "../../utils/font";
import {
  profileService,
  setProfilePicture,
} from "../../services/slice/profileService";

const EditProfileForm = ({
  profile,
  loading,
  navigation,
  image,
  imageUploading,
}) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [name, setName] = useState(profile?.name);
  const [address, setAddress] = useState(profile?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    address: false,
    phoneNumber: false,
  });

  useEffect(() => {
    validateField();
  }, [name, address, phoneNumber]);

  const validateField = (fieldName = null) => {
    const newErrors = { ...errors };
    if (fieldName === "name" || (fieldName === null && touchedFields.name)) {
      if (!name.trim()) {
        newErrors.name = "Name is required";
      } else {
        delete newErrors.name;
      }
    }
    if (
      fieldName === "address" ||
      (fieldName === null && touchedFields.address)
    ) {
      if (!address.trim()) {
        newErrors.address = "Address is required";
      } else {
        delete newErrors.address;
      }
    }
    if (
      fieldName === "phoneNumber" ||
      (fieldName === null && touchedFields.phoneNumber)
    ) {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\d+$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be numeric";
      } else if (!/^\d{10,15}$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be between 10 to 15 digits";
      } else {
        delete newErrors.phoneNumber;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
    validateField(fieldName);
  };

  const validate = () => {
    setTouchedFields({
      name: true,
      address: true,
      phoneNumber: true,
    });
    return validateField();
  };

  const handleUpdateProfile = () => {
    if (image) {
      dispatch(setProfilePicture(image));
    }
    if (validate()) {
      const profileData = {
        name,
        address,
        phoneNumber,
      };
      //const splitImageUri = image.split("/").pop();
      //dispatch(setProfilePicture(splitImageUri));

      dispatch(profileService.updateProfile(profileData));
      navigation.goBack();
    }
  };

  return (
    <>
      <View className="px-4 mb-4">
        <Card
          variant="neutral"
          title="Personal Information"
          icon={<MaterialIcons name="person" size={20} color="#233D90" />}
          collapsible={false}
          className="shadow-md"
        >
          <View className="mb-4">
            <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-1">
              Name
            </Text>
            <InputGroup
              placeholder="Name"
              value={name}
              onChangeText={setName}
              variant="rounded"
              onBlur={() => handleFieldBlur("name")}
              error={touchedFields.name ? errors.name : undefined}
              iconPosition="left"
              prefixIcon="person"
            />
          </View>

          <View className="mb-4">
            <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-1">
              Address
            </Text>
            <InputGroup
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              variant="rounded"
              onBlur={() => handleFieldBlur("address")}
              error={touchedFields.address ? errors.address : undefined}
              iconPosition="left"
              prefixIcon="home"
            />
          </View>

          <View className="mb-4">
            <Text style={fonts.ecTextBody2} className="text-neutral-700 mb-1">
              Phone Number
            </Text>
            <InputGroup
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              variant="rounded"
              keyboardType="phone-pad"
              onBlur={() => handleFieldBlur("phoneNumber")}
              error={touchedFields.phoneNumber ? errors.phoneNumber : undefined}
              iconPosition="left"
              prefixIcon="phone"
              isPhoneNumber={true}
              maxLength={15}
              minLength={10}
            />
          </View>
        </Card>
      </View>

      <View className="px-4 mb-8">
        <Button
          title={loading ? "Loading..." : "Save Changes"}
          onPress={handleUpdateProfile}
          variant="primary"
          disabled={loading || imageUploading}
          icon={<MaterialIcons name="save" size={18} color="white" />}
          iconPosition="left"
          className="mb-3"
        />

        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="neutral"
          type="outlined"
          disabled={imageUploading}
          icon={<MaterialIcons name="close" size={18} color="#546881" />}
          iconPosition="left"
        />
      </View>
    </>
  );
};

export default EditProfileForm;
