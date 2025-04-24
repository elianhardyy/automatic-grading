import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const useRoleCheck = (requiredRoles, redirectTo = "LoginScreen") => {
  const { user } = useSelector((state) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    const checkRole = () => {
      if (!user) return false;

      const userRole = user.role;
      if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(userRole);
      }
      return userRole === requiredRoles;
    };

    const hasAccess = checkRole();
    if (!hasAccess) {
      navigation.navigate(redirectTo);
    }
  }, [user, requiredRoles, redirectTo, navigation]);
};
