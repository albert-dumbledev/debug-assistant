import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      roots: ['<rootDir>/server/src'],
      testMatch: ['**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
    },
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/client/src'],
      testMatch: ['**/*.test.tsx', '**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
    },
  ],
  collectCoverageFrom: [
    'server/src/**/*.{ts,tsx}',
    'client/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
};

export default config; 