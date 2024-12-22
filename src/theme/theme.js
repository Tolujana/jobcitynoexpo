const lightTheme = {
  colors: {
    primary: '#272757',
    secondary: '#f79511',
    tertiary: '#8686AC',
    background: '#f6f6f6',
    //background: '#f6f6f6', // Light gray
    text: '#000000', // Black text
    text2: '#ffffff  ',
    //surface: '#ffffff', // White surface
    error: '#B00020', // Error red
  },
  roundness: 8, // Adjust the corner radius for all components
};

const darkTheme = {
  colors: {
    primary: '#f79511', // orange
    secondary: '#272757',
    tertiary: '#8686AC', // Teal
    background: '"0f0f2d', // black
    text: '#ffffff  ', // Black text
    text2: '#00000',
    surface: '#ffffff', // White surface
    error: '#B00020', // Error red
  },
  roundness: 8, // Adjust the corner radius for all components
};

// const getTheme = colorScheme => {
//   return colorScheme === 'dark' ? darkTheme : CustomTheme;
// };

export {lightTheme, darkTheme};
