module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./dist/tests/config/jest.setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 100000, 
  silent: true,
  verbose: true
};
