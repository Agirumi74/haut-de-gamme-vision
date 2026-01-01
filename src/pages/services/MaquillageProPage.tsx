import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Clock, 
  Star, 
  Heart, 
  Calendar, 
  Users, 
  Camera,
  Sparkles,
  Check,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedSection from "@/components/AnimatedSection";
import { staticServices, type Service } from "@/lib/staticData";
import serviceImage from "@/assets/service-makeup.jpg";

const MaquillageProPage = () => {
  // Filter services related to makeup
  const services = staticServices.filter(service => 
    service.name.toLowerCase().includes('maquillage') || 
    service.name.toLowerCase().includes('mariée') ||
    service.name.toLowerCase().includes('événement') ||
    service.name.toLowerCase().includes('shooting')
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h${mins}`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  const getServiceFeatures = (service: Service) => {
    const lowerName = service.name.toLowerCase();
    if (lowerName.includes('mariée')) {
      return [
        "Essai inclus (1h)",
        "Maquillage jour J",
        "Produits longue tenue",
        "Retouches incluses",
        "Kit de retouche offert"
      ];
    } else if (lowerName.includes('soirée')) {
      return [
        "Consultation personnalisée",
        "Maquillage adapté à l'événement",
        "Produits haute qualité",
        "Conseils d'entretien"
      ];
    } else {
      return [
        "Consultation incluse",
        "Produits professionnels",
        "Techniques personnalisées",
        "Conseils beauté"
      ];
    }
  };

  const processSteps = [
    {
      number: "01",
      title: "Consultation",
      description: "Échange sur vos attentes, analyse de votre morphologie et choix des couleurs"
    },
    {
      number: "02", 
      title: "Préparation",
      description: "Nettoyage et préparation de la peau avec des soins adaptés"
    },
    {
      number: "03",
      title: "Application",
      description: "Réalisation du maquillage avec des techniques professionnelles"
    },
    {
      number: "04",
      title: "Finalisation",
      description: "Retouches, conseils et remise du kit de retouche si inclus"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-left">
              <div className="space-y-6">
                <Link to="/#services" className="inline-flex items-center text-primary hover:text-primary-glow transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux services
                </Link>
                
                <div className="space-y-4">
                  <Badge variant="outline" className="border-primary text-primary">
                    <Palette className="w-4 h-4 mr-2" />
                    Service Premium
                  </Badge>
                  
                  <h1 className="font-elegant text-4xl lg:text-6xl font-bold text-foreground">
                    Maquillage
                    <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                      Professionnel
                    </span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Sublimez votre beauté naturelle avec mes prestations de maquillage professionnel. 
                    Chaque création est unique et adaptée à votre personnalité, votre morphologie et l'occasion.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>1h30 à 3h selon prestation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-primary" />
                    <span>+500 clientes satisfaites</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-luxury text-white hover-glow">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver maintenant
                  </Button>
                  <Button variant="outline" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Voir mes réalisations
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right" delay={200}>
              <div className="relative">
                <img
                  src={serviceImage}
                  alt="Maquillage professionnel"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-luxury p-6 rounded-2xl text-white">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-elegant text-2xl font-bold">98%</div>
                      <div className="text-sm opacity-90">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Details */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mes Prestations Maquillage
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des services sur mesure pour toutes vos occasions spéciales
              </p>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12">
                <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun service de maquillage disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => {
                  const features = getServiceFeatures(service);
                  
                  return (
                    <AnimatedSection key={service.id} animation="scale-in" delay={index * 100}>
                      <Card className="bg-gradient-card border-border/50 hover-glow h-full">
                        <CardContent className="p-8">
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-elegant text-2xl font-semibold text-foreground mb-2">
                                  {service.name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {service.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-elegant text-2xl font-bold text-primary">
                                  {service.price}€
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatDuration(service.duration)}
                                </div>
                              </div>
                            </div>

                            <ul className="space-y-3">
                              {features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-sm">
                                  <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <Button 
                              className="w-full bg-gradient-luxury text-white hover-glow"
                              onClick={() => window.location.href = `/reservation?service=${service.id}`}
                            >
                              Choisir cette prestation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Process */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mon Processus Créatif
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une approche méthodique pour un résultat parfait
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <AnimatedSection key={index} animation="slide-up" delay={index * 150}>
                  <Card className="bg-gradient-card border-border/50 hover-glow text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="font-elegant text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="font-elegant text-xl font-semibold text-foreground mb-4">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-luxury text-white overflow-hidden">
              <CardContent className="p-12 text-center relative">
                <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full animate-glow"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                  <Sparkles className="w-12 h-12 mx-auto" />
                  <h2 className="font-elegant text-3xl lg:text-4xl font-bold">
                    Prête à révéler votre beauté ?
                  </h2>
                  <p className="text-lg text-white/90">
                    Réservez votre séance de maquillage professionnel et laissez-moi 
                    sublimer votre beauté naturelle avec mon expertise.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                      <Calendar className="w-5 h-5 mr-2" />
                      Réserver ma séance
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Users className="w-5 h-5 mr-2" />
                      Mes réalisations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
    </div>
  );
};

export default MaquillageProPage;