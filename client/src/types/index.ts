export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'MODERATOR' | 'JURY';
  firstName?: string;
  lastName?: string;
}

export interface AuthUser extends User {}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export type UserCreationPayload = Omit<User, 'id'> & {
  password?: string;
};

export interface VotePayload {
  rating?: 'LIKE' | 'DISCOURAGED';
  comment?: string;
}

export type FilmSubmissionPayload = Partial<Omit<Film, 'id' | 'status' | 'avgRating' | 'totalVotes'>> & {
  title: string;
  directorName: string;
};

export interface Film {
  id: number;
  title: string;
  directorName: string;
  posterUrl?: string;
  description?: string;
  country?: string;
  language?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoDuration?: number;
  subtitleUrl?: string;
  avgRating?: number;
  totalVotes?: number;
  totalLikes?: number;
  totalDislikes?: number;
  submittedAt?: string;
  updatedAt?: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'SELECTION' | 'FINALIST' | 'AWARDED' | 'TO_MODIFY';
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
