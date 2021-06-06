const ignores = ['/node_modules/', '__mocks__', 'src/@types', 'vendors'];
export default {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "collectCoverageFrom": ['src/**/*.+(js|jsx|ts|tsx)'],
  transformIgnorePatterns: [...ignores]
}