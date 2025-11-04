export type ProductType = "MOBILE" | "INTERNET" | "BUNDLE";

export interface Product {
  id: number;
  sku: string;
  name: string;
  type: ProductType;
  description: string;
  priceMonthly: number;
  features: string[];
  active: boolean;
}
