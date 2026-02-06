import { useState, useEffect } from "react";
import { format, addDays, isSameDay, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, User, CreditCard, CheckCircle, Star, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { staticServices, staticFormations, type Service, type Formation } from "@/lib/staticData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ReservationPage = () => {
  const { toast } = useToast();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [services] = useState<Service[]>(staticServices);
  const [formations] = useState<Formation[]>(staticFormations);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    message: ""
  });

  // Auto-fill customer info from profile when user is logged in
  useEffect(() => {
    if (user && profile) {
      setCustomerInfo(prev => ({
        ...prev,
        prenom: profile.first_name || prev.prenom,
        nom: profile.last_name || prev.nom,
        email: profile.email || user.email || prev.email,
        telephone: profile.phone || prev.telephone
      }));
    }
  }, [user, profile]);

  // Check URL params for pre-selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    const formationId = urlParams.get('formation');
    
    if (serviceId) {
      const preSelectedService = services.find(s => s.id === serviceId);
      if (preSelectedService) {
        setSelectedService(preSelectedService);
        setCurrentStep(2);
      }
    } else if (formationId) {
      const preSelectedFormation = formations.find(f => f.id === formationId);
      if (preSelectedFormation) {
        setSelectedFormation(preSelectedFormation);
        setCurrentStep(2);
      }
    }
  }, [services, formations]);

  const getServiceFeatures = (item: Service | Formation) => {
    if ('title' in item) {
      const formation = item as Formation;
      if (formation.level.toLowerCase() === 'débutant') {
        return ["Théorie des couleurs", "Préparation de la peau", "Kit de base offert", "Certification"];
      } else if (formation.level.toLowerCase() === 'intermédiaire') {
        return ["Techniques avancées", "Contouring & highlighting", "Manuel inclus", "Certification"];
      } else {
        return ["Formation complète PRO", "Portfolio professionnel", "Suivi post-formation", "Certification"];
      }
    } else {
      const service = item as Service;
      const lowerName = service.name.toLowerCase();
      if (lowerName.includes('mariée')) return ["Essai inclus", "Retouches jour J", "Produits premium", "Photos"];
      if (lowerName.includes('événement')) return ["Look personnalisé", "Produits longue tenue", "Conseils inclus"];
      if (lowerName.includes('vip')) return ["Analyse morphologique", "Routine personnalisée", "Suivi"];
      return ["Service personnalisé", "Produits premium", "Consultation incluse"];
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
    new Date(2025, 11, 25),
    new Date(2025, 11, 26),
    new Date(2026, 0, 1),
  ];

  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const getAvailableSlots = (date: Date) => {
    // Simulate some booked slots
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return availableTimeSlots.slice(0, 4); // Sunday: fewer slots
    if (dayOfWeek === 6) return availableTimeSlots.filter((_, i) => i % 2 === 0); // Saturday: alternating
    return availableTimeSlots;
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(d => isSameDay(date, d)) || 
           isBefore(date, new Date()) || 
           isAfter(date, addDays(new Date(), 60)) ||
           date.getDay() === 0; // No Sundays
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

  const getSelectionName = () => selectedService?.name || selectedFormation?.title || '';
  const getSelectionPrice = () => selectedService?.price || selectedFormation?.price || 0;
  const getSelectionDuration = () => selectedService?.duration || (selectedFormation?.duration || 0) * 60;

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) setCurrentStep(3);
  };

  const handleCustomerInfoSubmit = () => setCurrentStep(4);

  const handleFinalConfirmation = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setCurrentStep(5);
    
    toast({
      title: "Réservation confirmée !",
      description: "Vous recevrez un email de confirmation sous peu.",
    });
  };

  const resetReservation = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedFormation(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setCustomerInfo({ prenom: "", nom: "", email: "", telephone: "", message: "" });
  };

  const steps = [
    { number: 1, title: "Service", icon: <Star className="w-4 h-4" /> },
    { number: 2, title: "Date & Heure", icon: <Calendar className="w-4 h-4" /> },
    { number: 3, title: "Informations", icon: <User className="w-4 h-4" /> },
    { number: 4, title: "Confirmation", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const isFormValid = customerInfo.prenom && customerInfo.nom && customerInfo.email && customerInfo.telephone;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-28">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : window.history.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep > 1 ? 'Étape précédente' : 'Retour'}
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Réservation en ligne
          </span>
          <h1 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Réservez Votre
            <span className="block text-gradient-luxury mt-2">
              Séance Beauté
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            En quelques clics, planifiez votre moment de beauté personnalisé
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep < 5 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold transition-all",
                      currentStep > step.number
                        ? "bg-primary text-primary-foreground border-primary"
                        : currentStep === step.number
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-background text-muted-foreground border-border"
                    )}>
                      {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.icon}
                    </div>
                    <span className={cn(
                      "mt-2 text-sm font-medium hidden sm:block",
                      currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2 sm:mx-4",
                      currentStep > step.number ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Services */}
              <div>
                <h2 className="font-elegant text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm">1</span>
                  Prestations de Maquillage
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-luxury group",
                        selectedService?.id === service.id ? "ring-2 ring-primary shadow-luxury" : "hover:border-primary/50"
                      )}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-elegant text-xl font-semibold group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                          <Badge className="bg-primary/10 text-primary border-0">
                            {formatDuration(service.duration)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {getServiceFeatures(service).slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="font-elegant text-2xl font-bold text-primary">{service.price}€</span>
                          <Button className="bg-gradient-luxury text-primary-foreground group-hover:opacity-90">
                            Choisir
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Formations */}
              <div>
                <h2 className="font-elegant text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent-foreground text-sm">2</span>
                  Formations Beauté
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {formations.map((formation) => (
                    <Card
                      key={formation.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-luxury group",
                        selectedFormation?.id === formation.id ? "ring-2 ring-primary shadow-luxury" : "hover:border-primary/50"
                      )}
                      onClick={() => handleFormationSelect(formation)}
                    >
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-secondary text-secondary-foreground border-0">
                          {formation.level}
                        </Badge>
                        <h3 className="font-elegant text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {formation.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {formation.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formation.duration}h
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Max {formation.maxStudents}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="font-elegant text-xl font-bold text-primary">{formation.price}€</span>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            Choisir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <Card className="bg-card border-border/30 shadow-luxury">
              <CardHeader>
                <CardTitle className="font-elegant text-2xl flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  Choisissez votre créneau
                </CardTitle>
                <p className="text-muted-foreground">
                  Pour : <span className="font-medium text-foreground">{getSelectionName()}</span>
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4">Sélectionnez une date</h3>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateUnavailable}
                      locale={fr}
                      className="rounded-lg border border-border/50 p-3"
                    />
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <h3 className="font-medium mb-4">
                        Créneaux disponibles le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {getAvailableSlots(selectedDate).map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={cn(
                              "transition-all",
                              selectedTime === time 
                                ? "bg-gradient-luxury text-primary-foreground" 
                                : "border-border hover:border-primary hover:text-primary"
                            )}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      
                      {selectedTime && (
                        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground mb-2">Votre sélection :</p>
                          <p className="font-medium text-foreground">
                            {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })} à {selectedTime}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                  <Button
                    onClick={handleDateTimeConfirm}
                    disabled={!selectedDate || !selectedTime}
                    className="bg-gradient-luxury text-primary-foreground"
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customer Info */}
          {currentStep === 3 && (
            <Card className="bg-card border-border/30 shadow-luxury">
              <CardHeader>
                <CardTitle className="font-elegant text-2xl flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleCustomerInfoSubmit(); }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={customerInfo.prenom}
                        onChange={(e) => setCustomerInfo({...customerInfo, prenom: e.target.value})}
                        placeholder="Votre prénom"
                        required
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={customerInfo.nom}
                        onChange={(e) => setCustomerInfo({...customerInfo, nom: e.target.value})}
                        placeholder="Votre nom"
                        required
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="votre@email.com"
                        required
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={customerInfo.telephone}
                        onChange={(e) => setCustomerInfo({...customerInfo, telephone: e.target.value})}
                        placeholder="06 XX XX XX XX"
                        required
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message ou demande spéciale</Label>
                    <Textarea
                      id="message"
                      value={customerInfo.message}
                      onChange={(e) => setCustomerInfo({...customerInfo, message: e.target.value})}
                      placeholder="Décrivez vos attentes, l'occasion, vos préférences..."
                      className="border-border/50 focus:border-primary min-h-[100px]"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-border/50 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!isFormValid}
                      className="bg-gradient-luxury text-primary-foreground"
                    >
                      Continuer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card className="bg-card border-border/30 shadow-luxury">
              <CardHeader>
                <CardTitle className="font-elegant text-2xl flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Récapitulatif de votre réservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Service</h4>
                      <p className="font-elegant text-xl font-semibold">{getSelectionName()}</p>
                      <p className="text-sm text-muted-foreground">Durée : {formatDuration(getSelectionDuration())}</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Date et heure</h4>
                      <p className="font-medium">
                        {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-primary font-semibold">{selectedTime}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Vos coordonnées</h4>
                      <p className="font-medium">{customerInfo.prenom} {customerInfo.nom}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {customerInfo.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {customerInfo.telephone}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Total à régler</h4>
                      <p className="font-elegant text-3xl font-bold text-primary">{getSelectionPrice()}€</p>
                      <p className="text-xs text-muted-foreground mt-1">Paiement sur place le jour du rendez-vous</p>
                    </div>
                  </div>
                </div>

                {customerInfo.message && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Votre message</h4>
                    <p className="text-sm">{customerInfo.message}</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    En confirmant, vous acceptez nos conditions générales de vente.
                  </p>
                  <Button
                    onClick={handleFinalConfirmation}
                    disabled={isSubmitting}
                    className="bg-gradient-luxury text-primary-foreground min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Confirmation...
                      </>
                    ) : (
                      <>
                        Confirmer la réservation
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <Card className="bg-card border-border/30 shadow-luxury text-center">
              <CardContent className="py-12">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                
                <h2 className="font-elegant text-3xl font-bold text-foreground mb-4">
                  Réservation Confirmée !
                </h2>
                
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Merci {customerInfo.prenom} ! Un email de confirmation a été envoyé à {customerInfo.email}.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-lg mb-4">{getSelectionName()}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {selectedTime}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Studio Artisan Beauty, Paris
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={resetReservation} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Nouvelle réservation
                  </Button>
                  <Button onClick={() => window.location.href = '/'} className="bg-gradient-luxury text-primary-foreground">
                    Retour à l'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReservationPage;
