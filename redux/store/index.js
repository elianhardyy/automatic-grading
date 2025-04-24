import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth";
import profileReducer from "../slice/profile";
import { ongoingReducer } from "../slice/ongoing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["ongoing"],
};

const persistedReducer = persistReducer(persistConfig, ongoingReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ongoing: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["ongoing"],
      },
    }),
});

export const persistor = persistStore(store);
