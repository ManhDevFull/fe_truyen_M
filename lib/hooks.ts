import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api";
import { Chapter, Comic, ComicDetailResponse, Genre } from "./types";

export function useComics(params?: { q?: string; genre?: string; status?: string; sort?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.genre) qs.set("genre", params.genre);
  if (params?.status) qs.set("status", params.status);
  if (params?.sort) qs.set("sort", params.sort);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return useQuery({
    queryKey: ["comics", suffix],
    queryFn: () => apiFetch<{ data: Comic[] }>("/api/comics" + suffix)
  });
}

export function useComic(id: number) {
  return useQuery({
    queryKey: ["comic", id],
    queryFn: () => apiFetch<ComicDetailResponse>(`/api/comics/${id}`),
    enabled: Number.isFinite(id)
  });
}

export function useChapter(id: number) {
  return useQuery({
    queryKey: ["chapter", id],
    queryFn: () => apiFetch<Chapter>(`/api/chapter/${id}`),
    enabled: Number.isFinite(id)
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => apiFetch<{ data: Genre[] }>("/api/genres")
  });
}
