import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { profileAPI } from "../../api/profile";

export const profileService = {
  profileTrainer: createAsyncThunk(
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
  ),
  updateProfile: createAsyncThunk(
    "profile/update",
    async (profileData, { rejectWithValue }) => {
      try {
        const response = await profileAPI.updateProfile(profileData);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || { message: error.message }
        );
      }
    }
  ),
  getProfilePicture: createAsyncThunk(
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
  ),

  updateProfilePicture: createAsyncThunk(
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
  ),
  getProfilePictureByURI: createAsyncThunk(
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
  ),
  changePassword: createAsyncThunk(
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
  ),
};

const initialState = {
  profile: null,
  loading: false,
  error: null,
  pictureTrainer: null,
  profileTrainerData: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileError: (state) => {
      state.error = null;
    },
    setProfilePicture: (state, action) => {
      state.pictureTrainer = action.payload;
      //state.profile.picture = action.payload;
    },
    setProfile: (state, action) => {
      state.profileTrainerData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileService.profileTrainer.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileService.profileTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(profileService.profileTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(profileService.updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileService.updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(profileService.updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(profileService.updateProfilePicture.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        profileService.updateProfilePicture.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(
        profileService.updateProfilePicture.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(profileService.changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileService.changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(profileService.changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(profileService.getProfilePicture.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileService.getProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(profileService.getProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(profileService.getProfilePictureByURI.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        profileService.getProfilePictureByURI.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(
        profileService.getProfilePictureByURI.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
export const { resetProfileError, setProfilePicture, setProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
