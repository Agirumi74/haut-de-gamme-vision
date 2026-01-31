import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminServices, useCreateService, useUpdateService, useDeleteService, type Service } from '@/hooks/useServices';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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

const AdminServices = () => {
  const { profile } = useAuth();
  const { data: services = [], isLoading, error } = useAdminServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      is_active: true
    });
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      is_active: service.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      is_active: formData.is_active
    };

    try {
      if (editingService) {
        await updateService.mutateAsync({ id: editingService.id, ...data });
        toast.success('Service mis à jour avec succès');
      } else {
        await createService.mutateAsync(data);
        toast.success('Service créé avec succès');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      await deleteService.mutateAsync(id);
      toast.success('Service supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
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
                Gestion des Services
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
            <AlertDescription>Erreur lors du chargement des services</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Services</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-luxury text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Nouveau service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Modifier le service' : 'Nouveau service'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      <Label htmlFor="duration">Durée (min)</Label>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Service actif</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createService.isPending || updateService.isPending}
                      className="bg-gradient-luxury text-primary-foreground"
                    >
                      {(createService.isPending || updateService.isPending) && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      )}
                      {editingService ? 'Mettre à jour' : 'Créer'}
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
            ) : services.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucun service enregistré
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                      <TableCell>{service.price}€</TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          service.is_active 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {service.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
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

export default AdminServices;
