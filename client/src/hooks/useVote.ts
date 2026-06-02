import { useState } from "react";
import { votesService } from "../services/api/votes";

export const useVote = (filmId: number | string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVote = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await votesService.createVote(filmId, data);
      return result;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to submit vote",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      return await votesService.getStats(filmId);
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to get stats",
      );
      throw err;
    }
  };

  return { submitVote, getStats, loading, error };
};
