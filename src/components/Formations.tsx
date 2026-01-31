import { useFormations } from "@/hooks/useFormations";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users, Award, BookOpen, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const Formations = () => {
  const { data: allFormations = [], isLoading } = useFormations();
  const formations = allFormations.slice(0, 3);

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${hours * 60} minutes`;
    if (hours === 1) return '1 heure';
    if (hours >= 24) return `${Math.round(hours / 8)} jours`;
    return `${hours} heures`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'intermédiaire': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'avancé': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getBadgeText = (level: string, index: number) => {
    if (index === 0) return "⭐ Populaire";
    if (level.toLowerCase() === 'avancé') return "🎓 Certifiante";
    return "✨ Recommandé";
  };

  const getFormationProgram = (level: string) => {
    if (level.toLowerCase() === 'débutant') {
      return [
        "Préparation de la peau",
        "Techniques de base du teint",
        "Mise en valeur du regard",
        "Harmonisation des couleurs",
        "Kit de démarrage offert"
      ];
    } else if (level.toLowerCase() === 'intermédiaire') {
      return [
        "Contouring et highlighting",
        "Maquillage des yeux avancé",
        "Techniques de lèvres",
        "Looks jour/soir",
        "Manuel de formation inclus"
      ];
    } else if (level.toLowerCase() === 'avancé') {
      return [
        "Formation complète PRO",
        "Techniques de studio",
        "Maquillage mariée",
        "Portfolio professionnel",
        "Certification officielle"
      ];
    }
    return [
      "Manuel de formation inclus",
      "Suivi personnalisé",
      "Certification"
    ];
  };

  const advantages = [
    {
      icon: <Award className="w-6 h-6" aria-hidden="true" />,
      title: "Formatrice Certifiée",
      description: "15 ans d'expérience et formations continues"
    },
    {
      icon: <Users className="w-6 h-6" aria-hidden="true" />,
      title: "Groupes Réduits",
      description: "Attention personnalisée garantie"
    },
    {
      icon: <BookOpen className="w-6 h-6" aria-hidden="true" />,
      title: "Support Complet",
      description: "Manuel et suivi post-formation inclus"
    },
    {
      icon: <CheckCircle className="w-6 h-6" aria-hidden="true" />,
      title: "Produits Fournis",
      description: "Matériel professionnel haut de gamme"
    }
  ];

  return (
    <section 
      id="formations" 
      className="py-24 bg-background relative overflow-hidden"
      aria-labelledby="formations-heading"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.05),transparent_50%)]" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase mb-6">
            Nos Formations
          </span>
          <h2 
            id="formations-heading"
            className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Libérez Votre
            <span className="block bg-gradient-luxury bg-clip-text text-transparent mt-2">
              Potentiel Créatif
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Des formations personnalisées pour tous les niveaux, dispensées par une professionnelle 
            expérimentée dans un cadre privilégié.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12" role="status" aria-label="Chargement des formations">
            <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Chargement des formations...</span>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {formations.map((formation, index) => {
              const program = getFormationProgram(formation.level);
              const badge = getBadgeText(formation.level, index);

              return (
                <Card 
                  key={formation.id} 
                  className={`group relative overflow-hidden transition-all duration-500 h-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                    index === 1 
                      ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-luxury lg:scale-105 lg:-translate-y-2' 
                      : 'bg-card border-border/30 shadow-card hover:shadow-luxury'
                  }`}
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                      index === 1 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {badge}
                    </span>
                  </div>

                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="space-y-6 flex-1">
                      <div className="space-y-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(formation.level)}`}>
                          {formation.level}
                        </span>
                        
                        <h3 className="font-elegant text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {formation.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {formation.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                        <div className="text-center space-y-1">
                          <Clock className="w-5 h-5 text-primary mx-auto" aria-hidden="true" />
                          <div className="text-sm font-semibold text-foreground">{formatDuration(formation.duration)}</div>
                          <div className="text-xs text-muted-foreground">Durée</div>
                        </div>
                        <div className="text-center space-y-1">
                          <Users className="w-5 h-5 text-primary mx-auto" aria-hidden="true" />
                          <div className="text-sm font-semibold text-foreground">Max {formation.max_students || 10}</div>
                          <div className="text-xs text-muted-foreground">Participants</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">Programme inclus</h4>
                        <ul className="space-y-2" aria-label={`Programme de ${formation.title}`}>
                          {program.slice(0, 5).map((item, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">À partir de</span>
                          <div className="font-elegant text-3xl font-bold text-primary">
                            {formation.price}€
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full group/btn ${
                          index === 1 
                            ? 'bg-gradient-luxury text-primary-foreground hover:opacity-90' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                        onClick={() => window.location.href = `/reservation?formation=${formation.id}`}
                      >
                        Réserver maintenant
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Advantages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-card/50 border-border/30 shadow-card hover:shadow-luxury transition-all duration-300 text-center group">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-luxury rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-foreground group-hover:scale-110 transition-transform">
                  {advantage.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {advantage.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-luxury text-primary-foreground hover:opacity-90 group"
              onClick={() => window.location.href = '/services/formations'}
            >
              Voir toutes les formations
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <BookOpen className="w-5 h-5 mr-2" aria-hidden="true" />
              Télécharger le programme
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formations;
