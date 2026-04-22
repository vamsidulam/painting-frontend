import { UsersPanel } from "./UsersPanel";

export function CustomersTab() {
  return (
    <UsersPanel
      role="customer"
      title="Customers"
      description="People who have booked a service through Brushly."
    />
  );
}
