"use client";

import { useEffect, useState } from "react";
import Alert from "@/components/Alert";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { Invoice } from "@/types/billing";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const load = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const response = await apiClient.get<Invoice[]>("/api/billing/my");
      setInvoices(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const payInvoice = async (invoiceId: number) => {
    setError(undefined);
    setMessage(undefined);
    try {
      await apiClient.post(`/api/billing/pay/${invoiceId}`);
      setMessage("Payment processed. Thank you!");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Billing</h1>
        <p className="text-sm text-slate-500">
          Review invoices from your recent orders and pay securely with a single click.
        </p>
      </div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-6">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-600">
          No invoices yet. Complete a checkout to generate your first invoice.
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-xl shadow p-6 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Invoice #{invoice.id}</span>
                <span>{new Date(invoice.issuedAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Order #{invoice.orderId}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    {invoice.status}
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  EUR {Number(invoice.amount).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {invoice.paidAt
                    ? `Paid on ${new Date(invoice.paidAt).toLocaleString()}`
                    : "Awaiting payment"}
                </div>
                <button
                  onClick={() => void payInvoice(invoice.id)}
                  disabled={invoice.status === "PAID"}
                  className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {invoice.status === "PAID" ? "Paid" : "Pay (Mock)"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
