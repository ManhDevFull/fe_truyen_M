"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "../../lib/api";
import { ReadingHistoryItem, User } from "../../lib/types";

export default function MePage() {
  const minWithdraw = 10000;
  const [amount, setAmount] = useState(minWithdraw);
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [note, setNote] = useState("");

  const profile = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<User>("/api/me")
  });

  const history = useQuery({
    queryKey: ["me-history"],
    queryFn: () => apiFetch<{ data: ReadingHistoryItem[] }>("/api/me/history")
  });

  if (profile.isLoading) return <div className="text-sm">Loading...</div>;
  if (profile.error) return <div className="text-sm text-red-600">Login required.</div>;

  const points = profile.data?.points ?? 0;
  const canWithdraw = points >= minWithdraw;
  const withdrawals: any[] = [];

  function submitWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!canWithdraw) {
      toast.error(`Số dư tối thiểu để rút là ${minWithdraw.toLocaleString()} VND`);
      return;
    }
    if (!bankName.trim() || !bankAccount.trim()) {
      toast.error("Vui lòng nhập ngân hàng và số tài khoản");
      return;
    }
    toast.success("Đã gửi yêu cầu rút tiền (demo)");
    setNote("");
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h1 className="text-2xl font-semibold">{profile.data?.username}</h1>
        <p className="text-sm text-black/60">{profile.data?.email}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span>Points: {points.toLocaleString()}</span>
          <span className="relative inline-flex">
            <span className="peer inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/20 text-[11px] text-black/60">
              ?
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-60 -translate-x-1/2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs text-black/70 opacity-0 shadow-md transition peer-hover:opacity-100">
              1 point = 1 VND. Tối thiểu rút {minWithdraw.toLocaleString()} VND.
            </span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="card p-4">
          <h2 className="text-lg font-semibold">Lịch sử đọc</h2>
          <div className="mt-3 space-y-2 text-sm">
            {(history.data?.data || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-black/5 pb-2">
                <div>
                  <p className="font-medium">{item.comic_title}</p>
                  <p className="text-xs text-black/50">
                    Chapter {item.chapter_number} {item.chapter_title ? `- ${item.chapter_title}` : ""}
                  </p>
                </div>
                <span className="text-xs text-black/50">{item.read_at?.slice(0, 10)}</span>
              </div>
            ))}
            {history.isLoading && <div className="text-xs">Loading history...</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-4">
            <h2 className="text-lg font-semibold">Yêu cầu rút tiền</h2>
            <p className="mt-1 text-xs text-black/50">
              1 point = 1 VND. Tối thiểu {minWithdraw.toLocaleString()} VND.
            </p>
            <form onSubmit={submitWithdraw} className="mt-4 space-y-3 text-sm">
              <label className="block space-y-1">
                <span>Số tiền muốn rút (VND)</span>
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block space-y-1">
                <span>Ngân hàng</span>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="VD: Vietcombank"
                  className="w-full rounded-lg border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block space-y-1">
                <span>Số tài khoản</span>
                <input
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Nhập số tài khoản"
                  className="w-full rounded-lg border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block space-y-1">
                <span>Ghi chú</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tên chủ tài khoản, chi nhánh..."
                  className="w-full rounded-lg border border-black/20 px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={!canWithdraw}
                className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {canWithdraw ? "Gửi yêu cầu" : "Chưa đủ điểm để rút"}
              </button>
            </form>
          </div>

          <div className="card p-4">
            <h2 className="text-lg font-semibold">Lịch sử rút tiền</h2>
            {withdrawals.length === 0 ? (
              <p className="mt-2 text-sm text-black/50">Chưa có yêu cầu rút nào.</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm">
                {withdrawals.map((w: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between border-b border-black/5 pb-2">
                    <div>
                      <p className="font-medium">{w.amount.toLocaleString()} VND</p>
                      <p className="text-xs text-black/50">{w.status}</p>
                    </div>
                    <span className="text-xs text-black/50">{w.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
