export type OrderStatus = "requested" | "accepted" | "rejected";
export type OrderWorkStatus = "pending" | "started" | "completed";
export type OrderCategory = "interior" | "exterior";
export type OrderPropertyType = "apartment" | "villa" | "building" | "office";

export type OrderAddress = {
  doorNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type OrderServiceSnapshot = {
  id?: string;
  name: string;
  cost: number;
};

export type OrderRecord = {
  id: string;
  category: OrderCategory;
  service: OrderServiceSnapshot;
  propertyType: OrderPropertyType;
  sqft: number;
  totalCost: number;
  address: OrderAddress;
  customer: OrderCustomer;
  screenshotUrl: string;
  status: OrderStatus;
  workStatus: OrderWorkStatus | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type StatusFilter = "all" | OrderStatus;
export type WorkStatusFilter = "all" | OrderWorkStatus;

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatAddress(a: OrderAddress): string {
  return [a.doorNumber, a.street, a.city, a.district, a.state, a.pincode]
    .filter((p) => p && p.trim())
    .join(", ");
}
