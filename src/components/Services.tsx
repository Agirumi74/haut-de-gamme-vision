import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Palette, GraduationCap, Crown, Sparkles, Camera, Heart } from "lucide-react";
import { apiClient } from "@/lib/api";
import { staticServices, type Service } from "@/lib/staticData";
import serviceImage1 from "@/assets/service-makeup.jpg";
import serviceImage2 from "@/assets/service-formation.jpg";

const Services = () => {
  const [services, setServices] = useState<Service[]>(staticServices);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getServices();
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        // Silently fallback to static data - already set as default
        console.log('Using static services data');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const getServiceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('mariée') || lowerName.includes('mariage')) return <Heart className="w-7 h-7" />;
    if (lowerName.includes('maquillage')) return <Palette className="w-7 h-7" />;
    if (lowerName.includes('formation')) return <GraduationCap className="w-7 h-7" />;
    if (lowerName.includes('vip') || lowerName.includes('consultation')) return <Crown className="w-7 h-7" />;
    if (lowerName.includes('photo') || lowerName.includes('shooting')) return <Camera className="w-7 h-7" />;
    return <Sparkles className="w-7 h-7" />;
  };

  const getServiceImage = (name: string, index: number) => {
    // Alternate between images for visual variety
    return index % 2 === 0 ? serviceImage1 : serviceImage2;
  };

  const getServiceFeatures = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('mariée') || lowerName.includes('mariage')) {
      return ["Essai inclus", "Tenue longue durée", "Retouches jour J", "Produits premium"];
    }
    if (lowerName.includes('événement') || lowerName.includes('soirée')) {
      return ["Événements spéciaux", "Look personnalisé", "Conseils inclus", "Produits haut de gamme"];
    }
    if (lowerName.includes('vip') || lowerName.includes('consultation')) {
      return ["Analyse morphologique", "Sélection produits", "Routine beauté", "Suivi personnalisé"];
    }
    if (lowerName.includes('photo') || lowerName.includes('shooting')) {
      return ["Optimisé HD", "Techniques studio", "Multi-looks", "Retouches incluses"];
    }
    return ["Service personnalisé", "Consultation incluse", "Produits premium", "Suivi client"];
  };

  return (
    <section id="services" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase mb-6">
            Mes Services
          </span>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            L'Excellence au Service de
            <span className="block bg-gradient-luxury bg-clip-text text-transparent mt-2">
              Votre Beauté
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chaque prestation est une œuvre d'art personnalisée. J'utilise exclusivement 
            des produits haut de gamme, hypoallergéniques et respectueux de votre 
            peau pour un résultat impeccable et durable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const serviceIcon = getServiceIcon(service.name);
            const serviceImage = getServiceImage(service.name, index);
            const serviceFeatures = getServiceFeatures(service.name);
            
            return (
              <Card 
                key={service.id} 
                className="group bg-card border-border/30 shadow-card hover:shadow-luxury transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={serviceImage}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium">
                        {serviceIcon}
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <h3 className="font-elegant text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {serviceFeatures.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{service.price}€</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-luxury text-primary-foreground hover:opacity-90 transition-opacity"
                        onClick={() => window.location.href = `/reservation?service=${service.id}`}
                      >
                        Réserver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Clientes satisfaites</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">15 ans</div>
              <div className="text-sm text-muted-foreground">D'expérience</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Produits premium</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">5★</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
