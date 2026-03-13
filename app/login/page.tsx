"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { AuthResponse } from "../../lib/types";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await apiFetch<AuthResponse>("/api/auth/login", {
              method: "POST",
              body: JSON.stringify({ identifier, password })
            })
          : await apiFetch<AuthResponse>("/api/auth/register", {
              method: "POST",
              body: JSON.stringify({ username, email, password })
            });

      setAuth(res.token, res.user);
      toast.success(mode === "login" ? "Login success" : "Register success");
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex gap-2">
        <button
          className={`flex-1 rounded-xl px-4 py-2 text-sm ${mode === "login" ? "bg-ink text-white" : "bg-white"}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`flex-1 rounded-xl px-4 py-2 text-sm ${mode === "register" ? "bg-ink text-white" : "bg-white"}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        {mode === "login" ? (
          <input
            className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
            placeholder="Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        ) : (
          <>
            <input
              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <input
          type="password"
          className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-xs text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm text-white"
        >
          {loading ? "Working..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </div>
  );
}
