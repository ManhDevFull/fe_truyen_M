export type Comic = {
  id: number;
  title: string;
  slug?: string;
  author?: string;
  description?: string;
  cover?: string;
  views?: number;
  status?: string;
  created_at?: string;
  genres?: Genre[];
};

export type Chapter = {
  id: number;
  comic_id: number;
  chapter_number: number;
  title?: string;
  content_url?: string;
  page_count?: number;
  created_at?: string;
};

export type ComicDetailResponse = {
  comic: Comic;
  chapters: Chapter[];
  is_followed?: boolean;
};

export type Genre = {
  id: number;
  name: string;
  slug: string;
};

export type ReadingHistoryItem = {
  id: number;
  chapter_id: number;
  read_at: string;
  reading_time: number;
  comic_id: number;
  comic_title: string;
  chapter_number: number;
  chapter_title: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  points: number;
  role: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
