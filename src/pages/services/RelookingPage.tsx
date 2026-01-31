import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Clock, 
  Star, 
  Zap,
  Calendar, 
  Camera,
  Palette,
  Scissors,
  Check,
  ArrowLeft,
  Heart,
  Users,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";

import AnimatedSection from "@/components/AnimatedSection";

const RelookingPage = () => {
  const packages = [
    {
      title: "Relooking Essentiel",
      description: "Transformation complète en une séance",
      duration: "4h",
      price: "350€",
      features: [
        "Consultation style personnalisée",
        "Maquillage professionnel",
        "Coiffure adaptée",
        "10 photos professionnelles",
        "Conseils personnalisés",
        "Dossier style complet"
      ]
    },
    {
      title: "Relooking Premium",
      description: "Expérience complète avec coaching",
      duration: "6h",
      price: "550€",
      features: [
        "Tout inclus Essentiel +",
        "Coaching confiance en soi",
        "20 photos professionelles",
        "Retouches incluses",
        "Séance shopping (2h)",
        "Suivi personnalisé 3 mois"
      ]
    },
    {
      title: "Relooking VIP",
      description: "Transformation totale sur mesure",
      duration: "8h (2 jours)",
      price: "800€",
      features: [
        "Service ultra-premium",
        "Styliste personnel",
        "Shooting photo complet",
        "Vidéo de transformation",
        "Garde-robe personnalisée",
        "Coach beauté 6 mois"
      ]
    }
  ];

  const transformationSteps = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Analyse Personnalité",
      description: "Étude de votre style de vie, personnalité et objectifs"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Consultation Beauté",
      description: "Analyse morphologique et colorimétrie personnalisée"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Transformation",
      description: "Maquillage professionnel et coiffure sur mesure"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Séance Photo",
      description: "Immortalisation de votre nouvelle image"
    }
  ];

  const beforeAfter = [
    {
      name: "Sarah, 32 ans",
      transformation: "Retrouvé confiance après sa maternité",
      rating: 5
    },
    {
      name: "Julie, 28 ans", 
      transformation: "Nouveau look pour son nouveau poste",
      rating: 5
    },
    {
      name: "Marie, 45 ans",
      transformation: "Révélé sa beauté naturelle",
      rating: 5
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
                    <Sparkles className="w-4 h-4 mr-2" />
                    Transformation Complète
                  </Badge>
                  
                  <h1 className="font-elegant text-4xl lg:text-6xl font-bold text-foreground">
                    Relooking
                    <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                      Complet
                    </span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Révélez votre potentiel avec une transformation complète. 
                    Maquillage, coiffure, style et confiance en soi : 
                    découvrez la meilleure version de vous-même.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>4h à 8h selon formule</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-primary" />
                    <span>+150 transformations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4 text-primary" />
                    <span>100% satisfaction</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-luxury text-white hover-glow">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver ma transformation
                  </Button>
                  <Button variant="outline" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Voir les transformations
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Packages */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mes Formules Relooking
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choisissez la formule qui correspond à vos attentes
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                  <Card className={`bg-gradient-card border-border/50 hover-glow h-full ${index === 1 ? 'transform scale-105 border-primary' : ''}`}>
                    <CardContent className="p-8">
                      {index === 1 && (
                        <Badge className="mb-4 bg-gradient-luxury text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Recommandée
                        </Badge>
                      )}
                      
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="font-elegant text-2xl font-semibold text-foreground mb-2">
                            {pkg.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {pkg.description}
                          </p>
                          <div className="font-elegant text-3xl font-bold text-primary">
                            {pkg.price}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center justify-center mt-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {pkg.duration}
                          </div>
                        </div>

                        <ul className="space-y-3">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button className={`w-full ${index === 1 ? 'bg-gradient-luxury text-white hover-glow' : 'border-primary text-primary hover:bg-primary hover:text-white'}`} variant={index === 1 ? 'default' : 'outline'}>
                          Choisir cette formule
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

      {/* Process */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Le Processus de Transformation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une approche méthodique pour révéler votre potentiel
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {transformationSteps.map((step, index) => (
                <AnimatedSection key={index} animation="slide-up" delay={index * 150}>
                  <Card className="bg-gradient-card border-border/50 hover-glow text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                        {step.icon}
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

      {/* Testimonials */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Transformations Réussies
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez les témoignages de femmes transformées
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {beforeAfter.map((testimonial, index) => (
                <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                  <Card className="bg-gradient-card border-border/50 hover-glow">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">
                        "{testimonial.transformation}"
                      </p>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
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
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-card border-border/50 overflow-hidden">
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Badge variant="outline" className="border-primary text-primary">
                          <Award className="w-4 h-4 mr-2" />
                          Garantie Satisfaction
                        </Badge>
                        <h3 className="font-elegant text-3xl font-bold text-foreground">
                          Pourquoi Choisir Mon Relooking ?
                        </h3>
                      </div>
                      
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <Zap className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-foreground">Résultats Garantis</div>
                            <div className="text-sm text-muted-foreground">Transformation visible et durable</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Heart className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-foreground">Boost de Confiance</div>
                            <div className="text-sm text-muted-foreground">Retrouvez estime de soi et assurance</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Sparkles className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-foreground">Approche Holistique</div>
                            <div className="text-sm text-muted-foreground">Beauté, style et bien-être réunis</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="relative">
                      <div className="bg-gradient-luxury p-8 rounded-2xl text-white text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4" />
                        <div className="font-elegant text-2xl font-bold mb-2">
                          Offre Découverte
                        </div>
                        <div className="text-lg mb-4">
                          -50€ sur votre première transformation
                        </div>
                        <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                          En profiter
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    Prête pour votre transformation ?
                  </h2>
                  <p className="text-lg text-white/90">
                    Il est temps de révéler la femme extraordinaire qui sommeille en vous. 
                    Réservez votre relooking complet dès maintenant.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                      <Calendar className="w-5 h-5 mr-2" />
                      Réserver ma transformation
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Camera className="w-5 h-5 mr-2" />
                      Voir le portfolio
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

export default RelookingPage;