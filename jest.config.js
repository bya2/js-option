import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" assert { type: "json" };

/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",

  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["\\\\.yarn\\\\", "\\\\node_modules\\\\"],

  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),

  clearMocks: true,

  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],
  coverageProvider: "v8",

  verbose: true,
  errorOnDeprecated: false,
};

export default config;
