const lightTheme = {
  colors: {
    primary: '#272757',
    secondary: '#f79511',
    tertiary: '#8686AC',
    background: '#f6f6f6',
    background2: '#f9f9f9',
    transBackground: 'rgba(246, 246, 246 , 0.8)',
    //background: '#f6f6f6', // Light gray
    text: '#000000', // Black text
    text2: '#ffffff  ',
    //surface: '#ffffff', // White surface
    error: '#B00020', // Error red
    lightGrey: '#EBEDEF',
    darkGrey: '#ccd1d1',
    boldText: '#eb5615',
  },
  roundness: 8, // Adjust the corner radius for all components
};

const darkTheme = {
  colors: {
    primary: '#f79511', // orange
    secondary: '#272757',
    tertiary: '#8686AC', // Teal
    background: '#0f0f2d', // black
    background2: '#0f0f37', // black
    transBackground: 'rgba(15, 15, 45, 0.8)',
    text: '#ffffff  ', // Black text
    text2: '#00000',
    surface: '#ffffff', // White surface
    error: '#B00020', // Error red
    lightGrey: '#EBEDEF',
    darkGrey: '#ccd1d1',
    boldText: '#f79511',
  },
  roundness: 8, // Adjust the corner radius for all components
};

// const getTheme = colorScheme => {
//   return colorScheme === 'dark' ? darkTheme : CustomTheme;
// };

export {lightTheme, darkTheme};
