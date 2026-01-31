import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Clock, 
  Star, 
  Diamond,
  Calendar, 
  Sparkles,
  Users,
  Heart,
  Check,
  ArrowLeft,
  Gift,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";

import AnimatedSection from "@/components/AnimatedSection";

const ConsultationsVIPPage = () => {
  const vipServices = [
    {
      title: "Consultation Premium",
      description: "Analyse complète et conseils personnalisés",
      duration: "2h",
      price: "200€",
      features: [
        "Analyse morphologique détaillée",
        "Colorimétrie personnalisée",
        "Sélection produits sur mesure",
        "Routine beauté adaptée",
        "Dossier beauté personnalisé",
        "Suivi 3 mois inclus"
      ]
    },
    {
      title: "Consultation Élite",
      description: "Service ultra-premium avec coach beauté dédié",
      duration: "3h",
      price: "350€",
      features: [
        "Tout inclus Premium +",
        "Coach beauté personnel",
        "Shopping accompagné",
        "Séance photo incluse",
        "Plan beauté sur 6 mois",
        "Support WhatsApp illimité"
      ]
    },
    {
      title: "Consultation Express",
      description: "Session ciblée pour un besoin spécifique",
      duration: "1h",
      price: "120€",
      features: [
        "Analyse ciblée",
        "Conseils immédiats",
        "Recommandations produits",
        "Fiche conseil personnalisée"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Diamond className="w-6 h-6" />,
      title: "Service Exclusif",
      description: "Prestations haut de gamme réservées à une clientèle exigeante"
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Expertise Reconnue",
      description: "8 années d'expérience et formation continue aux dernières tendances"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Approche Personnalisée",
      description: "Chaque consultation est unique et adaptée à votre personnalité"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Résultats Immédiats",
      description: "Transformation visible dès la première séance"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Prise de Contact",
      description: "Échange téléphonique pour comprendre vos attentes et objectifs"
    },
    {
      step: "02",
      title: "Analyse Détaillée",
      description: "Étude de votre morphologie, carnation et style de vie"
    },
    {
      step: "03",
      title: "Recommandations",
      description: "Conseils personnalisés et sélection de produits adaptés"
    },
    {
      step: "04",
      title: "Suivi Personnalisé",
      description: "Accompagnement et ajustements selon vos retours"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade-in">
              <div className="space-y-6">
                <Link to="/#services" className="inline-flex items-center text-primary hover:text-primary-glow transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux services
                </Link>
                
                <div className="space-y-4">
                  <Badge variant="outline" className="border-primary text-primary">
                    <Crown className="w-4 h-4 mr-2" />
                    Service VIP Exclusif
                  </Badge>
                  
                  <h1 className="font-elegant text-4xl lg:text-6xl font-bold text-foreground">
                    Consultations
                    <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                      VIP
                    </span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Un service premium exclusif pour les femmes qui recherchent l'excellence. 
                    Découvrez une approche sur mesure qui révélera votre beauté naturelle 
                    avec sophistication et élégance.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Service personnalisé</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Clientèle VIP exclusive</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Accompagnement privilégié</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-luxury text-white hover-glow">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver ma consultation
                  </Button>
                  <Button variant="outline" size="lg">
                    <Gift className="w-5 h-5 mr-2" />
                    Découvrir l'expérience
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services VIP */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mes Services VIP
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des prestations d'exception pour une expérience beauté inoubliable
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {vipServices.map((service, index) => (
                <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                  <Card className={`bg-gradient-card border-border/50 hover-glow h-full ${index === 1 ? 'transform scale-105 border-primary' : ''}`}>
                    <CardContent className="p-8">
                      {index === 1 && (
                        <Badge className="mb-4 bg-gradient-luxury text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Plus populaire
                        </Badge>
                      )}
                      
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="font-elegant text-2xl font-semibold text-foreground mb-2">
                            {service.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {service.description}
                          </p>
                          <div className="font-elegant text-3xl font-bold text-primary">
                            {service.price}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center justify-center mt-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>

                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button className={`w-full ${index === 1 ? 'bg-gradient-luxury text-white hover-glow' : 'border-primary text-primary hover:bg-primary hover:text-white'}`} variant={index === 1 ? 'default' : 'outline'}>
                          Choisir ce service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Benefits */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                L'Expérience VIP
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez les avantages exclusifs de mes consultations premium
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={index} animation="slide-up" delay={index * 150}>
                  <Card className="bg-gradient-card border-border/50 hover-glow text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                        {benefit.icon}
                      </div>
                      <h3 className="font-elegant text-xl font-semibold text-foreground mb-4">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Process */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mon Processus VIP
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une méthode éprouvée pour des résultats exceptionnels
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {process.map((step, index) => (
                <AnimatedSection key={index} animation="slide-left" delay={index * 200}>
                  <div className="flex items-start mb-12 last:mb-0">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center text-white font-elegant text-xl font-bold mr-6">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-elegant text-2xl font-semibold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
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
                  <Crown className="w-12 h-12 mx-auto" />
                  <h2 className="font-elegant text-3xl lg:text-4xl font-bold">
                    Prête pour l'expérience VIP ?
                  </h2>
                  <p className="text-lg text-white/90">
                    Offrez-vous le service d'exception que vous méritez. 
                    Réservez dès maintenant votre consultation VIP personnalisée.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                      <Calendar className="w-5 h-5 mr-2" />
                      Réserver ma consultation
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Sparkles className="w-5 h-5 mr-2" />
                      En savoir plus
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

export default ConsultationsVIPPage;