// jest.setup.js
// This file contains global setup code for Jest tests, including global mocks or configurations.

// Example of extending expect with custom matchers
import '@testing-library/jest-dom/extend-expect';

// Example of setting up a global mock for fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Add any additional setup code below
