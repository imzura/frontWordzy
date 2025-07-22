import { useEffect, useState, useCallback } from "react";
import { fetchWithAutoRenew } from "../../../shared/utils/authHeader";

function useGetTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAutoRenew("http://localhost:3000/api/topic", {
        method: "GET",}
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los temas");
      }

      setTopics(data || []);
    } catch (err) {
      setError(err.message || "Error desconocido al obtener los temas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, error, refetch: fetchTopics };
}

export { useGetTopics }