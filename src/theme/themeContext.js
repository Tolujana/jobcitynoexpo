import React, {createContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme} from './theme';

const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === 'dark' ? darkTheme : lightTheme,
  );

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    console.log(colorScheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export {ThemeProvider, ThemeContext};
