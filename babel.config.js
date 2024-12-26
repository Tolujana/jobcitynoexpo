module.exports = {
  presets: ['module:@react-native/babel-preset'],
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    ['@babel/plugin-transform-private-methods', {loose: true}],
    'react-native-reanimated/plugin',
    'react-native-paper/babel',
  ],
};
