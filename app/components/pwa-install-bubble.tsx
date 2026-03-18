"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstallBubble() {
  const [open, setOpen] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setInstalled(standalone);
    };
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    checkInstalled();
    const onInstalled = () => setInstalled(true);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall as EventListener);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function handleInstall() {
    if (!deferred) {
      toast.message(
        isIOS
          ? "iOS chưa hỗ trợ cài tự động. Mở menu chia sẻ và chọn Add to Home Screen."
          : "Trình duyệt chưa sẵn sàng cài tự động. Hãy mở menu và chọn Install app."
      );
      return;
    }
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setOpen(false);
      setDeferred(null);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-sm shadow-lg"
        aria-label="Cài đặt PWA"
      >
        ⬇
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Cài đặt TruyenM</h2>
            <p className="mt-2 text-sm text-black/70">
              Cài đặt ứng dụng để đọc truyện nhanh hơn, có thể mở offline và nhận thông báo chương mới.
            </p>

            {!deferred && (
              <div className="mt-3 text-xs text-black/50">
                {isIOS
                  ? "iOS Safari: mở menu chia sẻ và chọn “Add to Home Screen”."
                  : "Chrome/Edge: mở menu trình duyệt và chọn “Install app”. Nếu chưa thấy, hãy sử dụng thêm một lúc hoặc refresh."}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleInstall}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                {deferred ? "Cài đặt ngay" : "Hướng dẫn cài đặt"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-black/10 px-4 py-2 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
