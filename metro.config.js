const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Dapatkan konfigurasi default
const config = getDefaultConfig(__dirname);

// Terapkan konfigurasi NativeWind
const nativeWindConfig = withNativeWind(config, { input: "./global.css" });

// Terapkan konfigurasi Reanimated dan ekspor hasilnya
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);
