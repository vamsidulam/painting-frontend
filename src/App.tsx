import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import HomePage from "@/pages/Home";
import ServicesPage from "@/pages/Services";
import BookingPage from "@/pages/Booking";
import NotFoundPage from "@/pages/NotFound";
import AdminLoginPage from "@/pages/admin/Login";
import SetPasswordPage from "@/pages/admin/SetPassword";
import OverviewPage from "@/pages/admin/Overview";
import OrdersPage from "@/pages/admin/Orders";
import UserManagementPage from "@/pages/admin/UserManagement";
import ServiceManagementPage from "@/pages/admin/ServiceManagement";
import { AdminLayout, ProtectedRoute } from "@/components/admin/layout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingPage />} />

          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/set-password" element={<SetPasswordPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<OverviewPage />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/usermanagement" element={<UserManagementPage />} />
            <Route path="/admin/servicemanagement" element={<ServiceManagementPage />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
