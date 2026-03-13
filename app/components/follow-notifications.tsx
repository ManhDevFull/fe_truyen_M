"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "../../lib/api";
import { buildReadPath, buildReadPathFromSlug } from "../../lib/slug";
import { useAuthStore } from "../../lib/store";

const STORAGE_KEY = "truyenm_follow_last_check";
const POLL_INTERVAL = 60_000;

type FollowUpdate = {
  comic_id: number;
  comic_title: string;
  comic_slug?: string;
  comic_cover?: string;
  chapter_id: number;
  chapter_number: number;
  chapter_title?: string;
  created_at: string;
};

export default function FollowNotifications() {
  const token = useAuthStore((s) => s.token);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;

    const notify = async (update: FollowUpdate) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      const title = `${update.comic_title} - Chương ${update.chapter_number}`;
      const body = update.chapter_title || "Có chương mới";
      const url = update.comic_slug
        ? buildReadPathFromSlug(update.comic_slug, update.chapter_number)
        : buildReadPath(update.comic_title, update.chapter_number);
      const options: NotificationOptions = {
        body,
        icon: update.comic_cover || "/icon-192.png",
        data: { url }
      };
      if (navigator.serviceWorker?.ready) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, options);
      } else {
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.open(url, "_blank");
        };
      }
    };

    const poll = async () => {
      if (!active) return;
      const now = new Date().toISOString();
      const last = localStorage.getItem(STORAGE_KEY);
      if (!last) {
        localStorage.setItem(STORAGE_KEY, now);
        return;
      }
      try {
        const res = await apiFetch<{ data: FollowUpdate[] }>(
          `/api/me/follows/updates?since=${encodeURIComponent(last)}`
        );
        if (res.data?.length) {
          for (const item of res.data) {
            await notify(item);
          }
        }
      } catch {
        // ignore
      } finally {
        localStorage.setItem(STORAGE_KEY, now);
      }
    };

    poll();
    timer.current = setInterval(poll, POLL_INTERVAL);
    return () => {
      active = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, [token]);

  return null;
}
