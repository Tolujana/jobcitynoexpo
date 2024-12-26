const lightTheme = {
  colors: {
    primary: '#272757',
    secondary: '#8686AC', //'#f79511',
    tertiary: '#8686AC',
    background: '#e8e8fe',
    backgroundCard: '#e2e2f1',
    transBackground: 'rgba(232, 232, 254,0.7)', //'rgba(246, 246, 246 , 0.8)',
    //background: '#f6f6f6', // Light gray #f2f2ff
    text: '#000000', // Black text
    text2: '#ffffff',
    //surface: '#ffffff', // White surface
    error: '#B00020', // Error red
    darkGrey: '#bfbfbf',
    lightGrey: '#dae0e0', //#ccd1d1',
    boldText: '#eb5615',
  },
  roundness: 8, // Adjust the corner radius for all components
};

const darkTheme = {
  colors: {
    primary: '#f79511', // orange
    secondary: '#272757',
    tertiary: '#fec87d', //'#8686AC', // Teal
    background: '#0f0f2d', // black
    backgroundDuplicate: '#0f0f37', // black
    transBackground: 'rgba(15, 15, 45, 0.8)',
    text: '#ffffff  ', // Black text
    text2: '#000000',
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
