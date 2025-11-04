export interface Invoice {
  id: number;
  orderId: number;
  amount: number;
  status: string;
  issuedAt: string;
  paidAt?: string;
}
