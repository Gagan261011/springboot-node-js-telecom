import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import Link from "next/link";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  const base =
    process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
  try {
    const response = await fetch(`${base}/api/products/${id}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as Product;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Plan not found</h1>
        <p className="text-sm text-slate-500">
          The plan you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link href="/products" className="text-primary">
          Back to plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link href="/products" className="text-sm text-primary">
        &larr; Back to plans
      </Link>
      <ProductCard product={product} />
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Why customers love this plan</h2>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
          <li>Transparent pricing with no hidden fees.</li>
          <li>Flexible upgrades and add-ons from your dashboard.</li>
          <li>Dedicated support team with 24/7 troubleshooting.</li>
        </ul>
      </section>
    </div>
  );
}
