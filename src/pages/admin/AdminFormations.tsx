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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GraduationCap,
  Loader2,
  Users,
  Euro
} from 'lucide-react';
import { toast } from 'sonner';

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  price: number;
  max_students: number | null;
  is_active: boolean;
  created_at: string;
}

const AdminFormations = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'Débutant',
    price: '',
    max_students: '10',
    is_active: true
  });

  // Fetch formations
  const { data: formations = [], isLoading } = useQuery({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('title');
      if (error) throw error;
      return data as Formation[];
    }
  });

  // Create
  const createMutation = useMutation({
    mutationFn: async (data: Omit<Formation, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('formations').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
      toast.success('Formation créée');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erreur lors de la création')
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Formation> & { id: string }) => {
      const { error } = await supabase.from('formations').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
      toast.success('Formation mise à jour');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erreur lors de la mise à jour')
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('formations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
      toast.success('Formation supprimée');
    },
    onError: () => toast.error('Erreur lors de la suppression')
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      level: 'Débutant',
      price: '',
      max_students: '10',
      is_active: true
    });
    setEditingFormation(null);
  };

  const handleEdit = (formation: Formation) => {
    setEditingFormation(formation);
    setFormData({
      title: formation.title,
      description: formation.description,
      duration: String(formation.duration),
      level: formation.level,
      price: String(formation.price),
      max_students: String(formation.max_students || 10),
      is_active: formation.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      duration: parseInt(formData.duration),
      level: formData.level,
      price: parseFloat(formData.price),
      max_students: parseInt(formData.max_students),
      is_active: formData.is_active
    };

    if (editingFormation) {
      updateMutation.mutate({ id: editingFormation.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 8) return `${hours}h`;
    return `${Math.round(hours / 8)} jour(s)`;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant': return 'bg-success/20 text-success border-success/30';
      case 'intermédiaire': return 'bg-warning/20 text-warning-foreground border-warning/30';
      case 'avancé': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    total: formations.length,
    active: formations.filter(f => f.is_active).length,
    totalPlaces: formations.reduce((sum, f) => sum + (f.max_students || 0), 0)
  };

  return (
    <AdminLayout title="Gestion des Formations" description="Gérez vos formations et cursus">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total formations</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-info" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Places totales</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalPlaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Formations</h3>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-luxury text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle formation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingFormation ? 'Modifiez les détails de la formation' : 'Ajoutez une nouvelle formation à votre catalogue'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Niveau</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => setFormData({ ...formData, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Débutant">Débutant</SelectItem>
                          <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                          <SelectItem value="Avancé">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (heures)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_students">Places max</Label>
                      <Input
                        id="max_students"
                        type="number"
                        min="1"
                        value={formData.max_students}
                        onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Formation active</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-gradient-luxury text-primary-foreground"
                    >
                      {(createMutation.isPending || updateMutation.isPending) && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {editingFormation ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : formations.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune formation enregistrée</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formations.map((formation) => (
                  <TableRow key={formation.id}>
                    <TableCell className="font-medium">{formation.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLevelBadgeColor(formation.level)}>
                        {formation.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDuration(formation.duration)}</TableCell>
                    <TableCell>{formation.price}€</TableCell>
                    <TableCell>{formation.max_students}</TableCell>
                    <TableCell>
                      <Badge variant={formation.is_active ? "default" : "secondary"}>
                        {formation.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(formation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(formation.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminFormations;
