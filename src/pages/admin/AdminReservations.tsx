import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
  Search,
  Loader2,
  User
} from 'lucide-react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from 'sonner';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface Reservation {
  id: string;
  client_id: string;
  service_id: string | null;
  formation_id: string | null;
  date: string;
  time: string;
  status: ReservationStatus;
  notes: string | null;
  created_at: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Formation {
  id: string;
  title: string;
  price: number;
  duration: number;
}

const statusConfig: Record<ReservationStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'En attente', color: 'bg-warning/20 text-warning-foreground border-warning/30', icon: Hourglass },
  confirmed: { label: 'Confirmée', color: 'bg-success/20 text-success border-success/30', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-destructive/20 text-destructive border-destructive/30', icon: XCircle },
  completed: { label: 'Terminée', color: 'bg-info/20 text-info border-info/30', icon: CheckCircle }
};

const AdminReservations = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    formation_id: '',
    date: '',
    time: '',
    notes: ''
  });

  // Fetch all data
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data as Reservation[];
    }
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['admin-clients-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('id, first_name, last_name, email');
      if (error) throw error;
      return data as Client[];
    }
  });

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('id, name, price, duration').eq('is_active', true);
      if (error) throw error;
      return data as Service[];
    }
  });

  const { data: formations = [] } = useQuery({
    queryKey: ['admin-formations-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('formations').select('id, title, price, duration').eq('is_active', true);
      if (error) throw error;
      return data as Formation[];
    }
  });

  // Create reservation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('reservations').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Réservation créée');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erreur lors de la création')
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
      const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Statut mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour')
  });

  const resetForm = () => {
    setFormData({ client_id: '', service_id: '', formation_id: '', date: '', time: '', notes: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      client_id: formData.client_id,
      service_id: formData.service_id || null,
      formation_id: formData.formation_id || null,
      date: formData.date,
      time: formData.time,
      status: 'pending',
      notes: formData.notes || null
    });
  };

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getService = (id: string | null) => id ? services.find(s => s.id === id) : null;
  const getFormation = (id: string | null) => id ? formations.find(f => f.id === id) : null;

  // Filter reservations
  const filteredReservations = reservations.filter(r => {
    const client = getClient(r.client_id);
    const matchesSearch = !searchTerm || 
      (client && `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    total: reservations.length
  };

  return (
    <AdminLayout title="Gestion des Réservations" description="Gérez les rendez-vous et réservations">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Hourglass className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Confirmées</p>
                <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-info" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-luxury text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle réservation</DialogTitle>
                  <DialogDescription>Créez une nouvelle réservation pour un client</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.first_name} {c.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service (optionnel)</Label>
                    <Select value={formData.service_id} onValueChange={(v) => setFormData({ ...formData, service_id: v, formation_id: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} - {s.price}€
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Formation (optionnel)</Label>
                    <Select value={formData.formation_id} onValueChange={(v) => setFormData({ ...formData, formation_id: v, service_id: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une formation" />
                      </SelectTrigger>
                      <SelectContent>
                        {formations.map(f => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.title} - {f.price}€
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Heure</Label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Notes sur la réservation..."
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || !formData.client_id}
                      className="bg-gradient-luxury text-primary-foreground"
                    >
                      {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Créer
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune réservation trouvée</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service/Formation</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => {
                  const client = getClient(reservation.client_id);
                  const service = getService(reservation.service_id);
                  const formation = getFormation(reservation.formation_id);
                  const config = statusConfig[reservation.status];
                  const StatusIcon = config.icon;

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {client ? `${client.first_name} ${client.last_name}` : 'Client inconnu'}
                            </p>
                            {client && <p className="text-xs text-muted-foreground">{client.email}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {service ? service.name : formation ? formation.title : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {format(new Date(reservation.date), "d MMM yyyy", { locale: fr })}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reservation.time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select 
                          value={reservation.status} 
                          onValueChange={(v) => updateStatusMutation.mutate({ id: reservation.id, status: v as ReservationStatus })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="completed">Terminée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminReservations;
