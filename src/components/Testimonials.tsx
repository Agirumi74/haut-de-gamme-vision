import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sophie Laurent",
      role: "Mariée",
      rating: 5,
      text: "Marie a su créer le look parfait pour mon mariage. Son professionnalisme et sa douceur m'ont mise en confiance immédiatement. Le résultat était au-delà de mes attentes !",
      service: "Maquillage Mariée"
    },
    {
      id: 2,
      name: "Camille Dubois",
      role: "Directrice Marketing",
      rating: 5,
      text: "Les formations de Marie sont exceptionnelles. J'ai appris des techniques que j'utilise au quotidien. Son approche pédagogique est remarquable.",
      service: "Formation Beauté"
    },
    {
      id: 3,
      name: "Élise Martin",
      role: "Photographe",
      rating: 5,
      text: "Je travaille régulièrement avec Marie pour mes shootings. Sa créativité et sa maîtrise technique sont impressionnantes. Mes clientes adorent !",
      service: "Maquillage Artistique"
    },
    {
      id: 4,
      name: "Anne-Claire Petit",
      role: "Entrepreneuse",
      rating: 5,
      text: "La consultation VIP a transformé ma routine beauté. Marie a su comprendre mes besoins et m'a donné des conseils précieux pour révéler ma beauté naturelle.",
      service: "Consultation VIP"
    }
  ];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase mb-6">
            Témoignages
          </span>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ce Que Disent
            <span className="block text-gradient-luxury mt-2">
              Mes Clientes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Leurs mots touchent mon cœur et nourrissent ma passion. 
            Chaque sourire, chaque confiance retrouvée est ma plus belle récompense.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="bg-card border-border/30 shadow-card hover:shadow-luxury transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
                    <Quote className="w-5 h-5" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                  "{testimonial.text}"
                </blockquote>

                {/* Service Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {testimonial.service}
                  </span>
                </div>

                {/* Client Info */}
                <div className="pt-4 border-t border-border/30 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16">
          <Card className="bg-card border-border/30 shadow-luxury max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="font-elegant text-4xl font-bold text-primary">4.9</div>
                  <div className="flex justify-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Note moyenne</div>
                </div>
                <div className="space-y-2 border-x border-border/30 px-4">
                  <div className="font-elegant text-4xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Clientes satisfaites</div>
                </div>
                <div className="space-y-2">
                  <div className="font-elegant text-4xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Recommandent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
