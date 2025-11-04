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
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
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
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = handleSubmit(async (values) => {
    setError(undefined);
    setSuccess(undefined);
    try {
      await apiClient.post("/api/auth/register", values);
      await hydrate();
      setSuccess("Account created. Redirecting to plans...");
      setTimeout(() => {
        router.push("/products");
      }, 800);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow rounded-xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
        <p className="text-sm text-slate-500">
          Unlock personalised offers and manage your subscriptions in one place.
        </p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="fullName"
            className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/70"
            placeholder="Alex Johnson"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-rose-500">{errors.fullName.message}</p>
          )}
        </div>
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="text-xs text-slate-500 text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
