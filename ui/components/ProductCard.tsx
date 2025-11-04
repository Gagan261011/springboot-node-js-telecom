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
    <div className="rounded-xl bg-white shadow hover:shadow-lg transition-shadow p-6 flex flex-col gap-4">
      <div>
        <span className="uppercase text-xs tracking-wide text-primary">
          {product.type.toLowerCase()}
        </span>
        <h3 className="text-xl font-semibold mt-2 text-slate-900">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1">{product.description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">
          EUR {product.priceMonthly.toFixed(2)}
        </span>
        <span className="text-sm text-slate-400">/ month</span>
      </div>

      <ul className="space-y-2">
        {product.features.map((feature) => (
          <li key={feature} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {onAddToCart && (
        <button
          onClick={() => onAddToCart(product.id)}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <ShoppingCart size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
