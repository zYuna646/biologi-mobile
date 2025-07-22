const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .glb extension to asset extensions
config.resolver.assetExts.push('glb');

module.exports = config; 