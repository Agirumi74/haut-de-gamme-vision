import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Gift, Star, CheckCircle } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const benefits = [
    {
      icon: <Star className="w-5 h-5" />,
      title: "Conseils beauté exclusifs",
      description: "Recevez mes meilleurs tips beauté directement dans votre boîte mail"
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: "Offres privilégiées",
      description: "Accès prioritaire à mes formations et réductions exclusives"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Tendances en avant-première",
      description: "Découvrez les dernières tendances maquillage avant tout le monde"
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-card border-border/50 luxury-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Content */}
                <div className="p-12 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-luxury rounded-lg text-white">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-primary font-medium text-sm tracking-wide uppercase">
                        Newsletter Beauté
                      </span>
                    </div>
                    
                    <h2 className="font-elegant text-3xl lg:text-4xl font-bold text-foreground">
                      Rejoignez ma
                      <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                        Communauté Beauté
                      </span>
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      Inscrivez-vous à ma newsletter et recevez chaque mois mes conseils 
                      d'experte, les dernières tendances et des offres exclusives.
                    </p>
                  </div>

                  {/* Form */}
                  {!isSubscribed ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          placeholder="Votre adresse email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 border-border/50"
                          required
                        />
                        <Button 
                          type="submit" 
                          className="bg-gradient-luxury text-white hover-glow px-8"
                        >
                          S'inscrire
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Désinscription possible à tout moment. Vos données sont protégées.
                      </p>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg animate-fade-in">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-primary font-medium">
                        Merci ! Vous êtes maintenant inscrit(e) à ma newsletter.
                      </span>
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Ce que vous recevrez :</h4>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="p-1 bg-primary/10 rounded text-primary mt-0.5">
                            {benefit.icon}
                          </div>
                          <div>
                            <h5 className="font-medium text-foreground text-sm">
                              {benefit.title}
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="relative bg-gradient-luxury p-12 flex items-center justify-center">
                  <div className="text-center text-white space-y-8">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-glow">
                        <Gift className="w-8 h-8" />
                      </div>
                      <h3 className="font-elegant text-2xl font-bold">
                        Cadeau de Bienvenue
                      </h3>
                      <p className="text-white/90">
                        Guide gratuit "Les 10 Secrets d'un Maquillage Parfait" 
                        offert à votre inscription
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="font-elegant text-2xl font-bold">1200+</div>
                        <div className="text-sm text-white/80">Abonnées</div>
                      </div>
                      <div>
                        <div className="font-elegant text-2xl font-bold">98%</div>
                        <div className="text-sm text-white/80">Satisfaction</div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
                    <div className="absolute bottom-8 left-8 w-6 h-6 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-4 w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;