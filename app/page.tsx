"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useComics, useGenres } from "../lib/hooks";
import type { Comic } from "../lib/types";

export default function HomePage() {
  const params = useSearchParams();
  const genre = params.get("genre") || "";
  const q = (params.get("q") || "").trim();
  const search = useComics(q ? { q } : undefined);
  const latest = useComics({ sort: "id" });
  const trending = useComics({ sort: "views" });
  const byGenre = useComics(genre ? { genre } : undefined);
  const genres = useGenres();

  const gridClass = "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  const ComicCard = ({ comic }: { comic: Comic }) => (
    <Link
      href={`/comic/${comic.id}`}
      className="group rounded-xl border border-black/10 bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-black/10">
        {comic.cover ? (
          <img
            src={comic.cover}
            alt={comic.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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

      {!q && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Truyện mới</h2>
          {latest.isLoading && <div className="text-sm">Đang tải...</div>}
          {latest.error && <div className="text-sm text-red-600">Không tải được danh sách truyện.</div>}
          <div className={gridClass}>
            {(latest.data?.data || []).map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Xu hướng</h2>
        {trending.isLoading && <div className="text-sm">Đang tải...</div>}
        <div className={gridClass}>
          {(trending.data?.data || []).map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </section>

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
