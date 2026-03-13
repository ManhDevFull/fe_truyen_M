"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "adblock_detected";

export default function AdblockGuard() {
  const [adblock, setAdblock] = useState<boolean | null>(null);
  const checkingRef = useRef(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "1") {
      setAdblock(true);
    } else if (stored === "0") {
      setAdblock(false);
    }
  }, []);

  useEffect(() => {
    if (checkingRef.current) return;
    checkingRef.current = true;

    let cancelled = false;
    const bait = document.createElement("div");
    bait.className = "adsbox adsbygoogle ad-banner adunit";
    bait.style.cssText = "position:absolute;left:-9999px;top:-9999px;height:10px;width:10px;";
    document.body.appendChild(bait);

    let scriptLoaded = false;
    let externalLoaded = false;
    const script = document.createElement("script");
    script.src = `/ads.js?adcheck=${Date.now()}`;
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
    };
    script.onerror = () => {
      scriptLoaded = false;
    };
    document.body.appendChild(script);

    const externalScript = document.createElement("script");
    externalScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    externalScript.async = true;
    externalScript.onload = () => {
      externalLoaded = true;
    };
    externalScript.onerror = () => {
      externalLoaded = false;
    };
    document.body.appendChild(externalScript);

    const check = () => {
      if (cancelled) return;
      const styles = window.getComputedStyle(bait);
      const domBlocked =
        bait.offsetHeight === 0 ||
        bait.clientHeight === 0 ||
        styles.display === "none" ||
        styles.visibility === "hidden";
      const scriptBlocked = !(window as any).adsLoaded || !scriptLoaded;
      const externalBlocked = navigator.onLine !== false ? !externalLoaded : false;
      const blocked = domBlocked || scriptBlocked || externalBlocked;
      setAdblock(blocked);
      try {
        window.localStorage.setItem(STORAGE_KEY, blocked ? "1" : "0");
      } catch {
        // ignore
      }
    };

    const timer = window.setTimeout(check, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (script.parentNode) script.parentNode.removeChild(script);
      if (externalScript.parentNode) externalScript.parentNode.removeChild(externalScript);
      if (bait.parentNode) bait.parentNode.removeChild(bait);
      checkingRef.current = false;
    };
  }, []);

  if (!adblock) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Bạn đang chặn quảng cáo</h2>
        <p className="mt-2 text-sm text-black/70">
          Chặn quảng cáo sẽ không nhận được point và điểm xếp hạng.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Tôi đã tắt chặn quảng cáo
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    </div>
  );
}
