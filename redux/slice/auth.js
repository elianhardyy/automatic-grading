import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);

      const { accessToken, accountId, role } = response.data.data;

      const decodedToken = jwtDecode(accessToken);

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("accountId", accountId.toString());
      await AsyncStorage.setItem("role", role);
      await AsyncStorage.setItem("username", decodedToken.sub.toString() || "");
      return {
        token: accessToken,
        user: {
          id: accountId,
          role,
          username: decodedToken.sub.toString() || "",
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("accountId");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("username");
      return null;
    } catch (error) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("accountId");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("username");
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { dispatch }) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("accountId");
      const userRole = await AsyncStorage.getItem("role");

      if (token) {
        const decodedToken = jwtDecode(token);
        return {
          token,
          user: {
            id: userId,
            role: userRole,
            username: decodedToken.sub.toString() || "",
          },
        };
      }
      return false;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken();
      const { accessToken } = response.data.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      return { token: accessToken };
    } catch (error) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("accountId");
      await AsyncStorage.removeItem("role");
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Updated forgotPassword thunk to properly handle the response format
export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (forgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(forgotPasswordData);

      // Check if the response has the expected structure
      if (response.data && response.data.code === 200) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Password reset request failed",
        }
      );
    }
  }
);

// Add resetPassword thunk if you need it
export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (resetPasswordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(resetPasswordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Password reset failed",
        }
      );
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
  passwordResetData: null,
  passwordResetSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    resetRegistrationStatus: (state) => {
      state.registrationSuccess = false;
    },
    resetPasswordResetStatus: (state) => {
      state.passwordResetSuccess = false;
      state.passwordResetData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Login failed" };
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Registration failed" };
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Check auth status cases
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      })

      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshUserToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Forgot Password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetData = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        // Store the reset and expiry times
        state.passwordResetData = action.payload.data || null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Password reset request failed",
        };
      })

      // Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        // Could add specific state updates for password reset completion
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Password reset failed" };
      });
  },
});

export const {
  resetAuthError,
  resetRegistrationStatus,
  resetPasswordResetStatus,
} = authSlice.actions;
export default authSlice.reducer;
