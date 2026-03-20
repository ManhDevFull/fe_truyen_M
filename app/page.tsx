import { Suspense } from "react";
import type { Metadata } from "next";
import HomeClient from "./_components/HomeClient";

export const metadata: Metadata = {
  title: "Trang Chủ",
  description: "Đọc truyện tranh và truyện chữ trên TruyenM với danh sách xu hướng, truyện vừa cập nhật và thể loại rõ ràng."
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="py-8 text-sm">Đang tải...</div>}>
      <HomeClient />
    </Suspense>
  );
}
