import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Clock, 
  Star, 
  Users, 
  Calendar, 
  BookOpen,
  Award,
  Lightbulb,
  Check,
  ArrowLeft,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedSection from "@/components/AnimatedSection";
import { staticFormations, type Formation } from "@/lib/staticData";
import formationImage from "@/assets/service-formation.jpg";

const FormationsPage = () => {
  const formations = staticFormations;

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${hours * 60}min`;
    return hours === 1 ? '1h' : `${hours}h`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormationFeatures = (formation: Formation) => {
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
  };

  const modules = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Analyse morphologique",
      description: "Apprenez à analyser la forme du visage et adapter le maquillage"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Théorie des couleurs",
      description: "Maîtrisez l'harmonie des couleurs selon votre carnation"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Techniques professionnelles",
      description: "Découvrez les secrets des maquilleurs professionnels"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Pratique encadrée",
      description: "Exercices pratiques avec correction personnalisée"
    }
  ];

  const testimonials = [
    {
      name: "Sophie L.",
      text: "Formation exceptionnelle ! J'ai appris en une journée ce que je n'arrivais pas à maîtriser seule.",
      rating: 5
    },
    {
      name: "Marie D.",
      text: "Très pédagogue, patiente et professionnelle. Je recommande vivement !",
      rating: 5
    },
    {
      name: "Laura M.",
      text: "La formation professionnelle m'a permis de lancer mon activité de maquilleuse.",
      rating: 5
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
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Formation Certifiante
                  </Badge>
                  
                  <h1 className="font-elegant text-4xl lg:text-6xl font-bold text-foreground">
                    Formations
                    <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                      Beauté
                    </span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Découvrez l'art du maquillage avec mes formations personnalisées. 
                    Du niveau débutant au professionnel, apprenez les techniques qui 
                    révéleront votre potentiel créatif.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>3h à 20h selon formation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>+200 élèves formées</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-primary" />
                    <span>98% satisfaction</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-luxury text-white hover-glow">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver ma formation
                  </Button>
                  <Button variant="outline" size="lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Programme détaillé
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right" delay={200}>
              <div className="relative">
                <img
                  src={formationImage}
                  alt="Formation beauté"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-luxury p-6 rounded-2xl text-white">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-elegant text-2xl font-bold">8 ans</div>
                      <div className="text-sm opacity-90">d'expérience</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Formations */}
      <AnimatedSection animation="fade-in">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mes Formations
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choisissez la formation adaptée à votre niveau et vos objectifs
              </p>
            </div>

            {formations.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune formation disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {formations.map((formation, index) => {
                  const features = getFormationFeatures(formation);
                  
                  return (
                    <AnimatedSection key={formation.id} animation="scale-in" delay={index * 100}>
                      <Card className="bg-gradient-card border-border/50 hover-glow h-full">
                        <CardContent className="p-8">
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getLevelColor(formation.level)}`}
                                >
                                  {formation.level}
                                </Badge>
                                <h3 className="font-elegant text-2xl font-semibold text-foreground">
                                  {formation.title}
                                </h3>
                                <p className="text-muted-foreground">
                                  {formation.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-elegant text-2xl font-bold text-primary">
                                  {formation.price}€
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                              <div className="text-center">
                                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                                <div className="text-sm font-medium">{formatDuration(formation.duration)}</div>
                                <div className="text-xs text-muted-foreground">Durée</div>
                              </div>
                              <div className="text-center">
                                <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                                <div className="text-sm font-medium">Max {formation.maxStudents}</div>
                                <div className="text-xs text-muted-foreground">Participants</div>
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
                              onClick={() => window.location.href = `/reservation?formation=${formation.id}`}
                            >
                              Choisir cette formation
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

      {/* Modules */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Programme de Formation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un cursus complet pour maîtriser tous les aspects du maquillage
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {modules.map((module, index) => (
                <AnimatedSection key={index} animation="slide-up" delay={index * 150}>
                  <Card className="bg-gradient-card border-border/50 hover-glow text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                        {module.icon}
                      </div>
                      <h3 className="font-elegant text-xl font-semibold text-foreground mb-4">
                        {module.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {module.description}
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
                Témoignages d'Élèves
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                  <Card className="bg-gradient-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">
                        "{testimonial.text}"
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

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
    </div>
  );
};

export default FormationsPage;