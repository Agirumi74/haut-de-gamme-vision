import { Card, CardContent } from "./ui/card";
import { Palette, Search, Brush, Sparkles, Users, Star } from "lucide-react";

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: <Search className="w-8 h-8" />,
      title: "Consultation",
      subtitle: "Découverte & Analyse",
      description: "Nous échangeons sur vos attentes, j'analyse votre morphologie et votre style pour créer un look parfaitement adapté à votre personnalité.",
      duration: "30 min",
      color: "from-primary to-primary-glow"
    },
    {
      number: "02", 
      icon: <Palette className="w-8 h-8" />,
      title: "Préparation",
      subtitle: "Sélection & Préparation",
      description: "Je sélectionne les produits et teintes parfaites pour votre carnation. Préparation minutieuse de votre peau pour un rendu optimal.",
      duration: "15 min",
      color: "from-accent to-primary"
    },
    {
      number: "03",
      icon: <Brush className="w-8 h-8" />,
      title: "Réalisation",
      subtitle: "Création Artistique",
      description: "Application experte du maquillage avec des techniques professionnelles. Chaque geste est pensé pour sublimer votre beauté naturelle.",
      duration: "45-90 min",
      color: "from-primary-glow to-accent"
    },
    {
      number: "04",
      icon: <Sparkles className="w-8 h-8" />,
      title: "Finalisation",
      subtitle: "Retouches & Conseils",
      description: "Dernières retouches pour un résultat parfait. Je vous donne mes conseils pour maintenir votre look et réaliser des retouches si besoin.",
      duration: "15 min",
      color: "from-accent to-primary"
    }
  ];

  const values = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Approche Personnalisée",
      description: "Chaque prestation est unique et adaptée à votre personnalité"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Excellence & Qualité",
      description: "Produits haut de gamme et techniques professionnelles"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Bienveillance",
      description: "Un moment de détente dans un environnement chaleureux"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Mon Processus
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comment Je Révèle
            <span className="block text-gradient-luxury">
              Votre Beauté
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les étapes de mon processus créatif, pensé pour vous offrir 
            une expérience sur-mesure et un résultat exceptionnel.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="group bg-gradient-card border-border/50 hover-glow overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className={`
                      w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} 
                      flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300
                    `}>
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <span className="font-elegant text-2xl font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-elegant text-xl font-bold text-foreground">
                          {step.title}
                        </h3>
                        <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-primary font-medium text-sm">
                        {step.subtitle}
                      </p>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="bg-gradient-hero rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="font-elegant text-3xl font-bold text-foreground mb-4">
              Mes Valeurs
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Au cœur de chaque prestation, ces valeurs guident mon travail 
              pour vous offrir une expérience d'exception.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="bg-background/50 backdrop-blur-sm border-border/30 hover-glow text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-luxury rounded-full text-white">
                      {value.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {value.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;