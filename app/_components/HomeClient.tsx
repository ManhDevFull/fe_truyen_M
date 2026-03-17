"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useComics, useGenres } from "../../lib/hooks";
import type { Comic } from "../../lib/types";

export default function HomeClient() {
  const params = useSearchParams();
  const genre = params.get("genre") || "";
  const q = (params.get("q") || "").trim();
  const [updatePage, setUpdatePage] = useState(1);
  const showDefault = !q && !genre;
  const search = useComics(q ? { q, limit: 20 } : undefined, { enabled: !!q });
  const byGenre = useComics(genre ? { genre, limit: 20 } : undefined, { enabled: !!genre });
  const trending = useComics({ sort: "views", limit: 10 }, { enabled: showDefault });
  const updated = useComics({ sort: "updated", page: updatePage, limit: 20 }, { enabled: showDefault });
  const genres = useGenres();

  const gridClass = "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  const ComicCard = ({ comic }: { comic: Comic }) => {
    const [failed, setFailed] = useState(false);
    const rawCover = comic.cover || "";
    const cover =
      rawCover.startsWith("http://res.cloudinary.com/") || rawCover.startsWith("http://")
        ? rawCover.replace("http://", "https://")
        : rawCover;

    return (
      <Link
        href={`/comic/${comic.id}`}
        className="group rounded-xl border border-black/10 bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-black/10">
          {cover && !failed ? (
            <img
              src={cover}
              alt={comic.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-black/40">
              Chưa có ảnh
            </div>
          )}
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="text-xs font-semibold truncate">{comic.title}</p>
          <p className="text-[11px] text-black/60 truncate">{comic.author || "Đang cập nhật"}</p>
        </div>
      </Link>
    );
  };

  const updateTotal = updated.data?.total ?? 0;
  const updateLimit = updated.data?.limit ?? 20;
  const updatePages = Math.max(1, Math.ceil(updateTotal / updateLimit));
  const pageButtons = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, updatePage - 2);
    let end = Math.min(updatePages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [updatePage, updatePages]);

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold">TruyenM</h1>
        <span className="text-sm text-black/60">Đọc truyện nhanh, nhẹ</span>
      </div>

      {q && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Kết quả tìm kiếm: “{q}”</h2>
          {search.isLoading && <div className="text-sm">Đang tải...</div>}
          {search.error && <div className="text-sm text-red-600">Không tải được kết quả.</div>}
          {!search.isLoading && (search.data?.data || []).length === 0 && (
            <div className="text-sm text-black/60">Không có truyện phù hợp.</div>
          )}
          <div className={gridClass}>
            {(search.data?.data || []).map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {genre && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Thể loại: {genre}</h2>
          <div className={gridClass}>
            {(byGenre.data?.data || []).map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {showDefault && (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Xu hướng</h2>
            {trending.isLoading && <div className="text-sm">Đang tải...</div>}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(trending.data?.data || []).map((comic) => (
                <div key={comic.id} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px]">
                  <ComicCard comic={comic} />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Truyện vừa cập nhật</h2>
            {updated.isLoading && <div className="text-sm">Đang tải...</div>}
            {updated.error && <div className="text-sm text-red-600">Không tải được danh sách truyện.</div>}
            <div className={gridClass}>
              {(updated.data?.data || []).map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
            {updatePages > 1 && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <button
                  className="rounded-lg border border-black/10 px-3 py-1 disabled:opacity-40"
                  disabled={updatePage <= 1}
                  onClick={() => setUpdatePage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </button>
                {pageButtons.map((p) => (
                  <button
                    key={p}
                    onClick={() => setUpdatePage(p)}
                    className={`rounded-lg border px-3 py-1 ${
                      p === updatePage ? "border-black bg-black text-white" : "border-black/10"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="rounded-lg border border-black/10 px-3 py-1 disabled:opacity-40"
                  disabled={updatePage >= updatePages}
                  onClick={() => setUpdatePage((p) => Math.min(updatePages, p + 1))}
                >
                  Sau
                </button>
              </div>
            )}
          </section>
        </>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Thể loại</h2>
        <div className="flex flex-wrap gap-2">
          {(genres.data?.data || []).map((g) => (
            <Link
              key={g.id}
              href={`/?genre=${g.slug}`}
              className="rounded-full border border-black/10 px-3 py-1 text-xs"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
