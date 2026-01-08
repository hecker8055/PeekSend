module.exports = {
  // Override Jest Configuration
  jest: (config) => {
    config.transformIgnorePatterns = [
      "/node_modules/(?!axios)/", // Tell Jest to transpile `axios`.
    ];
    return config;
  },
};