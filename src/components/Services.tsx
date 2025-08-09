import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Palette, GraduationCap, Crown, Sparkles, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import serviceImage1 from "@/assets/service-makeup.jpg";
import serviceImage2 from "@/assets/service-formation.jpg";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getServices();
        setServices(data);
      } catch (err) {
        setError('Erreur lors du chargement des services');
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const getServiceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('maquillage')) return <Palette className="w-8 h-8" />;
    if (lowerName.includes('formation')) return <GraduationCap className="w-8 h-8" />;
    if (lowerName.includes('vip') || lowerName.includes('consultation')) return <Crown className="w-8 h-8" />;
    return <Sparkles className="w-8 h-8" />;
  };

  const getServiceImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('formation')) return serviceImage2;
    return serviceImage1;
  };

  const getServiceFeatures = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('maquillage')) return ["Mariages", "Événements", "Shooting photo", "Soirées"];
    if (lowerName.includes('formation')) return ["Cours individuels", "Ateliers groupe", "Techniques avancées", "Certification"];
    if (lowerName.includes('vip') || lowerName.includes('consultation')) return ["Analyse morphologique", "Sélection produits", "Routine beauté", "Suivi personnalisé"];
    return ["Service personnalisé", "Consultation incluse", "Produits premium", "Suivi client"];
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
          {services.map((service) => {
            const serviceIcon = getServiceIcon(service.name);
            const serviceImage = getServiceImage(service.name);
            const serviceFeatures = getServiceFeatures(service.name);
            
            return (
              <Card key={service.id} className="group bg-gradient-card border-border/50 hover-glow overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={serviceImage}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-luxury rounded-lg text-white">
                        {serviceIcon}
                      </div>
                      <h3 className="font-elegant text-xl font-semibold text-foreground">
                        {service.name}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {serviceFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t border-border/50">
                      <p className="font-semibold text-primary mb-3">
                        {service.price}€ - {service.duration}min
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => {
                          // Navigate to reservation page with service pre-selected
                          window.location.href = `/reservation?service=${service.id}`;
                        }}
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
      </div>
    </section>
  );
};

export default Services;