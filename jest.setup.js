// Fix reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Fix gesture handler
jest.mock('react-native-gesture-handler', () => {
  return {};
});