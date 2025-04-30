import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert as RNAlert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { fonts } from "../../utils/font";
import { profileService } from "../../services/slice/profileService";
import { authService } from "../../services/slice/authService";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { API_URL } from "../../constant/uri";

const Skeleton = ({ width = "100%", height = 20, radius = 6, style }) => (
  <MotiView
    style={[
      {
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E1E1E1",
      },
      style,
    ]}
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: "timing",
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    }}
  />
);

const SkeletonCard = ({ children, titleWidth = "60%" }) => (
  <View className="rounded-xl shadow-sm border border-neutral-200 bg-white mb-4 overflow-hidden">
    <View className="flex-row justify-between items-center p-3 border-b border-neutral-100">
      <View className="flex-row items-center">
        <Skeleton
          width={20}
          height={20}
          radius={4}
          style={{ marginRight: 8 }}
        />
        <Skeleton width={titleWidth} height={18} radius={4} />
      </View>
    </View>
    <View className="p-4">{children}</View>
  </View>
);

const ProfileSkeletonScreen = () => (
  <SafeAreaView className="flex-1 bg-neutral-100">
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="bg-primary-500 p-6 pb-24">
        <Skeleton width="40%" height={28} radius={6} />
      </View>

      <View className="px-4 -mt-20">
        <SkeletonCard titleWidth="50%">
          <View className="flex-row mb-5">
            <Skeleton
              width={80}
              height={80}
              radius={40}
              style={{ marginRight: 16 }}
            />
            <View className="flex-1 justify-center space-y-2.5">
              <Skeleton width="80%" height={22} radius={4} />
              <Skeleton width="50%" height={16} radius={4} />
              <Skeleton width="60%" height={14} radius={4} />
            </View>
          </View>
          <View className="border-t border-neutral-100 pt-4 space-y-4">
            {[...Array(4)].map((_, index) => (
              <View key={index}>
                <Skeleton
                  width={`${30 + Math.random() * 20}%`}
                  height={12}
                  radius={3}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton
                  width={`${60 + Math.random() * 30}%`}
                  height={16}
                  radius={4}
                />
              </View>
            ))}
            <View className="pt-2">
              <Skeleton width="100%" height={48} radius={8} />
            </View>
          </View>
        </SkeletonCard>

        <SkeletonCard titleWidth="60%">
          <View className="space-y-3">
            <Skeleton width="100%" height={48} radius={8} />
            <Skeleton width="100%" height={48} radius={8} />
          </View>
        </SkeletonCard>

        <SkeletonCard titleWidth="55%">
          <Skeleton
            width="100%"
            height={40}
            radius={8}
            style={{ marginBottom: 12 }}
          />
          <View className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
            <Skeleton
              width="40%"
              height={12}
              radius={3}
              style={{ marginBottom: 6 }}
            />
            <Skeleton width="25%" height={16} radius={4} />
          </View>
        </SkeletonCard>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    profile,
    loading,
    error,
    loadingPicture,
    pictureTrainer,
    profileTrainerData,
  } = useSelector((state) => state.profile);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!profile && !loading) {
      dispatch(profileService.profileTrainer());
    }
  }, [dispatch, profile, loading, pictureTrainer]);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    dispatch(profileService.profileTrainer()).finally(() =>
      setIsRefreshing(false)
    );
  }, [dispatch]);

  const handleLogout = () => {
    RNAlert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            dispatch(authService.logoutUser());
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { profileData: profile });
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  const handleAboutApp = () => {
    console.log("Navigate to about app info screen");
  };

  if (loading && !profile && !isRefreshing) {
    return <ProfileSkeletonScreen />;
  }

  if (error && !profile) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-100">
        <View className="flex-1 justify-center items-center p-6">
          <MaterialIcons name="wifi-off" size={60} color="#CB3A31" />
          <Text
            style={fonts.ecTextTitleM}
            className="text-alert-700 mt-4 mb-2 text-center"
          >
            Failed to Load Profile
          </Text>
          <Text
            style={fonts.ecTextBody2}
            className="text-neutral-600 mb-8 text-center"
          >
            {error?.message ||
              "An error occurred while fetching your profile details. Please check your connection."}
          </Text>
          <Button
            title="Retry"
            onPress={() => dispatch(profileService.profileTrainer())}
            variant="primary"
            icon={<MaterialIcons name="refresh" size={18} color="white" />}
            iconPosition="left"
            loading={loading}
            className="w-full"
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="alert"
            type="text"
            icon={<MaterialIcons name="logout" size={18} color="#CB3A31" />}
            iconPosition="left"
            className="mt-3"
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderProfileImage = () => {
    const pictureUrl = pictureTrainer || profile?.profilePicture;
    if (loadingPicture) {
      return <Skeleton width={80} height={80} radius={40} />;
    }
    if (pictureUrl) {
      return (
        <Image
          source={{ uri: `${API_URL}/profile/picture/${pictureUrl}` }}
          className="w-20 h-20 rounded-full border-4 border-white bg-neutral-200"
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
    <SafeAreaView edges={["top"]} className="flex-1 bg-neutral-100">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#233D90"
          />
        }
      >
        <View className="bg-primary-500 p-6 pb-24">
          <Text style={fonts.ecTextHeader1M} className="text-white">
            My Profile
          </Text>
        </View>

        <View className="px-4 -mt-20 mb-4">
          <Card
            variant="base"
            title="Personal Information"
            icon={
              <MaterialIcons name="person-outline" size={20} color="#192B66" />
            }
            collapsible={false}
            className="shadow-md border border-neutral-200"
          >
            <View className="flex-row items-center mb-5">
              <View className="mr-4">{renderProfileImage()}</View>
              <View className="flex-1">
                <Text
                  style={fonts.ecTextTitleM}
                  className="text-neutral-800 mb-0.5"
                  numberOfLines={1}
                >
                  {profile?.name || profileTrainerData?.name || "Name not set"}
                </Text>
                <View className="flex-row items-center bg-primary-50 px-2 py-0.5 rounded-full self-start border border-primary-100 mb-1">
                  <MaterialIcons
                    name="verified-user"
                    size={12}
                    color="#192B66"
                  />
                  <Text
                    style={fonts.ecTextBody3M}
                    className="text-primary-700 ml-1 font-medium"
                  >
                    {profile?.role?.replace("ROLE_", "") || "Role unavailable"}
                  </Text>
                </View>
                {profile?.joinDate && (
                  <Text style={fonts.ecTextBody3} className="text-neutral-500">
                    Joined:{" "}
                    {new Date(profile.joinDate).toLocaleDateString("en-GB")}
                  </Text>
                )}
              </View>
            </View>
            {console.log("ini dari profile screen: ", profileTrainerData)}
            <View className="border-t border-neutral-100 pt-4">
              <InfoRow
                label="Username"
                value={profile?.username || profileTrainerData?.username}
                iconName="alternate-email"
              />
              <InfoRow
                label="Email Address"
                value={profile?.email || profileTrainerData?.email}
                iconName="email"
              />
              <InfoRow
                label="Phone Number"
                value={profile?.phoneNumber || profileTrainerData?.phoneNumber}
                iconName="phone"
              />
              <InfoRow
                label="Address"
                value={profile?.address || profileTrainerData?.address}
                iconName="location-on"
              />

              {profile?.role?.includes("TRAINER") &&
                profile?.batch &&
                profile.batch.length > 0 && (
                  <View className="mb-4">
                    <View className="flex-row items-center mb-1">
                      <MaterialIcons
                        name="school"
                        size={14}
                        color="#757575"
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={fonts.ecTextBody3}
                        className="text-neutral-500"
                      >
                        Handling Batches
                      </Text>
                    </View>
                    <View className="flex-wrap flex-row gap-1.5 ml-1">
                      {profile.batch.map((batchName, index) => (
                        <View
                          key={index}
                          className="bg-secondary-50 px-2 py-0.5 rounded-full border border-secondary-100"
                        >
                          <Text
                            style={fonts.ecTextBody3M}
                            className="text-secondary-700"
                          >
                            {batchName}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
            </View>

            <View className="mt-4 border-t border-neutral-100 pt-4">
              <Button
                title="Edit Profile"
                onPress={handleEditProfile}
                variant="primary"
                type="outlined"
                icon={<MaterialIcons name="edit" size={16} color="#233D90" />}
                iconPosition="left"
                className="w-full"
              />
            </View>
          </Card>
        </View>

        <View className="px-4 mb-4">
          <Card
            variant="base"
            title="Account & Security"
            icon={<MaterialIcons name="security" size={20} color="#192B66" />}
            collapsible={false}
            className="shadow-md border border-neutral-200"
          >
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              variant="neutral"
              type="base"
              icon={
                <MaterialIcons name="lock-outline" size={18} color="#575757" />
              }
              iconPosition="left"
              className="mb-3 w-full bg-neutral-100 border-neutral-200"
              textClassName="text-neutral-700"
            />

            <Button
              title="Logout"
              onPress={handleLogout}
              variant="alert"
              icon={<MaterialIcons name="logout" size={18} color="white" />}
              iconPosition="left"
              className="w-full"
            />
          </Card>
        </View>

        {/* <View className="px-4 mb-8">
          <Card
            variant="base"
            title="Application Information"
            icon={
              <MaterialIcons name="info-outline" size={20} color="#192B66" />
            }
            collapsible={true}
            initiallyExpanded={false}
            className="shadow-md border border-neutral-200"
          >
            <Button
              title="Help & Support"
              onPress={handleAboutApp}
              variant="info"
              type="text"
              icon={
                <MaterialIcons name="help-outline" size={18} color="#4888D3" />
              }
              iconPosition="left"
              className="mb-3 self-start"
            />

            <View className="mt-1 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
              <InfoRow
                label="App Version"
                value="1.0.0"
                iconName="smartphone"
              />
            </View>
          </Card>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
