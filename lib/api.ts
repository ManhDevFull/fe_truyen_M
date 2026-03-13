export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

import { useAuthStore } from "./store";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (res.status === 401 && path !== "/api/auth/refresh") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const retryToken = useAuthStore.getState().token;
      const retry = await fetch(`${API_BASE}${path}`, {
        ...init,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(retryToken ? { Authorization: `Bearer ${retryToken}` } : {}),
          ...(init?.headers || {})
        },
        cache: "no-store"
      });
      if (retry.ok) {
        return (await retry.json()) as T;
      }
    }
  }

  if (!res.ok) {
    const message = await safeText(res);
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.token && data?.user) {
      useAuthStore.getState().setAuth(data.token, data.user);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
