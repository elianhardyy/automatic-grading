import React from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";

const ProfileScreen = () => {
  // Mock user data - replace with actual user data from your auth context/state
  const userData = {
    name: "Elian Hardiawan",
    email: "elianhardiawan@example.com",
    username: "elianhardiawan",
    batch: ["Frontend Batch 12", "Torvalds"],
    role: "Trainer",
    joinDate: "January 2025",
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Apakah anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            // Handle logout action here
            console.log("User logged out");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log("Navigate to edit profile");
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    console.log("Navigate to change password");
  };

  const handleAboutApp = () => {
    // Navigate to about app screen
    console.log("Navigate to about app info");
  };

  return (
    <ScrollView className="flex-1 bg-neutral-100 mt-5">
      {/* Profile Header */}
      <View className="bg-primary-500 p-6 pb-20">
        <Text style={fonts.ecTextHeader2} className="text-white mb-2">
          Profile
        </Text>
      </View>

      {/* Profile Card - Overlaps with header */}
      <View className="px-4 -mt-16 mb-4">
        <Card
          variant="neutral"
          title="Informasi Pribadi"
          icon={<MaterialIcons name="person" size={20} color="#233D90" />}
          collapsible={false}
          className="shadow-md"
        >
          <View className="flex-row mb-6">
            <View className="mr-4">
              <Image
                source={{
                  uri: "https://i.pinimg.com/originals/8d/fe/e4/8dfee48fe9f54aafcf28839354db84fb.jpg",
                }}
                className="w-20 h-20 rounded-full"
              />
            </View>
            <View className="flex-1 justify-center">
              <Text style={fonts.ecTextSubtitle1} className="text-neutral-800">
                {userData.name}
              </Text>
              <Text
                style={fonts.ecTextBody2}
                className="text-primary-500 font-bold"
              >
                {userData.role}
              </Text>
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mt-1">
                Bergabung sejak {userData.joinDate}
              </Text>
            </View>
          </View>

          <View className="border-t border-neutral-200 pt-4">
            <View className="mb-4">
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                Username
              </Text>
              <Text style={fonts.ecTextBody2} className="text-neutral-800">
                {userData.username}
              </Text>
            </View>

            <View className="mb-4">
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                Email
              </Text>
              <Text style={fonts.ecTextBody2} className="text-neutral-800">
                {userData.email}
              </Text>
            </View>

            <View>
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                Batch yang Diampu
              </Text>
              {userData.batch.map((batch, index) => (
                <View key={index} className="flex-row items-center mb-1">
                  <MaterialIcons name="school" size={16} color="#546881" />
                  <Text
                    style={fonts.ecTextBody2}
                    className="text-neutral-800 ml-2"
                  >
                    {batch}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-4">
            <Button
              title="Edit Profil"
              onPress={handleEditProfile}
              variant="primary"
              icon={<MaterialIcons name="edit" size={18} color="white" />}
              iconPosition="left"
              className="mb-3"
            />
          </View>
        </Card>
      </View>

      {/* Account Settings */}
      <View className="px-4 mb-4">
        <Card
          variant="neutral"
          title="Akun & Keamanan"
          icon={<MaterialIcons name="security" size={20} color="#233D90" />}
          collapsible={false}
          className="shadow-md"
        >
          <Button
            title="Ganti Password"
            onPress={handleChangePassword}
            variant="neutral"
            type="outlined"
            icon={<MaterialIcons name="lock" size={18} color="#546881" />}
            iconPosition="left"
            className="mb-3"
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="alert"
            icon={<MaterialIcons name="logout" size={18} color="white" />}
            iconPosition="left"
          />
        </Card>
      </View>

      {/* About App (Optional) */}
      <View className="px-4 mb-8">
        <Card
          variant="neutral"
          title="Tentang Aplikasi"
          icon={<MaterialIcons name="info" size={20} color="#233D90" />}
          collapsible={true}
          initiallyExpanded={false}
          className="shadow-md"
        >
          <Button
            title="Info & Bantuan"
            onPress={handleAboutApp}
            variant="info"
            type="text"
            icon={<MaterialIcons name="help" size={18} color="#4888D3" />}
            iconPosition="left"
            className="mb-2"
          />

          <View className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
              Versi Aplikasi
            </Text>
            <Text style={fonts.ecTextBody2} className="text-neutral-800">
              1.0.0
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
