import axios from 'axios';

import {useState, useEffect} from 'react';

const useCustomFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({
          method: options.method || 'get',
          url,
          data: options.data || null,
          params: options.params || null,
          headers: options.headers || null,
        });
        setData(response.data.posts);
        setLoading(false);
      } catch (error) {
        setError(`Fetch failed: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();

    return () => {}; // Clean-up function
  }, [url]);

  return {data, loading, error};
};

export default useCustomFetch;
