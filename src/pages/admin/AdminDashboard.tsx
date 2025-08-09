import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Users, 
  LogOut,
  Settings
} from 'lucide-react';
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        if (userData.role !== 'ADMIN') {
          navigate('/admin/login');
          return;
        }
        setUser(userData);
      } catch (error) {
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    apiClient.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
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
      color: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Réservations',
      description: 'Voir et gérer les réservations',
      icon: Calendar,
      href: '/admin/reservations',
      color: 'from-green-500 to-emerald-600'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-pink-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Administration - Haut de Gamme Vision
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bonjour, {user?.firstName} {user?.lastName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
          <p className="text-gray-600">
            Gérez votre site web et vos données depuis cette interface d'administration.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href}>
                <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} mr-4`}>
                        <Icon className="h-6 w-6 text-white" />
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
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Liens rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/" className="text-pink-600 hover:text-pink-800 transition-colors">
                → Voir le site public
              </Link>
              <Link to="/admin/formations" className="text-pink-600 hover:text-pink-800 transition-colors">
                → Ajouter une formation
              </Link>
              <Link to="/admin/services" className="text-pink-600 hover:text-pink-800 transition-colors">
                → Ajouter un service
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;