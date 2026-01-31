import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Users, 
  LogOut,
  Settings,
  Loader2,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center" role="status" aria-label="Chargement">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4" role="alert">
        <Card className="max-w-md w-full card-shadow">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Settings className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-elegant font-bold">Accès restreint</h2>
            <p className="text-muted-foreground">
              Votre compte n'a pas les privilèges administrateur nécessaires pour accéder à cette page.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Se déconnecter
              </Button>
              <Link 
                to="/"
                className="text-primary hover:underline text-sm"
              >
                Retour au site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Formations',
      description: 'Gérer les formations et leurs contenus',
      icon: GraduationCap,
      href: '/admin/formations',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Services',
      description: 'Gérer les prestations et tarifs',
      icon: Sparkles,
      href: '/admin/services',
      color: 'from-primary to-primary-glow'
    },
    {
      title: 'Réservations',
      description: 'Voir et gérer les réservations',
      icon: Calendar,
      href: '/admin/reservations',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Clients',
      description: 'Gérer la base de données clients',
      icon: Users,
      href: '/admin/clients',
      color: 'from-orange-500 to-amber-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-elegant font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Administration
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Artisan Beauty</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {profile?.first_name} {profile?.last_name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-elegant font-bold text-foreground mb-2">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Gérez votre site web et vos données depuis cette interface.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <nav aria-label="Menu principal" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl"
              >
                <Card className="hover:shadow-luxury transition-all duration-300 h-full border-border/50 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </nav>

        {/* Quick Links */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              Liens rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-1"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Voir le site public
              </Link>
              <Link 
                to="/admin/formations" 
                className="flex items-center gap-2 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-1"
              >
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Ajouter une formation
              </Link>
              <Link 
                to="/admin/services" 
                className="flex items-center gap-2 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-1"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Ajouter un service
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
