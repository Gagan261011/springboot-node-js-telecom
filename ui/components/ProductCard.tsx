import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";

interface Props {
  product: Product;
  onAddToCart?: (productId: number) => void;
  actionLabel?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  actionLabel = "Add to cart"
}: Props) {
  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-white/20 bg-[var(--card-bg)]/95 p-6 shadow-lg ring-1 ring-transparent transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow dark:border-white/5 dark:bg-ink-800/70">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-600 dark:bg-white/10 dark:text-white">
          {product.type.toLowerCase()}
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        </span>
        <h3 className="mt-3 text-xl font-semibold text-ink-900 transition group-hover:text-brand-600 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink-600/80 dark:text-slate-300">{product.description}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-ink-900 dark:text-white">
          EUR {product.priceMonthly.toFixed(2)}
        </span>
        <span className="text-sm text-ink-500 dark:text-slate-400">/ month</span>
      </div>

      <ul className="space-y-2 text-sm text-ink-600 dark:text-slate-300">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500 shadow-glow" />
            {feature}
          </li>
        ))}
      </ul>

      {onAddToCart && (
        <button
          onClick={() => onAddToCart(product.id)}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-ink-900 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
        >
          <ShoppingCart size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
