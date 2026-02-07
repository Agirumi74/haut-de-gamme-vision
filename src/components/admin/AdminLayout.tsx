import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  ChevronDown,
  Menu,
  Image,
  Palette,
  FileEdit,
  Tag,
  Newspaper,
  ShoppingBag,
  Briefcase,
  PenTool,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

interface NavGroup {
  name: string;
  icon: any;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const navigationGroups: NavGroup[] = [
  {
    name: "Tableau de bord",
    icon: LayoutDashboard,
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    name: "Blog",
    icon: Newspaper,
    items: [
      { name: "Articles", href: "/admin/blog", icon: FileText },
      { name: "Catégories", href: "/admin/blog-categories", icon: Tag },
      { name: "Commentaires", href: "/admin/commentaires", icon: MessageCircle },
    ]
  },
  {
    name: "Catalogue",
    icon: ShoppingBag,
    items: [
      { name: "Services", href: "/admin/services", icon: Scissors },
      { name: "Formations", href: "/admin/formations", icon: GraduationCap },
    ]
  },
  {
    name: "Business",
    icon: Briefcase,
    items: [
      { name: "Réservations", href: "/admin/reservations", icon: Calendar },
      { name: "Clients", href: "/admin/clients", icon: Users },
      { name: "Devis", href: "/admin/devis", icon: FileEdit },
      { name: "Factures", href: "/admin/factures", icon: Receipt },
    ]
  },
  {
    name: "Site & CMS",
    icon: PenTool,
    items: [
      { name: "Contenus", href: "/admin/contenus", icon: FileText },
      { name: "Équipe", href: "/admin/equipe", icon: UserCheck },
      { name: "Médiathèque", href: "/admin/medias", icon: Image },
      { name: "Thème", href: "/admin/theme", icon: Palette },
    ]
  },
  {
    name: "Configuration",
    icon: Settings,
    items: [
      { name: "Paramètres", href: "/admin/parametres", icon: Settings },
    ]
  },
];

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>(
    navigationGroups.map(g => g.name) // All groups open by default
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => location.pathname === item.href);
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
          <nav className="space-y-2 px-2">
            {navigationGroups.map((group) => {
              const isActive = isGroupActive(group);
              const isOpen = openGroups.includes(group.name);

              // Single item group (like Dashboard)
              if (group.items.length === 1) {
                const item = group.items[0];
                const itemActive = location.pathname === item.href;
                return (
                  <Link
                    key={group.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      itemActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </Link>
                );
              }

              // Multi-item group
              return (
                <Collapsible
                  key={group.name}
                  open={sidebarOpen && isOpen}
                  onOpenChange={() => sidebarOpen && toggleGroup(group.name)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <group.icon className="h-5 w-5 shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="font-semibold flex-1">{group.name}</span>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                          )} />
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ml-4 space-y-1">
                    {group.items.map((item) => {
                      const itemActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                            itemActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
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
