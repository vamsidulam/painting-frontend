export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type PropertyType = "apartment" | "villa" | "building" | "office";

export type WorkType = "fresh" | "repainting";

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  fresh: "Fresh Painting",
  repainting: "Repainting",
};

export type BookingService = {
  id: string;
  name: string;
  cost: number;
  description: string;
  image?: string;
  workType?: WorkType;
  categoryId?: string;
  categoryName?: string;
};

export type BookingAddress = {
  doorNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};

export const EMPTY_ADDRESS: BookingAddress = {
  doorNumber: "",
  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};

export function formatRupees(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
