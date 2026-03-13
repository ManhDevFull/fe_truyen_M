import { Suspense } from "react";
import HomeClient from "./_components/HomeClient";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="py-8 text-sm">Đang tải...</div>}>
      <HomeClient />
    </Suspense>
  );
}
