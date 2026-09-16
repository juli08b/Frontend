import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../utils/helpers';

export default function useCollection(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/${resource}`);
      const data = await res.json();
      setError(null);
      setItems(data);
    } catch {
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const res = await fetch(`${API_URL}/${resource}`);
        const data = await res.json();
        if (active) {
          setError(null);
          setItems(data);
        }
      } catch {
        if (active) setError('No se pudieron cargar los datos.');
      } finally {
        if (active) setLoading(false);
      }
    };
    initialize();
    return () => {
      active = false;
    };
  }, [resource]);

  const remove = useCallback(
    async (id) => {
      try {
        await fetch(`${API_URL}/${resource}/${id}`, { method: 'DELETE' });
        setItems((prev) => prev.filter((x) => String(x.id) !== String(id)));
        return true;
      } catch {
        setError('No se pudo eliminar el elemento.');
        return false;
      }
    },
    [resource]
  );

  return {
    items,
    setItems,
    loading,
    error,
    message,
    setMessage,
    remove,
    load,
  };
}