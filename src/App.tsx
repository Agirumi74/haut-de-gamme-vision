import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SkipLink } from "@/components/ui/skip-link";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MaquillageProPage from "./pages/services/MaquillageProPage";
import FormationsPage from "./pages/services/FormationsPage";
import ConsultationsVIPPage from "./pages/services/ConsultationsVIPPage";
import RelookingPage from "./pages/services/RelookingPage";
import ReservationPage from "./pages/ReservationPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFormations from "./pages/admin/AdminFormations";
import AdminServices from "./pages/admin/AdminServices";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminClients from "./pages/admin/AdminClients";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SkipLink />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/services/maquillage-professionnel" element={<MaquillageProPage />} />
            <Route path="/services/formations" element={<FormationsPage />} />
            <Route path="/services/consultations-vip" element={<ConsultationsVIPPage />} />
            <Route path="/services/relooking-complet" element={<RelookingPage />} />
            
            {/* Auth routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            
            {/* Protected admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/formations" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminFormations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/services" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reservations" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminReservations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/clients" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminClients />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
