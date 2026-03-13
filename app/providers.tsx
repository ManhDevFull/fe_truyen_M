"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { API_BASE } from "../lib/api";
import { useAuthStore } from "../lib/store";

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          credentials: "include"
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.token && data?.user) {
          setAuth(data.token, data.user);
        }
      } catch {
        // ignore
      }
    };
    run();
  }, [setAuth]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
