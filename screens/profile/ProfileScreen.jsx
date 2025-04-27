import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";
import {
  getProfilePicture,
  getProfilePictureByURI,
  profileTrainer,
} from "../../redux/slice/profile";
import { logoutUser } from "../../redux/slice/auth";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../constant/uri";

const Skeleton = ({ width = "100%", height = 20, radius = 6, style }) => (
  <MotiView
    style={[
      {
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E0E0E0",
      },
      style,
    ]}
    from={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: "timing",
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      repeatReverse: true,
    }}
  />
);

const SkeletonCard = () => (
  <View className="rounded-lg shadow border overflow-hidden border-neutral-200 bg-neutral-50 mb-4">
    <View className="flex-row justify-between items-center p-3 border-b border-neutral-200">
      <View className="flex-row items-center">
        <Skeleton
          width={20}
          height={20}
          radius={4}
          style={{ marginRight: 8 }}
        />
        <Skeleton width="60%" height={22} radius={4} />
      </View>
    </View>

    <View className="p-4">
      <View className="flex-row mb-6">
        <Skeleton
          width={80}
          height={80}
          radius={40}
          style={{ marginRight: 16 }}
        />
        <View className="flex-1 justify-center">
          <Skeleton
            width="70%"
            height={24}
            radius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton
            width="40%"
            height={16}
            radius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width="50%" height={14} radius={4} />
        </View>
      </View>

      <View className="border-t border-neutral-200 pt-4">
        {/* Multiple information fields */}
        {[...Array(5)].map((_, index) => (
          <View key={index} className="mb-4">
            <Skeleton
              width={`${20 + Math.random() * 15}%`}
              height={14}
              radius={4}
              style={{ marginBottom: 8 }}
            />
            <Skeleton
              width={`${50 + Math.random() * 30}%`}
              height={18}
              radius={4}
            />
          </View>
        ))}
      </View>

      <View className="mt-4">
        <Skeleton width="100%" height={48} radius={8} />
      </View>
    </View>
  </View>
);

const SkeletonButtonCard = () => (
  <View className="rounded-lg shadow border overflow-hidden border-neutral-200 bg-neutral-50 mb-4">
    <View className="flex-row justify-between items-center p-3 border-b border-neutral-200">
      <View className="flex-row items-center">
        <Skeleton
          width={20}
          height={20}
          radius={4}
          style={{ marginRight: 8 }}
        />
        <Skeleton width="70%" height={22} radius={4} />
      </View>
    </View>
    <View className="p-4">
      <Skeleton
        width="100%"
        height={48}
        radius={8}
        style={{ marginBottom: 12 }}
      />
      <Skeleton width="100%" height={48} radius={8} />
    </View>
  </View>
);

const SkeletonInfoCard = () => (
  <View className="rounded-lg shadow border overflow-hidden border-neutral-200 bg-neutral-50 mb-4">
    <View className="flex-row justify-between items-center p-3 border-b border-neutral-200">
      <View className="flex-row items-center">
        <Skeleton
          width={20}
          height={20}
          radius={4}
          style={{ marginRight: 8 }}
        />
        <Skeleton width="60%" height={22} radius={4} />
      </View>
      <Skeleton width={16} height={16} radius={8} />
    </View>
    <View className="p-4">
      <Skeleton
        width="100%"
        height={48}
        radius={8}
        style={{ marginBottom: 12 }}
      />
      <View className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <Skeleton
          width="30%"
          height={14}
          radius={4}
          style={{ marginBottom: 8 }}
        />
        <Skeleton width="20%" height={18} radius={4} />
      </View>
    </View>
  </View>
);

