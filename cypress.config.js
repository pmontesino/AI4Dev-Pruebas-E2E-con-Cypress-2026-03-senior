const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
  },
});
