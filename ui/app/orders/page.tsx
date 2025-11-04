"use client";

import { useEffect, useState } from "react";
import Alert from "@/components/Alert";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { Order } from "@/types/order";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const response = await apiClient.get<Order[]>("/api/orders/my");
      setOrders(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">My orders</h1>
        <p className="text-sm text-slate-500">
          Track your active and completed orders, then pay invoices when you&apos;re ready.
        </p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-6">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-600">
          You have no orders yet. Visit{" "}
          <Link href="/products" className="text-primary">
            Plans
          </Link>{" "}
          to start building your bundle.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-6 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Order #{order.id}</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {order.items.length} item{order.items.length !== 1 && "s"}
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  EUR {Number(order.total).toFixed(2)}
                </div>
              </div>
              <div className="text-xs uppercase tracking-wide text-primary font-medium">
                {order.status}
              </div>
              <Link href={`/billing`} className="text-sm text-primary">
                View invoice
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
