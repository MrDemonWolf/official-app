const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

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
