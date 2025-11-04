import { Product } from "@/types/product";

interface Props {
  plans: Product[];
}

export default function PlanComparison({ plans }: Props) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Compare featured bundles
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Top Feature</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-t last:border-b">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {plan.name}
                </td>
                <td className="px-4 py-3 capitalize">{plan.type.toLowerCase()}</td>
                <td className="px-4 py-3">EUR {plan.priceMonthly.toFixed(2)}/mo</td>
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
