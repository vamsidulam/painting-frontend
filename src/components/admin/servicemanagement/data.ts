export type ServiceCategoryRecord = {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type WorkType = "fresh" | "repainting";

export const WORK_TYPE_OPTIONS: { value: WorkType; label: string }[] = [
  { value: "fresh", label: "Fresh Painting" },
  { value: "repainting", label: "Repainting" },
];

export function workTypeLabel(value: WorkType | string | undefined): string {
  if (value === "repainting") return "Repainting";
  return "Fresh Painting";
}

export type ServiceRecord = {
  id: string;
  name: string;
  cost: number;
  description: string;
  image: string;
  workType: WorkType;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    image?: string;
    description?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type CategoryFilter = "all" | string;

export function formatCurrency(value: number): string {
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
