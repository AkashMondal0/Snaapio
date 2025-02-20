// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Override Metro's resolution behavior for "event-target-shim"
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "event-target-shim" && context.originModulePath.includes("react-native-webrtc")) {
    // Manually resolve to the correct file in event-target-shim.
    const eventTargetShimPath = path.join(
      context.originModulePath,
      "node_modules/event-target-shim/dist/index.js"
    );
    
    return {
      filePath: eventTargetShimPath,
      type: "sourceFile",
    };
  }

  // Ensure you call the default resolver for other cases
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
