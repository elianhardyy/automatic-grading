import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { fonts } from "../../utils/font";
import { profileService } from "../../services/slice/profileService";
import InputGroup from "../../components/common/InputGroup";
import { API_URL } from "../../constant/uri";
import EditProfileForm from "../../components/profile/EditProfileForm";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const [image, setImage] = useState(profile?.profilePicture || null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    dispatch(profileService.profileTrainer());
  }, [dispatch]);

  const handleUpdateProfilePicture = async (imageUri) => {
    try {
      setImageUploading(true);

      const formData = new FormData();
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("image", {
        uri: imageUri,
        name: `profile-picture.${fileType}`,
        type: `image/${fileType}`,
      });
      await dispatch(updateProfilePicture(formData)).unwrap();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || "Failed to update profile picture"
      );
    } finally {
      setImageUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        await handleUpdateProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image");
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera access is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        await handleUpdateProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Change Profile Photo", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-100">
        <ActivityIndicator size="large" color="#233D90" />
        <Text style={fonts.ecTextBody2} className="mt-4 text-neutral-600">
          Memuat profil...
        </Text>
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-100 p-4">
        <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
        <Text
          style={fonts.ecTextSubtitle1}
          className="text-alert-500 mt-2 mb-4 text-center"
        >
          Gagal memuat profil
        </Text>
        <Text
          style={fonts.ecTextBody2}
          className="text-neutral-600 mb-6 text-center"
        >
          {error.message || "Terjadi kesalahan saat memuat data profil."}
        </Text>
        <Button
          title="Coba Lagi"
          onPress={() => dispatch(profileService.profileTrainer())}
          variant="primary"
          icon={<MaterialIcons name="refresh" size={18} color="white" />}
          iconPosition="left"
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-100">
      <View className="bg-primary-500 p-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={fonts.ecTextHeader2} className="text-white">
            Edit Profile
          </Text>
        </View>
      </View>

      <View className="px-4 mt-4 mb-4">
        <Card
          variant="neutral"
          title="Profile Photo"
          icon={<MaterialIcons name="photo-camera" size={20} color="#233D90" />}
          collapsible={false}
          className="shadow-md"
        >
          <View className="items-center my-4">
            <TouchableOpacity
              onPress={showImageOptions}
              disabled={imageUploading}
            >
              <View className="relative">
                {imageUploading ? (
                  <View className="w-28 h-28 rounded-full bg-neutral-200 justify-center items-center">
                    <ActivityIndicator size="large" color="#233D90" />
                  </View>
                ) : !image ? (
                  <View className="w-28 h-28 rounded-full bg-primary-300 justify-center items-center">
                    <Text
                      className="text-white text-4xl font-extrabold"
                      style={fonts.ecTextBody1}
                    >
                      {profile?.username
                        ? profile.username.charAt(0).toUpperCase()
                        : "T"}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={{
                      uri: `${API_URL}/profile/picture/${image}`,
                    }}
                    className="w-28 h-28 rounded-full"
                  />
                )}

                <View className="absolute right-0 bottom-0 bg-primary-500 p-2 rounded-full">
                  <MaterialIcons name="edit" size={18} color="white" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={fonts.ecTextBody3} className="text-neutral-500 mt-2">
              {imageUploading
                ? "Uploading profile photo..."
                : "Tap to change your profile photo"}
            </Text>
          </View>
        </Card>
      </View>

      <EditProfileForm
        profile={profile}
        loading={loading}
        navigation={navigation}
        image={image}
        imageUploading={imageUploading}
      />
    </ScrollView>
  );
};

export default EditProfileScreen;
