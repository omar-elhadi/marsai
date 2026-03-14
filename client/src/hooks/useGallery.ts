import { useState, useCallback, useEffect } from 'react';
import { galleryService } from '../services/api/gallery.service';

export const useGallery = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryService.getAll();
      setItems(data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { items, loading, error, refetch: fetchGallery };
};
