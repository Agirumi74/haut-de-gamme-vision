import { Card, CardContent } from "./ui/card";
import { Award, Heart, Users, Sparkles } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: <Award className="w-6 h-6" />,
      number: "15+",
      label: "Années d'expérience"
    },
    {
      icon: <Users className="w-6 h-6" />,
      number: "500+",
      label: "Clientes satisfaites"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      number: "100%",
      label: "Produits premium"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      number: "4.9/5",
      label: "Note moyenne"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                À propos
              </p>
              <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground">
                L'Art au Service de
                <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                  Votre Beauté
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Diplômée des plus prestigieuses écoles de beauté, je cultive depuis plus de 15 ans 
                ma passion pour l'art du maquillage. Mon approche unique allie technique irréprochable 
                et sensibilité artistique pour révéler la beauté authentique de chaque personne.
              </p>
              <p>
                Ma philosophie ? Chaque visage raconte une histoire unique. Mon rôle est de sublimer 
                vos traits naturels tout en respectant votre personnalité. J'utilise exclusivement 
                des produits haut de gamme, testés et approuvés par mes soins.
              </p>
              <p>
                Au-delà du maquillage, je transmets mon savoir-faire à travers des formations 
                personnalisées. Mon objectif : vous donner les clés pour exprimer votre beauté 
                en toute confiance, au quotidien comme lors d'occasions spéciales.
              </p>
            </div>

            {/* Signature */}
            <div className="pt-6">
              <div className="font-elegant text-2xl text-foreground mb-2">Marie Dubois</div>
              <div className="text-primary font-medium">Artiste Maquilleuse Professionnelle</div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-gradient-card border-border/50 hover-glow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-luxury rounded-full text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="font-elegant text-3xl font-bold text-foreground mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Certifications */}
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-4">
                  Certifications & Formations
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Award className="w-4 h-4 text-primary mr-3" />
                    CAP Esthétique-Cosmétique-Parfumerie
                  </li>
                  <li className="flex items-center">
                    <Award className="w-4 h-4 text-primary mr-3" />
                    Formation Maquillage Artistique - École Internationale
                  </li>
                  <li className="flex items-center">
                    <Award className="w-4 h-4 text-primary mr-3" />
                    Spécialisation Maquillage Mariée - Académie Parisienne
                  </li>
                  <li className="flex items-center">
                    <Award className="w-4 h-4 text-primary mr-3" />
                    Formation continue - Techniques avancées
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;