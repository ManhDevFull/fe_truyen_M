import "./globals.css";
import Script from "next/script";
import Providers from "./providers";
import { Toaster } from "sonner";
import SiteHeader from "./components/site-header";
import FollowNotifications from "./components/follow-notifications";
import AdblockGuard from "./components/adblock-guard";
import Link from "next/link";

export const metadata = {
  title: "TruyenM",
  description: "Nền tảng đọc truyện nhẹ và nhanh"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c7522a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <Script src="/ads.js" strategy="afterInteractive" />
        <Providers>
          <Toaster richColors position="top-right" />
          <AdblockGuard />
          <SiteHeader />
          <FollowNotifications />
          <main className="container !py-0">{children}</main>
          <footer className="mt-6 border-t border-black/10 bg-white">
            <div className="container grid gap-6 py-8 text-sm md:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <img src="/logo.svg" alt="TruyenM" className="h-7 w-7" />
                  <span>TruyenM</span>
                </div>
                <p className="mt-2 text-black/60">Nền tảng đọc truyện nhẹ và nhanh.</p>
                <p className="mt-2 text-black/60">Địa chỉ: 123 Nguyễn Trãi, TP.HCM</p>
              </div>
              <div>
                <div className="font-medium">Liên hệ</div>
                <ul className="mt-2 space-y-1 text-black/60">
                  <li>Email: ntmanh@ntmanh.io.vn</li>
                  <li>Điện thoại: 0900 000 000</li>
                </ul>
              </div>
              <div>
                <div className="font-medium">Giới thiệu</div>
                <ul className="mt-2 space-y-1 text-black/60">
                  <li>
                    <Link href="/about" className="hover:underline">
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:underline">
                      Điều khoản dịch vụ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
