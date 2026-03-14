import { useState, useCallback, useEffect } from 'react';
import { filmsService } from '../services/api/films';
import { Film } from '../types';

export const useFilms = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await filmsService.getAll();
      setFilms(data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch films');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  return { films, loading, error, refetch: fetchFilms };
};
