import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { AdminFooter } from "./AdminFooter";

export function AdminLayout() {
  return (
    <div className="h-screen flex bg-secondary/30 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* <AdminNavbar /> */}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <Outlet />
        </main>

        {/* <AdminFooter /> */}
      </div>
    </div>
  );
}
