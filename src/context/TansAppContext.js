// AppContext.js
import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// Create a Query Client
const queryClient = new QueryClient();

const AppProvider = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export {AppProvider};
