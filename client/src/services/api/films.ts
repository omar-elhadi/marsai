import { apiClient } from "./apiClient";
import { Film, FilmSubmissionPayload } from "../../types";

export const filmsService = {
  getAll: async () => {
    const { data } = await apiClient.get<Film[]>("/films");
    return data;
  },
  getById: async (id: number | string) => {
    const { data } = await apiClient.get<Film>(`/films/${id}`);
    return data;
  },
  updateStatus: async (
    id: number | string,
    status: string,
    comment?: string,
  ) => {
    const { data } = await apiClient.patch<Film>(`/films/${id}/status`, {
      status,
      comment,
    });
    return data;
  },
  submit: async (payload: FilmSubmissionPayload) => {
    const { data } = await apiClient.post<Film>("/films/submit", payload);
    return data;
  },
};
