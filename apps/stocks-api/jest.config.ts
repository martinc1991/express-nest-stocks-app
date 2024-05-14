import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  maxWorkers: '80%',
  coverageDirectory: '<rootDir>/coverage',
  verbose: true,
  setupFiles: ['./jest.setup.ts'],
};

export default config;
