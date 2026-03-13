"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { API_BASE } from "../../../lib/api";
import { useChapter, useComics, useComic } from "../../../lib/hooks";
import { useAuthStore } from "../../../lib/store";
import { buildReadPath, buildReadPathFromSlug } from "../../../lib/slug";
import type { Chapter } from "../../../lib/types";

const PAGE_MIN_HEIGHT = 900;
const REWARD_SECONDS = 10;
const BUBBLE_SIZE = 72;

type ReadClientProps = {
  chapterId?: number;
  slug?: string;
  chapterNumber?: number;
};

export default function ReadClient({ chapterId, slug, chapterNumber }: ReadClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [resolvedId, setResolvedId] = useState<number | null>(
    Number.isFinite(chapterId) ? (chapterId as number) : null
  );
  const [resolveError, setResolveError] = useState(false);
  const { data: chapter, isLoading, error } = useChapter(resolvedId ?? Number.NaN);
  const { data: comicResponse } = useComic(chapter?.comic_id ?? Number.NaN);
  const { data: topComicsResponse } = useComics({ sort: "views" });
  const token = useAuthStore((s) => s.token);

  const [adblock, setAdblock] = useState<boolean | null>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [rewarded, setRewarded] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [prefetched, setPrefetched] = useState(false);
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Record<string, boolean>>({});
  const [topReaders, setTopReaders] = useState<{ user_id: number; username: string; chapters_read: number }[]>([]);
  const [leaderboardRange, setLeaderboardRange] = useState<"week" | "month" | "all">("all");
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    if (!chapter?.content_url) {
      setPages([]);
      setLoadedPages({});
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    const url = chapter.content_url.trim();
    setPages([]);
    setLoadedPages({});

    const setList = (list: string[]) => {
      if (!cancelled) {
        setPages(list.filter(Boolean));
        setLoadedPages({});
      }
    };

    const tryParseInline = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false;
      try {
        const data = JSON.parse(trimmed);
        if (Array.isArray(data)) {
          setList(data as string[]);
          return true;
        }
        if (Array.isArray((data as { pages?: string[] }).pages)) {
          setList((data as { pages: string[] }).pages);
          return true;
        }
      } catch {
        return false;
      }
      return false;
    };

    if (tryParseInline(url)) {
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    if (url.endsWith(".json")) {
      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setList(data as string[]);
            return;
          }
          if (Array.isArray((data as { pages?: string[] }).pages)) {
            setList((data as { pages: string[] }).pages);
          }
        })
        .catch(() => undefined);
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    if (url.includes("{page}") && chapter.page_count && chapter.page_count > 0) {
      const list = Array.from({ length: chapter.page_count }, (_, i) =>
        url.replace("{page}", String(i + 1))
      );
      setList(list);
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    setPages([]);
    setLoadedPages({});
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [chapter?.content_url, chapter?.page_count]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("adblock_detected") : null;
      if (stored === "1") {
        setAdblock(true);
        return;
      }
      if (stored === "0") {
        setAdblock(false);
      }
      const scriptBlocked = !(window as any).adsLoaded;
      const adsBox = document.querySelector(".adsbox") as HTMLElement | null;
      const styles = adsBox ? window.getComputedStyle(adsBox) : null;
      const domBlocked =
        !!adsBox &&
        (adsBox.offsetHeight === 0 ||
          adsBox.clientHeight === 0 ||
          styles?.display === "none" ||
          styles?.visibility === "hidden");
      setAdblock(scriptBlocked || domBlocked);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}/api/leaderboard/users?limit=5&range=${leaderboardRange}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        setTopReaders((data?.data as any[]) || []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [leaderboardRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadingTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (adblock === null || !token) return;

    fetch(`${API_BASE}/api/ads/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ adblock })
    }).catch(() => undefined);
  }, [adblock, token]);

  useEffect(() => {
    if (!chapter?.comic_id || !chapter?.id) return;
    fetch(`${API_BASE}/api/comics/${chapter.comic_id}/view?chapter_id=${chapter.id}`, {
      method: "POST"
    }).catch(() => undefined);
  }, [chapter?.comic_id, chapter?.id]);

  useEffect(() => {
    let cancelled = false;
    if (Number.isFinite(chapterId)) {
      setResolvedId(chapterId as number);
      setResolveError(false);
      return () => {
        cancelled = true;
      };
    }
    setResolvedId(null);
    setResolveError(false);
    if (!slug || !Number.isFinite(chapterNumber)) {
      setResolveError(true);
      return () => {
        cancelled = true;
      };
    }

    fetch(`${API_BASE}/api/comics/slug/${encodeURIComponent(slug)}/chapter/${chapterNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data?.id) {
          setResolvedId(Number(data.id));
        }
      })
      .catch(() => {
        if (!cancelled) setResolveError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [chapterId, slug, chapterNumber]);

  useEffect(() => {
    if (!resolvedId) return;
    setReadingTime(0);
    setRewarded(false);
    setClaiming(false);
    setPrefetched(false);
  }, [resolvedId]);

  useEffect(() => {
    if (bubblePos) return;
    setBubblePos({
      x: Math.max(12, window.innerWidth - BUBBLE_SIZE - 24),
      y: Math.max(12, window.innerHeight - BUBBLE_SIZE - 120)
    });
  }, [bubblePos]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragState.current.dragging) return;
      const nextX = dragState.current.originX + (event.clientX - dragState.current.startX);
      const nextY = dragState.current.originY + (event.clientY - dragState.current.startY);
      const maxX = window.innerWidth - BUBBLE_SIZE - 12;
      const maxY = window.innerHeight - BUBBLE_SIZE - 12;
      setBubblePos({
        x: Math.max(12, Math.min(nextX, maxX)),
        y: Math.max(12, Math.min(nextY, maxY))
      });
    };

    const onUp = () => {
      dragState.current.dragging = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const chaptersSorted = useMemo(() => {
    const list = comicResponse?.chapters ? [...comicResponse.chapters] : [];
    return list.sort((a, b) => a.chapter_number - b.chapter_number);
  }, [comicResponse?.chapters]);

  const currentIndex = useMemo(() => {
    const activeId = chapter?.id ?? resolvedId;
    if (!activeId) return -1;
    return chaptersSorted.findIndex((item) => item.id === activeId);
  }, [chaptersSorted, chapter?.id, resolvedId]);
  const prevChapter = currentIndex > 0 ? chaptersSorted[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < chaptersSorted.length - 1
      ? chaptersSorted[currentIndex + 1]
      : null;

  useEffect(() => {
    if (!nextChapter || prefetched) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.7 && !prefetched) {
        setPrefetched(true);
        fetch(`${API_BASE}/api/chapter/${nextChapter.id}`).catch(() => undefined);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nextChapter, prefetched]);

  const topComics = useMemo(() => {
    const data = topComicsResponse?.data ?? [];
    return data.slice(0, 5);
  }, [topComicsResponse?.data]);

  const comic = comicResponse?.comic;
  const remaining = Math.max(0, REWARD_SECONDS - readingTime);
  const progress = Math.min(1, readingTime / REWARD_SECONDS);
  const showBubble = !rewarded && adblock !== true;
  const bubbleText = remaining > 0 ? `${remaining}s` : token ? "✓" : "Đăng nhập";
  const bubbleSub = token ? "Điểm đọc" : "Đăng nhập để nhận";

  const buildPath = (target: Chapter) => {
    if (comic?.slug) return buildReadPathFromSlug(comic.slug, target.chapter_number);
    if (comic?.title) return buildReadPath(comic.title, target.chapter_number);
    return `/read/${target.id}`;
  };

  useEffect(() => {
    setIsFollowed(Boolean(comicResponse?.is_followed));
  }, [comicResponse?.is_followed]);

  async function toggleFollow() {
    if (!comic) return;
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

  async function claimReward() {
    if (!token || rewarded || claiming || !chapter?.id) return;
    setClaiming(true);
    const res = await fetch(`${API_BASE}/api/reward/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        chapter_id: chapter?.id,
        reading_time: readingTime,
        adblock: !!adblock
      })
    });

    if (res.ok) {
      setRewarded(true);
      toast.success("Hoàn thành nhiệm vụ đọc +1 điểm");
      setClaiming(false);
      return;
    }

    if (res.status === 409) {
      setRewarded(true);
      toast.message("Chương này đã nhận điểm trước đó.");
      setClaiming(false);
      return;
    }

    if (res.status === 403) {
      toast.error("Phát hiện Adblock. Vui lòng tắt để nhận điểm.");
      setClaiming(false);
      return;
    }

    setClaiming(false);
  }

  useEffect(() => {
    if (!chapter || !comic?.title) return;
    const canonical = comic.slug
      ? buildReadPathFromSlug(comic.slug, chapter.chapter_number)
      : buildReadPath(comic.title, chapter.chapter_number);
    if (pathname !== canonical) {
      router.replace(canonical);
    }
  }, [chapter, comic?.title, pathname, router]);

  useEffect(() => {
    if (!chapter) return;
    if (!token || rewarded || adblock === true) return;
    if (readingTime < REWARD_SECONDS) return;
    if (claiming) return;
    claimReward().catch(() => undefined);
  }, [chapter, readingTime, rewarded, adblock, token, claiming]);

  if (resolveError) {
    return <div className="text-sm text-red-600">Đường dẫn không hợp lệ.</div>;
  }
  if (!resolvedId) {
    return <div className="text-sm">Đang tải...</div>;
  }
  if (isLoading) return <div className="text-sm">Đang tải...</div>;
  if (error || !chapter) return <div className="text-sm text-red-600">Không tìm thấy chương.</div>;

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1680px] gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px] xl:grid-cols-[280px_minmax(0,1fr)_340px] 2xl:grid-cols-[300px_minmax(0,1fr)_380px]">
      <aside className="hidden space-y-4 lg:block lg:sticky lg:top-20 h-fit lg:pl-2">
        <div className="card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase text-black/60">Top độc giả</h2>
            <div className="flex items-center gap-1 text-[10px]">
              {(["week", "month", "all"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setLeaderboardRange(key)}
                  className={`rounded-full px-2 py-1 ${leaderboardRange === key ? "bg-black text-white" : "bg-black/5 text-black/60"}`}
                >
                  {key === "week" ? "Tuần" : key === "month" ? "Tháng" : "Tất cả"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 space-y-3 text-sm">
            {topReaders.length === 0 && <p className="text-xs text-black/60">Chưa có dữ liệu.</p>}
            {topReaders.map((item, index) => (
              <div key={item.user_id} className="flex items-center gap-3">
                <div className="text-xs font-semibold text-black/60">#{index + 1}</div>
                <div>
                  <p className="text-sm font-medium">{item.username}</p>
                  <p className="text-xs text-black/50">{item.chapters_read} chương đã đọc</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-2 min-w-0">
        <div className="mx-auto w-full max-w-[860px]">
          <h1 className="text-xl pt-5 font-semibold">
            Truyện tranh: {comic?.title || "Đang cập nhật"}
          </h1>
        </div>
        <div className="adsbox h-1 w-1 opacity-0 pointer-events-none" aria-hidden="true" />

        <div className="card mx-auto w-full max-w-[860px] space-y-3 p-4">
          <div className="flex items-center gap-2">
            <button
              disabled={!prevChapter}
              onClick={() => prevChapter && router.push(buildPath(prevChapter))}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs disabled:opacity-50"
            >
              ← Chương trước
            </button>
            <button
              disabled={!nextChapter}
              onClick={() => nextChapter && router.push(buildPath(nextChapter))}
              className="flex-1 rounded-lg bg-black px-3 py-2 text-xs text-white disabled:opacity-50"
            >
              Chương sau →
            </button>
          </div>
          <label className="block text-xs text-black/60">Chọn chương</label>
          {chaptersSorted.length > 0 ? (
            <select
              value={chapter?.id ?? resolvedId ?? ""}
              onChange={(event) => {
                const nextId = Number(event.target.value);
                const nextTarget = chaptersSorted.find((item) => item.id === nextId);
                if (nextTarget) {
                  router.push(buildPath(nextTarget));
                }
              }}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            >
              {chaptersSorted.map((item) => (
                <option key={item.id} value={item.id}>
                  Chương {item.chapter_number} {item.title ? `- ${item.title}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-black/50">Đang cập nhật danh sách chương.</div>
          )}
          {comic && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-black/60">
              <button
                onClick={toggleFollow}
                disabled={followLoading}
                className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5 disabled:opacity-50"
              >
                {isFollowed ? "Đang theo dõi" : "Theo dõi"}
              </button>
              {isFollowed && <span>Sẽ thông báo khi có chương mới</span>}
            </div>
          )}
        </div>

        {pages.length === 0 && (
          <div className="text-sm text-black/60">
            Chưa có danh sách trang. Hãy đặt <code>content_url</code> là JSON <code>{'{"pages": []}'}</code> hoặc mẫu
            URL như <code>https://cdn.example.com/comics/1/chapter-1/{'{page}'}.webp</code> và đặt <code>page_count</code>.
          </div>
        )}

        {pages.length > 0 && (
          <div className="mx-auto w-full max-w-[860px] space-y-4 md:space-y-5">
            {pages.map((src, idx) => (
              <div
                key={`${src}-${idx}`}
                className={`overflow-hidden rounded-lg bg-black/5 transition-opacity duration-300 ${
                  loadedPages[src] ? "opacity-100" : "opacity-0"
                }`}
                style={{ contentVisibility: "auto", containIntrinsicSize: `${PAGE_MIN_HEIGHT}px` }}
              >
                <img
                  src={src}
                  loading="lazy"
                  decoding="async"
                  fetchPriority={idx === 0 ? "high" : "low"}
                  className="w-full"
                  alt={`Trang ${idx + 1}`}
                  onLoad={() =>
                    setLoadedPages((prev) => ({
                      ...prev,
                      [src]: true
                    }))
                  }
                  onError={() =>
                    setLoadedPages((prev) => ({
                      ...prev,
                      [src]: true
                    }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="card mx-auto w-full max-w-[860px] space-y-3 p-4">
          <div className="flex items-center gap-2">
            <button
              disabled={!prevChapter}
              onClick={() => prevChapter && router.push(buildPath(prevChapter))}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs disabled:opacity-50"
            >
              ← Chương trước
            </button>
            <button
              disabled={!nextChapter}
              onClick={() => nextChapter && router.push(buildPath(nextChapter))}
              className="flex-1 rounded-lg bg-black px-3 py-2 text-xs text-white disabled:opacity-50"
            >
              Chương sau →
            </button>
          </div>
          <label className="block text-xs text-black/60">Chọn chương</label>
          {chaptersSorted.length > 0 ? (
            <select
              value={chapter?.id ?? resolvedId ?? ""}
              onChange={(event) => {
                const nextId = Number(event.target.value);
                const nextTarget = chaptersSorted.find((item) => item.id === nextId);
                if (nextTarget) {
                  router.push(buildPath(nextTarget));
                }
              }}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            >
              {chaptersSorted.map((item) => (
                <option key={item.id} value={item.id}>
                  Chương {item.chapter_number} {item.title ? `- ${item.title}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-black/50">Đang cập nhật danh sách chương.</div>
          )}
        </div>
      </div>

      <aside className="hidden space-y-4 lg:block lg:sticky lg:top-20 h-fit lg:pr-2">
        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase text-black/60">Bảng xếp hạng</h2>
          <div className="mt-3 space-y-3 text-sm">
            {topComics.length === 0 && <p className="text-xs text-black/60">Chưa có dữ liệu.</p>}
            {topComics.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="text-xs font-semibold text-black/60">#{index + 1}</div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-black/50">{item.views ?? 0} lượt xem</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {showBubble && bubblePos && (
        <div
          className="fixed z-40 select-none touch-none"
          style={{ left: bubblePos.x, top: bubblePos.y }}
          onPointerDown={(event) => {
            if (!bubblePos) return;
            dragState.current.dragging = true;
            dragState.current.startX = event.clientX;
            dragState.current.startY = event.clientY;
            dragState.current.originX = bubblePos.x;
            dragState.current.originY = bubblePos.y;
          }}
        >
          <div
            className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10"
            style={{
              background: `conic-gradient(#c7522a ${progress * 360}deg, rgba(0,0,0,0.1) 0deg)`
            }}
          >
            <div className="absolute inset-[6px] rounded-full bg-white" />
            <span className="relative text-[10px] font-semibold">{bubbleText}</span>
          </div>
          <p className="mt-1 text-center text-[10px] text-black/60">{bubbleSub}</p>
        </div>
      )}

      {showTopButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-4 z-40 rounded-full border border-black/10 bg-white px-3 py-2 text-xs shadow-lg"
        >
          ↑ Lên đầu
        </button>
      )}
      </div>
    </div>
  );
}
