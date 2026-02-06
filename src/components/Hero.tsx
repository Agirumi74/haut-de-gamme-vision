import { Button } from "./ui/button";
import { Star, ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-beauty.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const Hero = () => {
  const { data: content } = useSiteContent("home", "hero");
  const heroContent = content?.hero || {};

  // Use dynamic content with fallbacks
  const title = heroContent.title || "Une Approche";
  const titleHighlight = heroContent.title_highlight || "Unique & Raffinée";
  const subtitle = heroContent.subtitle || "Passionnée par l'art du maquillage et la transmission, je vous accompagne avec bienveillance pour révéler votre beauté naturelle et développer votre confiance.";
  const badge = heroContent.badge || "L'artisane de votre beauté";
  const ctaPrimary = heroContent.cta_primary || "Découvrir mes services";
  const ctaSecondary = heroContent.cta_secondary || "Voir mon travail";

  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
                <span className="text-primary font-medium text-sm tracking-wide uppercase">
                  {badge}
                </span>
              </div>
              
              <h1 
                id="hero-heading"
                className="font-elegant text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1]"
              >
                {title}
                <span className="block text-gradient-luxury mt-2">
                  {titleHighlight}
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 w-fit">
              <div className="flex" role="img" aria-label="Note de 5 étoiles sur 5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <div className="h-6 w-px bg-border" aria-hidden="true" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">4.9/5</span>
                <span className="text-muted-foreground"> • 500+ clientes satisfaites</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-luxury text-primary-foreground hover:opacity-90 shadow-luxury group text-base px-8"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {ctaPrimary}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-border hover:border-primary hover:bg-primary/5 group text-base px-8"
                onClick={() => document.getElementById('galerie')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                {ctaSecondary}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" aria-hidden="true" />
                <span>Réponse sous 24h</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" aria-hidden="true" />
                <span>Produits premium</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:h-[650px]">
            <div className="relative h-full overflow-hidden rounded-3xl shadow-luxury">
              <img
                src={heroImage}
                alt="Portrait de maquillage professionnel haut de gamme réalisé par Artisan Beauty"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" aria-hidden="true" />
            </div>
            
            {/* Floating Badge - Experience */}
            <div 
              className="absolute -top-4 -right-4 lg:top-8 lg:-right-8 bg-card/95 backdrop-blur-md rounded-2xl p-5 shadow-card border border-border/50"
              aria-label="15 années d'expérience"
            >
              <div className="text-center">
                <p className="font-elegant text-3xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground font-medium">Années<br/>d'expérience</p>
              </div>
            </div>

            {/* Floating Badge - Clients */}
            <div 
              className="absolute bottom-8 -left-4 lg:bottom-12 lg:-left-8 bg-card/95 backdrop-blur-md rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-3"
              aria-label="Plus de 500 clientes satisfaites"
            >
              <div className="flex -space-x-2" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-luxury border-2 border-card flex items-center justify-center text-xs text-primary-foreground font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">500+</p>
                <p className="text-muted-foreground text-xs">Clientes ravies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-bounce" aria-hidden="true">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
