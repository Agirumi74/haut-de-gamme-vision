import { useState, useEffect } from "react";
import { format, addDays, isSameDay, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, User, CreditCard, CheckCircle, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  price: number;
  maxStudents: number;
  isActive: boolean;
}

const ReservationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    message: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesData, formationsData] = await Promise.all([
          apiClient.getServices(),
          apiClient.getFormations()
        ]);
        
        setServices(servicesData);
        setFormations(formationsData);
        
        // Check if service or formation is pre-selected via URL params
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = urlParams.get('service');
        const formationId = urlParams.get('formation');
        
        if (serviceId) {
          const preSelectedService = servicesData.find(s => s.id === serviceId);
          if (preSelectedService) {
            setSelectedService(preSelectedService);
            setCurrentStep(2);
          }
        } else if (formationId) {
          const preSelectedFormation = formationsData.find(f => f.id === formationId);
          if (preSelectedFormation) {
            setSelectedFormation(preSelectedFormation);
            setCurrentStep(2);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getServiceFeatures = (item: Service | Formation) => {
    if ('title' in item) {
      // It's a formation
      const formation = item as Formation;
      const baseFeatures = [
        "Manuel de formation inclus",
        "Suivi personnalisé",
        "Certification"
      ];

      if (formation.level.toLowerCase() === 'débutant') {
        return [
          "Théorie des couleurs",
          "Préparation de la peau",
          "Maquillage jour naturel",
          "Kit de base offert",
          ...baseFeatures
        ];
      } else if (formation.level.toLowerCase() === 'intermédiaire') {
        return [
          "Techniques avancées",
          "Maquillage soirée",
          "Contouring & highlighting",
          "Maquillage des yeux complexe",
          ...baseFeatures
        ];
      } else if (formation.level.toLowerCase() === 'avancé') {
        return [
          "Formation complète PRO",
          "Techniques de studio",
          "Maquillage mariée",
          "Portfolio professionnel",
          ...baseFeatures,
          "Suivi post-formation"
        ];
      }
      return baseFeatures;
    } else {
      // It's a service
      const service = item as Service;
      const lowerName = service.name.toLowerCase();
      if (lowerName.includes('maquillage') && lowerName.includes('mariée')) {
        return ["Essai inclus", "Retouches", "Photos", "Produits haut de gamme"];
      }
      if (lowerName.includes('maquillage')) {
        return ["Conseils personnalisés", "Produits longue tenue", "Retouches"];
      }
      if (lowerName.includes('consultation') || lowerName.includes('vip')) {
        return ["Analyse morphologique", "Sélection produits", "Routine personnalisée"];
      }
      return ["Service personnalisé", "Consultation incluse", "Produits premium"];
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h${mins}`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };
  const unavailableDates = [
    new Date(2024, 11, 25), // Noël
    new Date(2024, 11, 26),
    new Date(2025, 0, 1),   // Jour de l'an
    addDays(new Date(), 2), // Dans 2 jours (exemple)
    addDays(new Date(), 5), // Dans 5 jours (exemple)
  ];

  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const bookedSlots = {
    [format(addDays(new Date(), 1), "yyyy-MM-dd")]: ["09:00", "14:00"],
    [format(addDays(new Date(), 3), "yyyy-MM-dd")]: ["10:00", "15:00", "16:00"],
  };

  const getAvailableSlots = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const booked = bookedSlots[dateKey] || [];
    return availableTimeSlots.filter(slot => !booked.includes(slot));
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => 
      isSameDay(date, unavailableDate)
    ) || isBefore(date, new Date()) || isAfter(date, addDays(new Date(), 60));
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedFormation(null);
    setCurrentStep(2);
  };

  const handleFormationSelect = (formation: Formation) => {
    setSelectedFormation(formation);
    setSelectedService(null);
    setCurrentStep(2);
  };

  const getCurrentSelection = () => {
    return selectedService || selectedFormation;
  };

  const getSelectionName = () => {
    if (selectedService) return selectedService.name;
    if (selectedFormation) return selectedFormation.title;
    return '';
  };

  const getSelectionPrice = () => {
    if (selectedService) return selectedService.price;
    if (selectedFormation) return selectedFormation.price;
    return 0;
  };

  const getSelectionDuration = () => {
    if (selectedService) return selectedService.duration;
    if (selectedFormation) return selectedFormation.duration * 60; // Convert hours to minutes
    return 0;
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep(3);
    }
  };

  const handleCustomerInfoSubmit = () => {
    setCurrentStep(4);
  };

  const handleFinalConfirmation = async () => {
    const currentSelection = getCurrentSelection();
    if (!currentSelection || !selectedDate || !selectedTime) return;

    try {
      // First create the client
      const clientData = {
        firstName: customerInfo.prenom,
        lastName: customerInfo.nom,
        email: customerInfo.email,
        phone: customerInfo.telephone
      };

      let client;
      try {
        client = await apiClient.createClient(clientData);
      } catch (err: any) {
        if (err.message.includes('already exists')) {
          // Client already exists, that's fine
          console.log('Client already exists');
        } else {
          throw err;
        }
      }

      // Create the reservation
      const reservationData = {
        date: selectedDate.toISOString(),
        time: selectedTime,
        clientId: client?.id || 'temp', // TODO: Handle existing clients properly
        serviceId: selectedService?.id,
        formationId: selectedFormation?.id,
        notes: customerInfo.message || undefined
      };

      // TODO: Add proper client lookup and reservation creation
      console.log("Réservation:", {
        selection: currentSelection,
        date: selectedDate,
        time: selectedTime,
        customer: customerInfo,
        reservation: reservationData
      });
      
      setCurrentStep(5);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError('Erreur lors de la création de la réservation');
    }
  };

  const resetReservation = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedFormation(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setCustomerInfo({
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      message: ""
    });
  };

  const steps = [
    { number: 1, title: "Service", completed: currentStep > 1 },
    { number: 2, title: "Date & Heure", completed: currentStep > 2 },
    { number: 3, title: "Informations", completed: currentStep > 3 },
    { number: 4, title: "Confirmation", completed: currentStep > 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Réservation
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              en Ligne
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Réservez votre séance beauté en quelques clics
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold
                  ${step.completed || currentStep === step.number
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-muted-foreground border-border"
                  }
                `}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-3 font-medium ${
                  step.completed || currentStep === step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-6 ${
                    step.completed ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardHeader className="text-center">
                <CardTitle className="font-elegant text-2xl">
                  Choisissez votre service
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Chargement des services...</p>
                  </div>
                ) : services.length === 0 && formations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Aucun service ou formation disponible</p>
                    <Button onClick={() => window.location.reload()}>
                      Réessayer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Services Section */}
                    {services.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Services</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {services.map((service) => {
                            const serviceFeatures = getServiceFeatures(service);
                            
                            return (
                              <Card
                                key={service.id}
                                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover-glow
                                  ${selectedService?.id === service.id ? "ring-2 ring-primary" : ""}
                                `}
                                onClick={() => handleServiceSelect(service)}
                              >
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-elegant text-xl font-semibold">
                                        {service.name}
                                      </h3>
                                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                                        {formatDuration(service.duration)}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-sm">
                                      {service.description}
                                    </p>
                                    
                                    <ul className="space-y-2">
                                      {serviceFeatures.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm">
                                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                    
                                    <div className="pt-4 border-t border-border/50">
                                      <div className="flex justify-between items-center">
                                        <span className="font-elegant text-2xl font-bold text-primary">
                                          {service.price}€
                                        </span>
                                        <Button
                                          className="bg-gradient-luxury text-white hover-glow"
                                          onClick={() => handleServiceSelect(service)}
                                        >
                                          Sélectionner
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Formations Section */}
                    {formations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Formations</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {formations.map((formation) => {
                            const formationFeatures = getServiceFeatures(formation);
                            
                            return (
                              <Card
                                key={formation.id}
                                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover-glow
                                  ${selectedFormation?.id === formation.id ? "ring-2 ring-primary" : ""}
                                `}
                                onClick={() => handleFormationSelect(formation)}
                              >
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-elegant text-xl font-semibold">
                                          {formation.title}
                                        </h3>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-1">
                                          {formation.level}
                                        </Badge>
                                      </div>
                                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                                        {formatDuration(formation.duration * 60)}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-sm">
                                      {formation.description}
                                    </p>
                                    
                                    <ul className="space-y-2">
                                      {formationFeatures.slice(0, 4).map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm">
                                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                    
                                    <div className="pt-4 border-t border-border/50">
                                      <div className="flex justify-between items-center">
                                        <span className="font-elegant text-2xl font-bold text-primary">
                                          {formation.price}€
                                        </span>
                                        <Button
                                          className="bg-gradient-luxury text-white hover-glow"
                                          onClick={() => handleFormationSelect(formation)}
                                        >
                                          Sélectionner
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && getCurrentSelection() && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <Card className="bg-gradient-card border-border/50 luxury-shadow">
                <CardHeader>
                  <CardTitle className="font-elegant text-xl flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    Choisissez une date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateUnavailable}
                    locale={fr}
                    className={cn("w-full pointer-events-auto")}
                  />
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-muted rounded-full mr-2"></div>
                      <span>Indisponible</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card className="bg-gradient-card border-border/50 luxury-shadow">
                <CardHeader>
                  <CardTitle className="font-elegant text-xl flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Créneaux disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableSlots(selectedDate).map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(slot)}
                            className={selectedTime === slot 
                              ? "bg-gradient-luxury text-white" 
                              : "border-primary text-primary hover:bg-primary hover:text-white"
                            }
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                      
                      {selectedDate && selectedTime && (
                        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                          <h4 className="font-semibold text-primary mb-2">Résumé de votre réservation</h4>
                          <p className="text-sm">
                            <strong>{getSelectionName()}</strong><br />
                            {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })} à {selectedTime}<br />
                            Durée: {formatDuration(getSelectionDuration())} • Prix: {getSelectionPrice()}€
                          </p>
                          
                          <Button
                            onClick={handleDateTimeConfirm}
                            className="w-full mt-4 bg-gradient-luxury text-white hover-glow"
                          >
                            Continuer
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Sélectionnez d'abord une date
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Customer Information */}
          {currentStep === 3 && (
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardHeader>
                <CardTitle className="font-elegant text-2xl flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCustomerInfoSubmit();
                }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={customerInfo.prenom}
                        onChange={(e) => setCustomerInfo({...customerInfo, prenom: e.target.value})}
                        required
                        className="border-border/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={customerInfo.nom}
                        onChange={(e) => setCustomerInfo({...customerInfo, nom: e.target.value})}
                        required
                        className="border-border/50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        required
                        className="border-border/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={customerInfo.telephone}
                        onChange={(e) => setCustomerInfo({...customerInfo, telephone: e.target.value})}
                        required
                        className="border-border/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      value={customerInfo.message}
                      onChange={(e) => setCustomerInfo({...customerInfo, message: e.target.value})}
                      placeholder="Précisez vos souhaits, couleurs préférées, occasion spéciale..."
                      className="border-border/50"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-luxury text-white hover-glow"
                    >
                      Continuer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardHeader>
                <CardTitle className="font-elegant text-2xl flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  Confirmation de réservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Résumé de la réservation */}
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <h3 className="font-elegant text-xl font-semibold mb-4">Résumé de votre réservation</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{getSelectionName()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">
                          {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heure:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée:</span>
                        <span className="font-medium">{formatDuration(getSelectionDuration())}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-primary">{getSelectionPrice()}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations client */}
                  <div className="bg-muted/20 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Vos informations</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {customerInfo.prenom} {customerInfo.nom}</p>
                      <p><strong>Email:</strong> {customerInfo.email}</p>
                      <p><strong>Téléphone:</strong> {customerInfo.telephone}</p>
                      {customerInfo.message && (
                        <p><strong>Message:</strong> {customerInfo.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>• Annulation possible jusqu'à 24h avant le rendez-vous</p>
                    <p>• Un acompte de 30% peut être demandé pour certains services</p>
                    <p>• Vous recevrez une confirmation par email</p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="flex-1"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={handleFinalConfirmation}
                      className="flex-1 bg-gradient-luxury text-white hover-glow"
                    >
                      Confirmer la réservation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <Card className="bg-gradient-card border-border/50 luxury-shadow text-center">
              <CardContent className="p-12">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="font-elegant text-3xl font-bold text-foreground">
                      Réservation confirmée !
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Merci {customerInfo.prenom}, votre rendez-vous a été réservé avec succès.
                    </p>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg max-w-md mx-auto">
                    <h3 className="font-semibold mb-4">Votre rendez-vous</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>{getSelectionName()}</strong></p>
                      <p>{selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })} à {selectedTime}</p>
                      <p className="text-primary font-medium">{getSelectionPrice()}€</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Vous allez recevoir un email de confirmation à {customerInfo.email}
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={resetReservation}
                        variant="outline"
                      >
                        Nouvelle réservation
                      </Button>
                      <Button
                        onClick={() => window.location.href = "/"}
                        className="bg-gradient-luxury text-white hover-glow"
                      >
                        Retour à l'accueil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationPage;