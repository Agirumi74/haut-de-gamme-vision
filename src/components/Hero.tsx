import { Button } from "./ui/button";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-beauty.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                L'artisane de votre beauté
              </p>
              <h1 className="font-elegant text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Une Approche
                <span className="block bg-gradient-luxury bg-clip-text text-transparent">
                  Unique
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Passionnée par l'art du maquillage et la transmission, je vous accompagne avec 
                bienveillance pour révéler votre beauté naturelle et développer votre confiance.
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 • 120+ clientes satisfaites</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-luxury text-white hover-glow luxury-shadow">
                Découvrir mes services
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                Voir la galerie
              </Button>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center space-x-4 pt-8">
              <div className="h-px bg-gradient-luxury w-16"></div>
              <Star className="w-4 h-4 text-primary" />
              <div className="h-px bg-gradient-luxury w-16"></div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl luxury-shadow animate-float">
              <img
                src={heroImage}
                alt="Artisan Beauty - Maquillage professionnel"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md rounded-full p-6 card-shadow animate-glow">
              <div className="text-center">
                <p className="font-elegant text-2xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">Années d'expérience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;