const { defaults } = require('jest-config');
const { jsWithTs: tsjPreset } = require('ts-jest/presets');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: tsjPreset.transform,
  transformIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  verbose: true,
  setupFiles: ['./jest.setup.cjs'],
};
