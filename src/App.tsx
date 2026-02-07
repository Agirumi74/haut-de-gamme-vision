import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SkipLink } from "@/components/ui/skip-link";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MaquillageProPage from "./pages/services/MaquillageProPage";
import FormationsPage from "./pages/services/FormationsPage";
import ConsultationsVIPPage from "./pages/services/ConsultationsVIPPage";
import RelookingPage from "./pages/services/RelookingPage";
import ReservationPage from "./pages/ReservationPage";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

// Blog pages
import BlogPage from "./pages/blog/BlogPage";
import BlogPostPage from "./pages/blog/BlogPostPage";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFormations from "./pages/admin/AdminFormations";
import AdminServices from "./pages/admin/AdminServices";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminClients from "./pages/admin/AdminClients";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogCategories from "./pages/admin/AdminBlogCategories";
import AdminComments from "./pages/admin/AdminComments";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminContent from "./pages/admin/AdminContent";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminTheme from "./pages/admin/AdminTheme";
import AdminTeam from "./pages/admin/AdminTeam";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
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
            
            {/* Blog routes */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            
            {/* Auth routes */}
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route 
              path="/profil" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin auth routes */}
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
            <Route 
              path="/admin/blog" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBlog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog-categories" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBlogCategories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/commentaires" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminComments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/equipe" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/factures" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminInvoices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/devis" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminQuotes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/parametres" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/contenus" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/medias" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminMedia />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/theme" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTheme />
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
