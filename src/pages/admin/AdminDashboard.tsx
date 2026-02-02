import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Users, 
  FileText,
  Receipt,
  MessageCircle,
  TrendingUp,
  Euro,
  Loader2
} from 'lucide-react';

interface Stats {
  clients: number;
  reservations: number;
  services: number;
  formations: number;
  blogPosts: number;
  pendingComments: number;
  totalRevenue: number;
  pendingInvoices: number;
}

const AdminDashboard = () => {
  const { isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    reservations: 0,
    services: 0,
    formations: 0,
    blogPosts: 0,
    pendingComments: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        clientsRes,
        reservationsRes,
        servicesRes,
        formationsRes,
        postsRes,
        commentsRes,
        invoicesRes
      ] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('reservations').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('formations').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('blog_comments').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('invoices').select('total, status')
      ]);

      const invoices = invoicesRes.data || [];
      const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0);
      const pendingInvoices = invoices.filter(i => ['draft', 'sent'].includes(i.status)).length;

      setStats({
        clients: clientsRes.count || 0,
        reservations: reservationsRes.count || 0,
        services: servicesRes.count || 0,
        formations: formationsRes.count || 0,
        blogPosts: postsRes.count || 0,
        pendingComments: commentsRes.count || 0,
        totalRevenue,
        pendingInvoices
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Clients', value: stats.clients, icon: Users, color: 'text-blue-500', href: '/admin/clients' },
    { title: 'Réservations', value: stats.reservations, icon: Calendar, color: 'text-emerald-500', href: '/admin/reservations' },
    { title: 'Services actifs', value: stats.services, icon: Sparkles, color: 'text-amber-500', href: '/admin/services' },
    { title: 'Formations', value: stats.formations, icon: GraduationCap, color: 'text-purple-500', href: '/admin/formations' },
  ];

  const quickActions = [
    { title: 'Gérer le blog', description: `${stats.blogPosts} articles publiés`, icon: FileText, href: '/admin/blog', badge: stats.pendingComments > 0 ? `${stats.pendingComments} commentaire(s) en attente` : null },
    { title: 'Commentaires', description: 'Modérer les commentaires', icon: MessageCircle, href: '/admin/commentaires', badge: stats.pendingComments > 0 ? stats.pendingComments : null },
    { title: 'Facturation', description: `${stats.pendingInvoices} factures en attente`, icon: Receipt, href: '/admin/factures' },
  ];

  return (
    <AdminLayout title="Tableau de bord" description="Vue d'ensemble de votre activité">
      {/* Revenue Card */}
      <Card className="mb-6 border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chiffre d'affaires total</p>
              <p className="text-4xl font-bold text-foreground">{stats.totalRevenue.toFixed(2)} €</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Euro className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-elegant text-xl font-semibold text-foreground mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <action.icon className="h-5 w-5 text-primary" />
                  {action.badge && (
                    <span className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
