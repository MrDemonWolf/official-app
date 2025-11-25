const { withNativewind } = require("nativewind/metro");
const path = require("path");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Add path alias support
config.resolver.extraNodeModules = {
  "@": path.resolve(__dirname),
};

// Optimize file watching to prevent excessive rescans
config.watchFolders = [__dirname];
config.resolver.blockList = [
  // Ignore build and cache directories
  /ios\/build\/.*/,
  /ios\/Pods\/.*/,
  /android\/build\/.*/,
  /android\/\.gradle\/.*/,
  /\.expo\/.*/,
  /\.expo-shared\/.*/,
];

module.exports = withNativewind(config, { input: "./global.css" });