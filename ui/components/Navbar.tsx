"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";

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
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-semibold text-primary">
          Connectify
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/account"
                className="text-sm text-slate-700 hover:text-primary"
              >
                Hi, {user.fullName.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-sm px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-60"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-3 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="text-sm px-3 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
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
