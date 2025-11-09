import ProductCard from "@/components/ProductCard";
import PlanComparison from "@/components/PlanComparison";
import { Product } from "@/types/product";
import Link from "next/link";

async function getProducts(): Promise<Product[]> {
  const base =
    process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
  try {
    const response = await fetch(`${base}/api/products`, {
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error("Failed to load products");
    }
    return (await response.json()) as Product[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-brand-900/60 via-ink-900/70 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-6xl space-y-12 px-4 py-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-ink-900 text-white shadow-glow">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent-400/40 blur-3xl" />
          <div className="relative grid gap-10 p-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                Telecom reinvented
              </span>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Power your digital life with bold, flexible mobile, fiber, and bundle plans.
              </h1>
              <p className="text-lg text-white/70">
                From lightning-fast fiber to generous 5G data, Connectify keeps homes and teams connected. Choose a plan
                that matches how you work, play, and roam without compromise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition hover:-translate-y-0.5"
                >
                  Explore plans
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white"
                >
                  Create account
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/60">Top metric</p>
                  <p className="text-4xl font-bold">4.9/5</p>
                  <p className="text-sm text-white/60">Average satisfaction across 12k+ households</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-xs uppercase tracking-widest text-white/70">
                  <div className="rounded-2xl border border-white/10 p-4">
                    <p className="text-3xl font-semibold">5G</p>
                    <p>Nationwide</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 p-4">
                    <p className="text-3xl font-semibold">1 GB</p>
                    <p>Fiber speeds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-ink-900 dark:text-white">Popular plans</h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:gap-3 dark:text-brand-400"
            >
              See all plans ->
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-white/70 p-6 text-sm text-ink-600 shadow dark:border-white/10 dark:bg-ink-800/60 dark:text-white/80">
              Plans are loading. Try again shortly.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {products.length > 0 && (
          <PlanComparison plans={products.filter((p) => p.type === "BUNDLE").slice(0, 3)} />
        )}

        <section
          id="support"
          className="flex flex-col gap-6 rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-600 via-ink-900 to-ink-900 p-10 text-white shadow-glow md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Need a tailored enterprise solution?</h2>
            <p className="text-sm text-white/80">
              Our consultants design resilient hybrid connectivity for distributed teams. Get a complimentary network
              assessment and roadmap.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-white"
          >
            Book a call
          </Link>
        </section>
      </div>
    </div>
  );
}
