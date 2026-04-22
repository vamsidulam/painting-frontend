export const revenueSeries = [
  { label: "Mon", revenue: 4200 },
  { label: "Tue", revenue: 5100 },
  { label: "Wed", revenue: 4800 },
  { label: "Thu", revenue: 6200 },
  { label: "Fri", revenue: 7400 },
  { label: "Sat", revenue: 8900 },
  { label: "Sun", revenue: 7800 },
];

export const ordersSeries = [
  { label: "Mon", orders: 28 },
  { label: "Tue", orders: 34 },
  { label: "Wed", orders: 31 },
  { label: "Thu", orders: 42 },
  { label: "Fri", orders: 51 },
  { label: "Sat", orders: 62 },
  { label: "Sun", orders: 47 },
];

export type OrdersPeriod = "week" | "month" | "year";

export const ordersByPeriod: Record<
  OrdersPeriod,
  { label: string; orders: number }[]
> = {
  week: [
    { label: "Mon", orders: 28 },
    { label: "Tue", orders: 34 },
    { label: "Wed", orders: 31 },
    { label: "Thu", orders: 42 },
    { label: "Fri", orders: 51 },
    { label: "Sat", orders: 62 },
    { label: "Sun", orders: 47 },
  ],
  month: [
    { label: "Wk 1", orders: 184 },
    { label: "Wk 2", orders: 227 },
    { label: "Wk 3", orders: 201 },
    { label: "Wk 4", orders: 258 },
  ],
  year: [
    { label: "Jan", orders: 620 },
    { label: "Feb", orders: 710 },
    { label: "Mar", orders: 845 },
    { label: "Apr", orders: 902 },
    { label: "May", orders: 1_040 },
    { label: "Jun", orders: 1_185 },
    { label: "Jul", orders: 1_260 },
    { label: "Aug", orders: 1_198 },
    { label: "Sep", orders: 1_075 },
    { label: "Oct", orders: 1_320 },
    { label: "Nov", orders: 1_410 },
    { label: "Dec", orders: 1_550 },
  ],
};

export const weekOptions = [
  { value: "this", label: "This week" },
  { value: "last", label: "Last week" },
  { value: "w-2", label: "2 weeks ago" },
  { value: "w-3", label: "3 weeks ago" },
];

export const monthOptions = [
  { value: "2026-04", label: "April 2026" },
  { value: "2026-03", label: "March 2026" },
  { value: "2026-02", label: "February 2026" },
  { value: "2026-01", label: "January 2026" },
];

export const yearOptions = [
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
];

export const statusDistribution = [
  { name: "Completed", value: 742, color: "var(--success)" },
  { name: "Pending", value: 284, color: "var(--warning)" },
  { name: "Cancelled", value: 96, color: "var(--destructive)" },
];

export type OrderRow = {
  id: string;
  customer: string;
  service: string;
  amount: number;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
};

export const recentOrders: OrderRow[] = [
  { id: "BRS-1248", customer: "Sarah Mitchell", service: "Interior", amount: 1240, status: "In Progress" },
  { id: "BRS-1247", customer: "James Carter", service: "Commercial", amount: 8900, status: "Pending" },
  { id: "BRS-1246", customer: "Aisha Rahman", service: "Exterior", amount: 3450, status: "Completed" },
  { id: "BRS-1245", customer: "Marcus Chen", service: "Wall Repair", amount: 320, status: "Completed" },
  { id: "BRS-1244", customer: "Olivia Park", service: "Interior", amount: 2100, status: "In Progress" },
  { id: "BRS-1243", customer: "Daniel Reed", service: "Exterior", amount: 4780, status: "Pending" },
  { id: "BRS-1242", customer: "Emma Wilson", service: "Interior", amount: 1850, status: "Cancelled" },
  { id: "BRS-1241", customer: "Noah Patel", service: "Commercial", amount: 12400, status: "Completed" },
  { id: "BRS-1240", customer: "Isabella Garcia", service: "Wall Repair", amount: 480, status: "Completed" },
  { id: "BRS-1239", customer: "Liam Brooks", service: "Exterior", amount: 5230, status: "In Progress" },
  { id: "BRS-1238", customer: "Sophia Nguyen", service: "Interior", amount: 2670, status: "Pending" },
  { id: "BRS-1237", customer: "Ethan Rivera", service: "Commercial", amount: 7600, status: "Cancelled" },
];
