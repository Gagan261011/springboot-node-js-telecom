"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";
import { apiClient } from "@/lib/api-client";
import { useMemo, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/products", label: "Plans" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/billing", label: "Billing" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clear } = useSessionStore((state) => ({
    user: state.user,
    clear: state.clear
  }));
  const [loading, setLoading] = useState(false);
  const initials = useMemo(() => {
    if (!user?.fullName) return undefined;
    return user.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/api/auth/logout");
      clear();
      router.push("/");
    } catch {
      // ignore for logout
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-[var(--card-bg)]/80 backdrop-blur-2xl transition-colors dark:border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="relative inline-flex items-center gap-2">
          <span className="text-xl font-semibold text-ink-900 dark:text-white">
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400 bg-clip-text text-transparent">
              Connectify
            </span>
          </span>
          <span className="hidden rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-brand-600 dark:bg-white/10 dark:text-white md:inline">
            Telecom
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/40 px-2 py-1 text-sm font-medium shadow-glow backdrop-blur md:flex dark:border-white/5 dark:bg-ink-800/60">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-1.5 transition-all ${
                  active
                    ? "bg-white text-brand-600 shadow dark:bg-brand-500/20 dark:text-white"
                    : "text-ink-600 hover:text-brand-500 dark:text-slate-200 dark:hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-0 rounded-full border border-brand-100/70 dark:border-brand-500/50" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/70 px-3 py-1 text-xs font-semibold text-ink-700 backdrop-blur transition hover:-translate-y-0.5 dark:border-white/5 dark:bg-ink-700/80 dark:text-white sm:flex"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold uppercase text-white shadow-glow">
                  {initials}
                </span>
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-wide text-ink-500 dark:text-slate-400">
                    Welcome
                  </span>
                  <span className="text-xs">{user.fullName.split(" ")[0]}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="rounded-full border border-transparent bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-400 disabled:opacity-60"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:-translate-y-0.5 hover:bg-brand-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-gradient-to-r from-brand-500 to-ink-800 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
              >
                Join now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
