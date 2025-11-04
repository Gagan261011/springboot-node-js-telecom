"use client";

import { useSessionStore } from "@/stores/session-store";
import Link from "next/link";

export default function AccountPage() {
  const { user, loading, hydrate } = useSessionStore((state) => ({
    user: state.user,
    loading: state.loading,
    hydrate: state.hydrate
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Account</h1>
        <p className="text-sm text-slate-500">
          Update your profile details and monitor your subscriptions in one place.
        </p>
      </div>
      {loading ? (
        <div className="bg-white rounded-xl shadow p-6">Loading profile...</div>
      ) : !user ? (
        <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-600">
          You&apos;re not signed in.{" "}
          <Link href="/auth/login" className="text-primary">
            Sign in
          </Link>{" "}
          to access your account.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
            <p className="text-sm text-slate-500">
              These details were provided when you registered.
            </p>
          </div>
          <dl className="grid gap-4">
            <div>
              <dt className="text-xs uppercase text-slate-400 tracking-wide">Full name</dt>
              <dd className="text-sm text-slate-700">{user.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400 tracking-wide">Email</dt>
              <dd className="text-sm text-slate-700">{user.email}</dd>
            </div>
          </dl>
          <button
            onClick={() => void hydrate()}
            className="text-sm text-primary"
          >
            Refresh profile
          </button>
        </div>
      )}
    </div>
  );
}
