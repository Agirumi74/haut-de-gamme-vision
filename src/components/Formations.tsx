import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users, Award, BookOpen, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
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
}

const Formations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormations = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getFormations();
        setFormations(data.slice(0, 3)); // Show only first 3 formations
      } catch (err) {
        setError('Erreur lors du chargement des formations');
        console.error('Error loading formations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, []);

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${hours * 60} minutes`;
    return hours === 1 ? '1 heure' : `${hours} heures`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeText = (formation: Formation, index: number) => {
    if (index === 0) return "Populaire";
    if (formation.level.toLowerCase() === 'avancé') return "Certifiante";
    return "Nouveau";
  };

  const getFormationProgram = (formation: Formation) => {
    const baseProgram = [
      "Manuel de formation inclus",
      "Suivi personnalisé",
      "Certification"
    ];

    if (formation.level.toLowerCase() === 'débutant') {
      return [
        "Préparation de la peau",
        "Techniques de base du teint",
        "Mise en valeur du regard",
        "Harmonisation des couleurs",
        "Kit de démarrage offert"
      ];
    } else if (formation.level.toLowerCase() === 'intermédiaire') {
      return [
        "Contouring et highlighting",
        "Maquillage des yeux avancé",
        "Techniques de lèvres",
        "Looks jour/soir",
        ...baseProgram
      ];
    } else if (formation.level.toLowerCase() === 'avancé') {
      return [
        "Formation complète PRO",
        "Techniques de studio",
        "Maquillage mariée",
        "Portfolio professionnel",
        ...baseProgram,
        "Suivi post-formation"
      ];
    }

    return baseProgram;
  };

  const advantages = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Formatrice Certifiée",
      description: "15 ans d'expérience et formations continues"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Groupes Réduits",
      description: "Attention personnalisée garantie"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Support Complet",
      description: "Manuel et suivi post-formation inclus"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Produits Fournis",
      description: "Matériel professionnel haut de gamme"
    }
  ];

  if (loading) {
    return (
      <section id="formations" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des formations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="formations" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="formations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Nos Formations
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Libérez Votre
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Potentiel Créatif
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des formations personnalisées pour tous les niveaux, dispensées par une professionnelle 
            expérimentée dans un cadre privilégié.
          </p>
        </div>

        {/* Formations Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {formations.map((formation, index) => {
            const program = getFormationProgram(formation);
            const badge = getBadgeText(formation, index);

            return (
              <Card key={formation.id} className="group bg-gradient-card border-border/50 hover-glow relative overflow-hidden h-full">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    {badge}
                  </span>
                </div>

                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-6 flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(formation.level)}`}>
                          {formation.level}
                        </span>
                      </div>
                      
                      <h3 className="font-elegant text-2xl font-bold text-foreground">
                        {formation.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {formation.description}
                      </p>
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

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Programme inclus :</h4>
                      <ul className="space-y-2">
                        {program.slice(0, 5).map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-right">
                        <div className="font-elegant text-3xl font-bold text-primary">
                          {formation.price}€
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-luxury text-white hover-glow group"
                      onClick={() => window.location.href = `/reservation?formation=${formation.id}`}
                    >
                      Réserver maintenant
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Advantages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover-glow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-luxury rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  {advantage.icon}
                </div>
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-3">
                  {advantage.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-luxury text-white hover-glow"
              onClick={() => window.location.href = '/services/formations'}
            >
              Voir toutes les formations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="w-5 h-5 mr-2" />
              Télécharger le programme
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formations;