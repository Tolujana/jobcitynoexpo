// AppContext.js
import React, { createContext, useState } from "react";
import axios from "axios";

// Create the context
const AppContext = createContext();

// Create a provider component
const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchData = async (url, params) => {
    setLoading(true);
    setError(null);
    const { page } = params;
    try {
      const response = await axios.get(url, { params: params });
      setData((prevData) => [...prevData, ...response.data.posts]);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ data, loading, error, fetchData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
