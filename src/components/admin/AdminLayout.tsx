import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  GraduationCap,
  FileText,
  MessageCircle,
  Receipt,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Image,
  Palette,
  FileEdit,
  Tag
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const navigation = [
  { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Réservations", href: "/admin/reservations", icon: Calendar },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Services", href: "/admin/services", icon: Scissors },
  { name: "Formations", href: "/admin/formations", icon: GraduationCap },
  { name: "Équipe", href: "/admin/equipe", icon: Users },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Catégories Blog", href: "/admin/blog-categories", icon: Tag },
  { name: "Commentaires", href: "/admin/commentaires", icon: MessageCircle },
  { name: "Devis", href: "/admin/devis", icon: FileEdit },
  { name: "Factures", href: "/admin/factures", icon: Receipt },
  { name: "Contenus", href: "/admin/contenus", icon: FileText },
  { name: "Médiathèque", href: "/admin/medias", icon: Image },
  { name: "Thème", href: "/admin/theme", icon: Palette },
  { name: "Paramètres", href: "/admin/parametres", icon: Settings },
];

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-elegant font-bold text-sm">A</span>
              </div>
              <span className="font-elegant text-lg font-bold text-foreground">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            {sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
          {sidebarOpen && profile && (
            <div className="text-sm">
              <p className="font-medium text-foreground truncate">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-muted-foreground truncate text-xs">{profile.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 flex items-center px-6">
          <div>
            <h1 className="font-elegant text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
