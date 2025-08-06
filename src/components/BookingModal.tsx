import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar, Clock, User, Phone, Mail, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    service: "",
    date: "",
    heure: "",
    message: ""
  });

  const services = [
    { value: "maquillage-mariee", label: "Maquillage Mariée - 150€", duration: "2h" },
    { value: "maquillage-soiree", label: "Maquillage Soirée - 80€", duration: "1h30" },
    { value: "formation-particuliere", label: "Formation Particulière - 200€", duration: "3h" },
    { value: "formation-groupe", label: "Formation Groupe - 300€", duration: "4h" },
    { value: "relooking-complet", label: "Relooking Complet - 250€", duration: "3h" }
  ];

  const heures = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pourriez intégrer avec un système de réservation
    console.log("Réservation:", formData);
    alert("Votre demande de réservation a été envoyée ! Nous vous contacterons sous 24h.");
    onClose();
    setFormData({
      nom: "",
      email: "",
      telephone: "",
      service: "",
      date: "",
      heure: "",
      message: ""
    });
  };

  const selectedService = services.find(s => s.value === formData.service);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 bg-gradient-luxury rounded-full w-fit">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="font-elegant text-2xl text-foreground">
            Réserver votre séance beauté
          </DialogTitle>
          <p className="text-muted-foreground">
            Complétez le formulaire pour réserver votre rendez-vous
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Vos informations</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                    className="border-border/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      className="pl-10 border-border/50"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 border-border/50"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service et rendez-vous */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Votre séance</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service souhaité *</Label>
                <Select onValueChange={(value) => setFormData({...formData, service: value})}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Choisissez votre service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">({service.duration})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    Durée estimée : {selectedService.duration}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date souhaitée *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="pl-10 border-border/50"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heure">Heure préférée *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Select onValueChange={(value) => setFormData({...formData, heure: value})}>
                      <SelectTrigger className="pl-10 border-border/50">
                        <SelectValue placeholder="Heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {heures.map((heure) => (
                          <SelectItem key={heure} value={heure}>
                            {heure}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Précisez vos souhaits, couleurs préférées, occasion spéciale..."
              className="border-border/50 min-h-[100px]"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-luxury text-white hover-glow"
            >
              Confirmer la réservation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;