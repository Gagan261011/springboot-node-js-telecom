"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { useState } from "react";
import Alert from "@/components/Alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const hydrate = useSessionStore((state) => state.hydrate);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });
  const [error, setError] = useState<string | undefined>();

  const onSubmit = handleSubmit(async (values) => {
    setError(undefined);
    try {
      await apiClient.post("/api/auth/login", values);
      await hydrate();
      router.push("/products");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow rounded-xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to manage your subscriptions.</p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/70"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-rose-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/70"
            placeholder="Minimum 8 characters"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-rose-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary text-white py-2 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-xs text-slate-500 text-center">
        New to Connectify?{" "}
        <Link href="/auth/register" className="text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
