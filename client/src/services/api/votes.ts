import { apiClient } from "./apiClient";
import { VotePayload } from "../../types";

export const votesService = {
  createVote: async (filmId: number | string, data: VotePayload) => {
    const response = await apiClient.post(`/votes/film/${filmId}`, data);
    return response.data;
  },
  getStats: async (filmId: number | string) => {
    const response = await apiClient.get(`/votes/film/${filmId}/stats`);
    return response.data;
  },
};
