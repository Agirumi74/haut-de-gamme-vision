import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Palette, GraduationCap, Crown, Sparkles } from "lucide-react";
import serviceImage1 from "@/assets/service-makeup.jpg";
import serviceImage2 from "@/assets/service-formation.jpg";

const Services = () => {
  const services = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Maquillage Professionnel",
      description: "Maquillage personnalisé pour tous vos événements spéciaux",
      image: serviceImage1,
      features: ["Mariages", "Événements", "Shooting photo", "Soirées"],
      price: "À partir de 80€"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Formations Beauté",
      description: "Cours privés et ateliers pour maîtriser l'art du maquillage",
      image: serviceImage2,
      features: ["Cours individuels", "Ateliers groupe", "Techniques avancées", "Certification"],
      price: "À partir de 120€"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Consultations VIP",
      description: "Service premium avec analyse personnalisée complète",
      features: ["Analyse morphologique", "Sélection produits", "Routine beauté", "Suivi personnalisé"],
      price: "À partir de 200€"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Relooking Complet",
      description: "Transformation complète pour révéler votre potentiel",
      features: ["Conseil style", "Maquillage", "Coiffure", "Shooting photo"],
      price: "À partir de 350€"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Mes Services
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Mon Engagement
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque prestation est une œuvre d'art personnalisée. J'utilise exclusivement 
            des produits haut de gamme, hypoallergéniques et respectueux de votre 
            peau pour un résultat impeccable et durable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group bg-gradient-card border-border/50 hover-glow overflow-hidden">
              <CardContent className="p-0">
                {service.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-luxury rounded-lg text-white">
                      {service.icon}
                    </div>
                    <h3 className="font-elegant text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-border/50">
                    <p className="font-semibold text-primary mb-3">{service.price}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => {
                        let route = '';
                        switch(index) {
                          case 0: route = '/services/maquillage-professionnel'; break;
                          case 1: route = '/services/formations'; break;
                          case 2: route = '/services/consultations-vip'; break;
                          case 3: route = '/services/relooking-complet'; break;
                        }
                        window.location.href = route;
                      }}
                    >
                      En savoir plus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;