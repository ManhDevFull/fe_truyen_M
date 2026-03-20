"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { API_BASE } from "../../lib/api";
import { useAuthStore } from "../../lib/store";

export default function SiteHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastY.current + 8 && current > 80) {
        setHidden(true);
      } else if (current < lastY.current - 8) {
        setHidden(false);
      }
      lastY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const current = searchParams.get("q") || "";
    setQuery(current);
  }, [searchParams]);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch {
      // ignore
    }
    clearAuth();
    toast.success("Đã đăng xuất");
    router.push("/");
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur transition-transform duration-200 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container flex h-14 items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <img src="/logo.svg" alt="TruyenM" className="h-7 w-7" />
          <span>TruyenM</span>
        </Link>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const next = query.trim();
            if (next.length === 0) {
              router.push("/");
              return;
            }
            router.push(`/?q=${encodeURIComponent(next)}`);
          }}
          className="flex flex-1 items-center min-w-0"
        >
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm shadow-sm">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm truyện, tác giả..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-black/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-black/40 hover:text-black/70"
              >
                Xóa
              </button>
            )}
          </div>
        </form>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hidden text-black/60 hover:underline md:inline-flex">
            Giới thiệu
          </Link>
          <Link href="/contact" className="hidden text-black/60 hover:underline md:inline-flex">
            Liên hệ
          </Link>
          {user ? (
            <>
              <Link href="/me" className="text-black/60 hover:underline">
                Hi, {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-black/10 px-3 py-1 hover:bg-black/5"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
