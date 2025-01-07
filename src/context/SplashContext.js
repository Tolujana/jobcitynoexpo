import {createContext, useState} from 'react';

const SplashContext = createContext();
//   isSplashLoaded: false,
// });

const SplashProvider = ({children}) => {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  return (
    <SplashContext.Provider value={{isSplashFinished, setIsSplashFinished}}>
      {children}
    </SplashContext.Provider>
  );
};

export {SplashProvider, SplashContext};
