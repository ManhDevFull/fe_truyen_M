"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { ReadingHistoryItem, User } from "../../lib/types";

export default function MePage() {
  const profile = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<User>("/api/me")
  });

  const history = useQuery({
    queryKey: ["me-history"],
    queryFn: () => apiFetch<{ data: ReadingHistoryItem[] }>("/api/me/history")
  });

  if (profile.isLoading) return <div className="text-sm">Loading...</div>;
  if (profile.error) return <div className="text-sm text-red-600">Login required.</div>;

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h1 className="text-2xl font-semibold">{profile.data?.username}</h1>
        <p className="text-sm text-black/60">{profile.data?.email}</p>
        <p className="mt-2 text-sm">Points: {profile.data?.points}</p>
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-semibold">Reading History</h2>
        <div className="mt-3 space-y-2 text-sm">
          {(history.data?.data || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-black/5 pb-2">
              <div>
                <p className="font-medium">{item.comic_title}</p>
                <p className="text-xs text-black/50">
                  Chapter {item.chapter_number} {item.chapter_title ? `- ${item.chapter_title}` : ""}
                </p>
              </div>
              <span className="text-xs text-black/50">{item.read_at?.slice(0, 10)}</span>
            </div>
          ))}
          {history.isLoading && <div className="text-xs">Loading history...</div>}
        </div>
      </div>
    </div>
  );
}
