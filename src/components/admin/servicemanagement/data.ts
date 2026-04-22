export type ServiceCategory = "interior" | "exterior";

export type ServiceRecord = {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: ServiceCategory;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type CategoryFilter = "all" | ServiceCategory;

export const CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
];

export function formatCurrency(value: number): string {
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
