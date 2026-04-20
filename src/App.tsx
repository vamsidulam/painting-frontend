import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/Home";
import ServicesPage from "@/pages/Services";
import BookingPage from "@/pages/Booking";
import DashboardPage from "@/pages/Dashboard";
import NotFoundPage from "@/pages/NotFound";

export default function App() {
  // BrowserRouter reads `document`, which is undefined during SSR.
  // Defer mount to the client to avoid the server-render crash.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
