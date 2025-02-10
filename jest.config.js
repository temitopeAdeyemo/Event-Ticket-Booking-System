module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/config/jest.setup.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 100000, 
};
