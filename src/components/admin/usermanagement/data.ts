export type UserRole = "admin" | "customer";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

const IN_PREFIX = "+91";

export function formatPhoneForDisplay(raw: string): string {
  if (!raw) return "";
  return raw.startsWith(IN_PREFIX) ? raw.slice(IN_PREFIX.length) : raw;
}

export function onlyDigits(raw: string, max = 10): string {
  return raw.replace(/\D/g, "").slice(0, max);
}
