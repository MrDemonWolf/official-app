const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add path alias support
config.resolver.extraNodeModules = {
  "@": path.resolve(__dirname),
};

module.exports = withNativewind(config, { input: "./global.css" });
