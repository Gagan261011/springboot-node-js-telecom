"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@/components/Alert";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { CartItem, Order } from "@/types/order";
import { Product } from "@/types/product";
import Link from "next/link";

interface CartViewItem {
  cart: CartItem;
  product: Product | undefined;
}

export default function CartPage() {
  const [items, setItems] = useState<CartViewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [lastOrder, setLastOrder] = useState<Order | undefined>();

  const refresh = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const [cartResponse, productsResponse] = await Promise.all([
        apiClient.get<CartItem[]>("/api/orders/cart"),
        apiClient.get<Product[]>("/api/products")
      ]);
      const productsMap = new Map(
        productsResponse.data.map((product) => [product.id, product] as const)
      );
      setItems(
        cartResponse.data.map((cart) => ({
          cart,
          product: productsMap.get(cart.productId)
        }))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const removeItem = async (id: number) => {
    setError(undefined);
    try {
      await apiClient.delete(`/api/orders/cart/${id}`);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const checkout = async () => {
    setMessage(undefined);
    setError(undefined);
    try {
      const response = await apiClient.post<Order>("/api/orders/checkout");
      setLastOrder(response.data);
      setMessage("Checkout complete. Invoice is ready on the billing page.");
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item.product) return sum;
      return sum + item.product.priceMonthly * item.cart.quantity;
    }, 0);
  }, [items]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Your cart</h1>
        <p className="text-sm text-slate-500">
          Review the plans you&apos;ve selected before completing your order.
        </p>
      </div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-6">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-600">
          Your cart is empty. Explore{" "}
          <Link href="/products" className="text-primary">
            plans
          </Link>{" "}
          to add one.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.cart.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {item.product?.name ?? "Unknown plan"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.product?.type.toLowerCase()}
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.cart.quantity}</td>
                  <td className="px-4 py-3">
                    EUR {((item.product?.priceMonthly ?? 0) * item.cart.quantity).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => void removeItem(item.cart.id)}
                      className="text-xs text-rose-500 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-4 border-t bg-slate-50">
            <span className="text-sm text-slate-500">Total monthly</span>
            <span className="text-xl font-semibold text-slate-900">
              EUR {total.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => void checkout()}
          disabled={items.length === 0}
          className="px-5 py-3 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          Checkout
        </button>
      </div>
      {lastOrder && (
        <div className="bg-white rounded-xl shadow p-6 space-y-2 text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <p>Order ID #{lastOrder.id}</p>
          <p>Status: {lastOrder.status}</p>
          <p>Total: EUR {Number(lastOrder.total).toFixed(2)}</p>
          <Link href="/billing" className="text-primary">
            View invoice
          </Link>
        </div>
      )}
    </div>
  );
}
