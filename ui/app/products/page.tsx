"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { Product, ProductType } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Alert from "@/components/Alert";
import { useSessionStore } from "@/stores/session-store";

const tabs: ProductType[] = ["MOBILE", "INTERNET", "BUNDLE"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<ProductType | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get<Product[]>("/api/products");
        setProducts(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "ALL") {
      return products;
    }
    return products.filter((product) => product.type === activeTab);
  }, [products, activeTab]);

  const handleAddToCart = async (productId: number) => {
    setMessage(undefined);
    setError(undefined);
    if (!user) {
      setError("Sign in to add plans to your cart.");
      return;
    }
    try {
      await apiClient.post("/api/orders/cart", { productId, qty: 1 });
      setMessage("Plan added to your cart.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">Choose your plan</h1>
        <p className="text-sm text-slate-500">
          Mix and match mobile, internet, and bundle offers that fit the way you stay connected.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-full border text-sm transition-colors ${
            activeTab === "ALL"
              ? "bg-primary text-white border-primary"
              : "border-slate-200 text-slate-600 hover:bg-surface"
          }`}
        >
          All
        </button>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors capitalize ${
              activeTab === tab
                ? "bg-primary text-white border-primary"
                : "border-slate-200 text-slate-600 hover:bg-surface"
            }`}
          >
            {tab.toLowerCase()}
          </button>
        ))}
      </div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow">Loading plans...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow text-slate-600">
          No plans available for this category yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
