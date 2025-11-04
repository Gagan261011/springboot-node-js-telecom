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
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <section className="bg-white rounded-2xl shadow-lg p-10 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 bg-primary-light opacity-20 rounded-full blur-3xl" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="uppercase text-xs tracking-widest text-primary">
            Telecom reinvented
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Power your digital life with flexible mobile, internet, and bundle plans.
          </h1>
          <p className="text-lg text-slate-600">
            From lightning-fast fiber to generous 5G data, Connectify keeps homes and teams connected.
            Choose a plan that matches the way you work, play, and roam.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="px-5 py-3 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Explore plans
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-3 rounded-md bg-white border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      <section id="plans" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Popular plans</h2>
          <Link href="/products" className="text-sm text-primary">
            See all plans
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow text-slate-600">
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
        className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold">Need a tailored enterprise solution?</h2>
          <p className="text-sm text-white/80 mt-2 max-w-xl">
            Our consultants design resilient hybrid connectivity for distributed teams.
            Get a complimentary network assessment and roadmap.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-5 py-3 rounded-md bg-white text-primary font-medium hover:bg-slate-100 transition-colors"
        >
          Book a call
        </Link>
      </section>
    </div>
  );
}