const ProfileSkeletonScreen = () => (
  <ScrollView className="flex-1 bg-neutral-100 mt-5">
    <View className="bg-primary-500 p-6 pb-20">
      <Skeleton width="30%" height={32} radius={4} />
    </View>

    <View className="px-4 -mt-16 mb-4">
      <SkeletonCard />
    </View>

    <View className="px-4 mb-4">
      <SkeletonButtonCard />
    </View>

    <View className="px-4 mb-8">
      <SkeletonInfoCard />
    </View>
  </ScrollView>
);

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const [imageURI, setImageURI] = useState(null);

  useEffect(() => {
    dispatch(profileTrainer());
  }, [dispatch, profile?.picture]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            dispatch(logoutUser());
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  const handleAboutApp = () => {
    console.log("Navigate to about app info");
  };

  if (loading && !profile) {
    return <ProfileSkeletonScreen />;
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
          onPress={() => dispatch(profileTrainer())}
          variant="primary"
          icon={<MaterialIcons name="refresh" size={18} color="white" />}
          iconPosition="left"
        />
      </View>
    );
  }

  const renderProfileImage = () => {
    const pictureUrl = profile?.picture || profile?.profilePicture;
    if (loadingPicture) {
      return <Skeleton width={80} height={80} radius={40} />;
    }
    if (pictureUrl) {
      return (
        <Image
          source={{ uri: `${API_URL}/profile/picture/${pictureUrl}` }}
          className="w-20 h-20 rounded-full border-4 border-white bg-neutral-200" // Add white border for contrast
          resizeMode="cover"
        />
      );
    }
    const initials = profile?.name
      ? profile.name.charAt(0).toUpperCase()
      : profile?.username
      ? profile.username.charAt(0).toUpperCase()
      : "?";
    return (
      <View className="w-20 h-20 rounded-full bg-primary-400 justify-center items-center border-4 border-white">
        <Text
          className="text-white text-4xl font-bold"
          style={{ includeFontPadding: false }}
        >
          {initials}
        </Text>
      </View>
    );
  };

  const InfoRow = ({ label, value, iconName }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={14}
            color="#757575"
            style={{ marginRight: 4 }}
          />
        )}
        <Text style={fonts.ecTextBody3} className="text-neutral-500">
          {label}
        </Text>
      </View>
      <Text style={fonts.ecTextBody2} className="text-neutral-800 ml-1">
        {value || "-"}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-neutral-100 mt-5">
      <View className="bg-primary-500 p-6 pb-20">
        <Text style={fonts.ecTextHeader2} className="text-white mb-2">
          Profile
        </Text>
      </View>

      <View className="px-4 -mt-16 mb-4">
        <Card
          variant="neutral"
          title="Personal Information"
          icon={<MaterialIcons name="person" size={20} color="#233D90" />}
          collapsible={false}
          className="shadow-md"
        >
          <View className="flex-row mb-6">
            <View className="mr-4">
              {!profile?.profilePicture ? (
                <View className="w-20 h-20 rounded-full bg-primary-300 justify-center items-center mr-3">
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
                    uri: `${API_URL}/profile/picture/${
                      profile?.profilePicture || profile?.picture
                    }`,
                  }}
                  className="w-20 h-20 rounded-full"
                />
              )}
            </View>
            <View className="flex-1 justify-center">
              <Text style={fonts.ecTextSubtitle1} className="text-neutral-800">
                {profile?.name || "-"}
              </Text>
              <Text
                style={fonts.ecTextBody2}
                className="text-primary-500 font-bold"
              >
                {profile?.role || "Peran tidak tersedia"}
              </Text>
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mt-1">
                {profile?.joinDate ? `Bergabung sejak ${profile.joinDate}` : ""}
              </Text>
            </View>
          </View>

          <View className="border-t border-neutral-200 pt-4">
            <View className="mb-4">
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                username
              </Text>
              <Text style={fonts.ecTextBody2} className="text-neutral-800">
                {profile?.username ? profile?.username : "-"}
              </Text>
            </View>

            <View className="mb-4">
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                Email
              </Text>
              <Text style={fonts.ecTextBody2} className="text-neutral-800">
                {profile?.email ? profile?.email : "-"}
              </Text>
            </View>

            {profile?.role === "Trainer" &&
              profile?.batch &&
              profile.batch.length > 0 && (
                <View>
                  <Text
                    style={fonts.ecTextBody3}
                    className="text-neutral-500 mb-1"
                  >
                    Batch yang Diampu
                  </Text>
                  {profile.batch.map((batch, index) => (
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
              )}

            <View className="mb-4">
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                Address
              </Text>
              <Text style={fonts.ecTextBody2} className="text-neutral-800">
                {profile?.address ? profile?.address : "-"}
              </Text>
            </View>

            <View className="mb-4">
              <Text style={fonts.ecTextBody3} className="text-neutral-500 mb-1">
                Phone Number
              </Text>
              <Text style={fonts.ecTextBody2} className="text-neutral-800">
                {profile?.phoneNumber ? profile?.phoneNumber : "-"}
              </Text>
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

      <View className="px-4 mb-4">
        <Card
          variant="neutral"
          title="Account & Security"
          icon={<MaterialIcons name="security" size={20} color="#233D90" />}
          collapsible={false}
          className="shadow-md"
        >
          <Button
            title="Change Password"
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

      <View className="px-4 mb-8">
        <Card
          variant="neutral"
          title="Application Info"
          icon={<MaterialIcons name="info" size={20} color="#233D90" />}
          collapsible={true}
          initiallyExpanded={false}
          className="shadow-md"
        >
          <Button
            title="Info & Help"
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
