"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE } from "../../../lib/api";
import { useComic } from "../../../lib/hooks";
import { buildReadPath, buildReadPathFromSlug } from "../../../lib/slug";
import { useAuthStore } from "../../../lib/store";

export default function ComicPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { data, isLoading, error } = useComic(id);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setIsFollowed(Boolean(data?.is_followed));
  }, [data?.is_followed]);

  if (isLoading) return <div className="text-sm">Đang tải...</div>;
  if (error || !data) return <div className="text-sm text-red-600">Không tìm thấy truyện.</div>;

  const { comic, chapters } = data;
  const rawCover = comic.cover || "";
  const cover =
    rawCover.startsWith("http://res.cloudinary.com/") || rawCover.startsWith("http://")
      ? rawCover.replace("http://", "https://")
      : rawCover;

  async function toggleFollow() {
    if (!token) {
      router.push("/login");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/comics/${comic.id}/follow`, {
        method: isFollowed ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        toast.error("Không thể cập nhật theo dõi.");
        setFollowLoading(false);
        return;
      }
      const nextFollowed = !isFollowed;
      setIsFollowed(nextFollowed);
      toast.success(nextFollowed ? "Đã theo dõi truyện." : "Đã bỏ theo dõi.");
      if (nextFollowed && typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().catch(() => undefined);
        }
      }
    } finally {
      setFollowLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="w-32 overflow-hidden rounded-lg bg-black/10 sm:w-40 md:w-48 lg:w-56">
            <div className="aspect-[3/4] w-full">
              {cover && !coverFailed ? (
                <img
                  src={cover}
                  alt={comic.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-black/40">
                  Chưa có ảnh
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">{comic.title}</h1>
              <button
                onClick={toggleFollow}
                disabled={followLoading}
                className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5 disabled:opacity-50"
              >
                {isFollowed ? "Đang theo dõi" : "Theo dõi"}
              </button>
            </div>
            <p className="text-sm text-black/60">{comic.author || "Đang cập nhật"}</p>
            <p className="mt-2 text-sm text-black/80">{comic.description || "Chưa có mô tả."}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(comic.genres || []).map((g) => (
                <span key={g.id} className="rounded-full bg-black/5 px-2 py-1 text-xs">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Danh sách chương</h2>
        <div className="mt-4 grid gap-2">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
                href={
                  comic.slug
                    ? buildReadPathFromSlug(comic.slug, chapter.chapter_number)
                    : buildReadPath(comic.title, chapter.chapter_number)
                }
              className="card flex items-center justify-between px-4 py-3 text-sm hover:bg-black/5"
            >
              <span>
                Chương {chapter.chapter_number}{chapter.title ? `: ${chapter.title}` : ""}
              </span>
              <span className="text-black/50">Đọc</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
