// NOTE: FIXME: This config has no effect.
// Appending `-- --config=jest.config.js` to test script in package.json
// does not make cra to correctly source this file.
module.exports = {
  // see issue: [render does not work with jest coverage report. · Issue #622 · testing-library/react-testing-library](https://github.com/testing-library/react-testing-library/issues/622)
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // See [Running Tests | Create React App](https://create-react-app.dev/docs/running-tests/#configuration) for supported overrides for coverage report.
  // Following flags are not in that list.
  // coverageProvider: 'v8',
  // testEnvironment: 'jest-environment-jsdom-sixteen',
  verbose: true,
}
