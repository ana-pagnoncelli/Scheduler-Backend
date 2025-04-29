module.exports = {
  //   collectCoverage: true,
  //   collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  //   coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  testTimeout: 7000
};
