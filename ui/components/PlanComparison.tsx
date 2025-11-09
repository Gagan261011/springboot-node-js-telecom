import { Product } from "@/types/product";

interface Props {
  plans: Product[];
}

export default function PlanComparison({ plans }: Props) {
  return (
    <section className="rounded-3xl border border-white/15 bg-[var(--card-bg)]/90 p-6 shadow-lg backdrop-blur dark:bg-ink-900/70">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Compare featured bundles</h2>
        <p className="text-xs uppercase tracking-[0.35em] text-brand-600/70 dark:text-brand-200">
          {plans.length} curated bundles
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-ink-600 dark:text-slate-300">
          <thead className="text-xs uppercase tracking-wide text-ink-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Top Feature</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border-t border-white/10 transition hover:bg-brand-500/5 dark:hover:bg-white/5"
              >
                <td className="px-4 py-3 font-semibold text-ink-900 dark:text-white">{plan.name}</td>
                <td className="px-4 py-3 capitalize text-brand-600 dark:text-brand-300">
                  {plan.type.toLowerCase()}
                </td>
                <td className="px-4 py-3 font-semibold text-ink-900 dark:text-white">
                  EUR {plan.priceMonthly.toFixed(2)}/mo
                </td>
                <td className="px-4 py-3">
                  {plan.features.length > 0 ? plan.features[0] : "Flexible selection"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
