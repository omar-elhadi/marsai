import { useState, useCallback } from 'react';
import { filmsService } from '../services/api/films';
import { Film } from '../types';

export const useFilm = (id: number | string) => {
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilm = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await filmsService.getById(id);
      setFilm(data || null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch film');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateStatus = async (status: string, comment?: string) => {
    try {
      const data = await filmsService.updateStatus(id, status, comment);
      setFilm(data);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  return { film, loading, error, refetch: fetchFilm, updateStatus };
};
