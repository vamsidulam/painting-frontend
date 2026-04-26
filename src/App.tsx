import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { FloatingGetQuote } from "@/components/site/FloatingGetQuote";
import HomePage from "@/pages/Home";
import ServicesPage from "@/pages/Services";
import CategoryDetailPage from "@/pages/CategoryDetail";
import CategoryServicesPage from "@/pages/CategoryServices";
import AboutPage from "@/pages/About";
import HelpPage from "@/pages/Help";
import ReviewsPage from "@/pages/ReviewsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import BookingPage from "@/pages/Booking";
import NotFoundPage from "@/pages/NotFound";
import AdminLoginPage from "@/pages/admin/Login";
import SetPasswordPage from "@/pages/admin/SetPassword";
import OverviewPage from "@/pages/admin/Overview";
import OrdersPage from "@/pages/admin/Orders";
import UserManagementPage from "@/pages/admin/UserManagement";
import ServiceManagementPage from "@/pages/admin/ServiceManagement";
import ProjectManagementPage from "@/pages/admin/ProjectManagement";
import { AdminLayout, ProtectedRoute } from "@/components/admin/layout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
          <Route
            path="/categories/:categoryId/:workType"
            element={<CategoryServicesPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
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
            <Route path="/admin/projectmanagement" element={<ProjectManagementPage />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <PublicChrome />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

function PublicChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
     
      <FloatingGetQuote />
      <FloatingWhatsApp side="right" />
    </>
  );
}
