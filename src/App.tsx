import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MaquillageProPage from "./pages/services/MaquillageProPage";
import FormationsPage from "./pages/services/FormationsPage";
import ConsultationsVIPPage from "./pages/services/ConsultationsVIPPage";
import RelookingPage from "./pages/services/RelookingPage";
import ReservationPage from "./pages/ReservationPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFormations from "./pages/admin/AdminFormations";
import AdminServices from "./pages/admin/AdminServices";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminClients from "./pages/admin/AdminClients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/services/maquillage-professionnel" element={<MaquillageProPage />} />
          <Route path="/services/formations" element={<FormationsPage />} />
          <Route path="/services/consultations-vip" element={<ConsultationsVIPPage />} />
          <Route path="/services/relooking-complet" element={<RelookingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/formations" element={<AdminFormations />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
