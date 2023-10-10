import { useEffect, useState } from "react";
import { fetchWithDefaults } from "../util/fetch-wrapper";

export const useFetch = <T>(url: string, options: RequestInit = {}) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<null | unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithDefaults(url, options);
        const json = await res.json();
        setResponse(json);
      } catch (error: unknown) {
        setError(error);
      }
    };
    fetchData();
    // Call exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { response, error };
};
