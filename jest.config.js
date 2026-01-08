module.exports = {
  testEnvironment: "jsdom", // Simulate a browser environment for React
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Use Babel to transpile JS and JSX files
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // Ignore regular `node_modules`, but transpile `axios`
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Mock CSS files
  },
};