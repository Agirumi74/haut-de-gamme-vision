import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminFormations, useCreateFormation, useUpdateFormation, useDeleteFormation, type Formation } from '@/hooks/useFormations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';

const AdminFormations = () => {
  const { profile } = useAuth();
  const { data: formations = [], isLoading, error } = useAdminFormations();
  const createFormation = useCreateFormation();
  const updateFormation = useUpdateFormation();
  const deleteFormation = useDeleteFormation();

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
      max_students: String(formation.max_students),
      is_active: formation.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      if (editingFormation) {
        await updateFormation.mutateAsync({ id: editingFormation.id, ...data });
        toast.success('Formation mise à jour avec succès');
      } else {
        await createFormation.mutateAsync(data);
        toast.success('Formation créée avec succès');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      await deleteFormation.mutateAsync(id);
      toast.success('Formation supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 8) return `${hours}h`;
    return `${Math.round(hours / 8)} jour(s)`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Retour</span>
              </Link>
              <h1 className="text-xl font-semibold text-foreground">
                Gestion des Formations
              </h1>
            </div>
            <span className="text-sm text-muted-foreground">
              {profile?.first_name} {profile?.last_name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>Erreur lors du chargement des formations</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Formations</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-luxury text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Nouvelle formation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
                  </DialogTitle>
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
                      disabled={createFormation.isPending || updateFormation.isPending}
                      className="bg-gradient-luxury text-primary-foreground"
                    >
                      {(createFormation.isPending || updateFormation.isPending) && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      )}
                      {editingFormation ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              </div>
            ) : formations.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucune formation enregistrée
              </p>
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          formation.level.toLowerCase() === 'débutant' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : formation.level.toLowerCase() === 'intermédiaire'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {formation.level}
                        </span>
                      </TableCell>
                      <TableCell>{formatDuration(formation.duration)}</TableCell>
                      <TableCell>{formation.price}€</TableCell>
                      <TableCell>{formation.max_students}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          formation.is_active 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {formation.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(formation)}
                          >
                            <Edit className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(formation.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Supprimer</span>
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
      </main>
    </div>
  );
};

export default AdminFormations;
