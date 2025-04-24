import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { profileAPI } from "../../api/profile";

export const profileTrainer = createAsyncThunk(
  "profile/trainer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getProfile();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfile(profileData);
      console.log(response.data.data, "response.data.data");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getProfilePicture = createAsyncThunk(
  "profile/getPicture",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getProfilePicture();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "profile/updatePicture",
  async (formProfileData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfilePicture(formProfileData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getProfilePictureByURI = createAsyncThunk(
  "profile/getPictureByURI",
  async (imageURI, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getProfilePictureById(imageURI);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.changePassword(passwordData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileError: (state) => {
      state.error = null;
    },
    setProfilePicture: (state, action) => {
      state.profile.picture = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileTrainer.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(profileTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfilePicture.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfilePictureByURI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfilePictureByURI.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfilePictureByURI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetProfileError, setProfilePicture } = profileSlice.actions;
export default profileSlice.reducer;
