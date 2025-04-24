import { useDispatch, useSelector } from "react-redux";
import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";
import { useEffect } from "react";
import { checkAuthStatus } from "./redux/slice/auth";
import { ActivityIndicator, View } from "react-native";

export default function Main() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0066cc" />
  //     </View>
  //   );
  // }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
