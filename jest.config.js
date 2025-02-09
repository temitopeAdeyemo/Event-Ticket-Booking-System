module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/jest.setup.ts'],
  testMatch: ['**/tests/**/*.test.ts']
};
