import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFilms } from '../hooks/useFilms';
import { filmsService } from '../services/api/films';

vi.mock('../services/api/films', () => ({
  filmsService: {
    getAll: vi.fn(),
  },
}));

describe('useFilms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns films successfully', async () => {
    const mockFilms = [{ id: 1, title: 'Film 1' }, { id: 2, title: 'Film 2' }];
    (filmsService.getAll as any).mockResolvedValue(mockFilms);

    const { result } = renderHook(() => useFilms());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.films).toEqual(mockFilms);
    expect(result.current.error).toBeNull();
    expect(filmsService.getAll).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error correctly', async () => {
    (filmsService.getAll as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useFilms());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.films).toEqual([]);
    expect(result.current.error).toBe('Network Error');
    expect(filmsService.getAll).toHaveBeenCalledTimes(1);
  });

  it('can refetch films manually', async () => {
    const mockFilms = [{ id: 1, title: 'Film 1' }];
    (filmsService.getAll as any).mockResolvedValueOnce(mockFilms);

    const { result } = renderHook(() => useFilms());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newMockFilms = [{ id: 1, title: 'Film 1' }, { id: 2, title: 'Film 2' }];
    (filmsService.getAll as any).mockResolvedValueOnce(newMockFilms);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.films).toEqual(newMockFilms);
    expect(filmsService.getAll).toHaveBeenCalledTimes(2);
  });
});
