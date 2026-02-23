const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Injects `use_modular_headers!` into the iOS Podfile so that Firebase Swift
 * pods (GoogleUtilities, etc.) compile correctly without the blanket
 * `useFrameworks: "static"` flag from expo-build-properties, which causes
 * "non-modular header inside framework module" errors in @react-native-firebase.
 */
function withModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let podfile = fs.readFileSync(podfilePath, "utf8");

      if (!podfile.includes("use_modular_headers!")) {
        podfile = podfile.replace(
          /^(platform :ios.*)$/m,
          "$1\nuse_modular_headers!"
        );
        fs.writeFileSync(podfilePath, podfile, "utf8");
      }

      return cfg;
    },
  ]);
}

module.exports = withModularHeaders;
