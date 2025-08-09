import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  GraduationCap,
  Clock,
  Euro,
  Users,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api";

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  price: number;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: '',
    price: '',
    maxStudents: '10'
  });

  useEffect(() => {
    checkAuthAndLoadFormations();
  }, []);

  const checkAuthAndLoadFormations = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      if (userData.role !== 'ADMIN') {
        navigate('/admin/login');
        return;
      }
      await loadFormations();
    } catch (error) {
      navigate('/admin/login');
    }
  };

  const loadFormations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFormations();
      setFormations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      level: '',
      price: '',
      maxStudents: '10'
    });
    setEditingFormation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        level: formData.level,
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents)
      };

      if (editingFormation) {
        await apiClient.updateFormation(editingFormation.id, data);
      } else {
        await apiClient.createFormation(data);
      }

      await loadFormations();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (formation: Formation) => {
    setFormData({
      title: formation.title,
      description: formation.description,
      duration: formation.duration.toString(),
      level: formation.level,
      price: formation.price.toString(),
      maxStudents: formation.maxStudents.toString()
    });
    setEditingFormation(formation);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      return;
    }

    try {
      await apiClient.deleteFormation(id);
      await loadFormations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des formations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <GraduationCap className="h-8 w-8 text-pink-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gestion des Formations
              </h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Formation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations de la formation
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Durée (heures)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="level">Niveau</Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="débutant">Débutant</SelectItem>
                          <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                          <SelectItem value="avancé">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Prix (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxStudents">Nombre max d'étudiants</Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        min="1"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingFormation ? 'Modifier' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((formation) => (
            <Card key={formation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{formation.title}</CardTitle>
                    <Badge className={`mt-2 ${getLevelColor(formation.level)}`}>
                      {formation.level}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(formation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(formation.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {formation.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {formation.duration} heures
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Euro className="h-4 w-4 mr-2" />
                    {formation.price}€
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Max {formation.maxStudents} étudiants
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {formations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune formation
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre première formation.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une formation
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminFormations;