import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const portfolioItems = [
    {
      id: 1,
      image: portfolio1,
      category: "Mariage",
      title: "Look Mariée Romantique",
      description: "Maquillage délicat et intemporel pour un jour unique"
    },
    {
      id: 2,
      image: portfolio2,
      category: "Soirée",
      title: "Glamour Sophistiqué",
      description: "Look dramatique pour événements prestigieux"
    },
    {
      id: 3,
      image: portfolio3,
      category: "Naturel",
      title: "Beauté Naturelle",
      description: "Sublimation de la beauté authentique"
    },
    {
      id: 4,
      image: portfolio4,
      category: "Artistique",
      title: "Création Artistique",
      description: "Maquillage d'art et expression créative"
    },
    {
      id: 5,
      image: portfolio1,
      category: "Mariage",
      title: "Élégance Classique",
      description: "Style intemporel et raffiné"
    },
    {
      id: 6,
      image: portfolio2,
      category: "Soirée",
      title: "Rouge Passion",
      description: "Look audacieux et séducteur"
    }
  ];

  const categories = ["Tous", "Mariage", "Soirée", "Naturel", "Artistique"];
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredItems = activeCategory === "Tous" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? filteredItems.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === filteredItems.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <section id="galerie" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.03),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase mb-6">
            Portfolio
          </span>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Mes Créations
            <span className="block bg-gradient-luxury bg-clip-text text-transparent mt-2">
              Artistiques
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Découvrez une sélection de mes réalisations. Chaque création raconte 
            une histoire unique et reflète la personnalité de mes clientes.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`
                transition-all duration-300 rounded-full px-6
                ${activeCategory === category 
                  ? "bg-gradient-luxury text-primary-foreground shadow-lg" 
                  : "border-border hover:border-primary hover:text-primary"
                }
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden bg-card border-border/30 shadow-card hover:shadow-luxury cursor-pointer transition-all duration-500"
              onClick={() => setSelectedIndex(index)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium mb-3">
                        {item.category}
                      </span>
                      <h3 className="font-elegant text-xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Envie de voir plus ? Suivez-moi sur les réseaux sociaux
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => window.open('https://instagram.com/artisanbeauty', '_blank')}
          >
            Voir plus sur Instagram
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photo"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-3 bg-card/80 hover:bg-card rounded-full text-foreground hover:text-primary transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 md:left-8 p-3 bg-card/80 hover:bg-card rounded-full text-foreground hover:text-primary transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 md:right-8 p-3 bg-card/80 hover:bg-card rounded-full text-foreground hover:text-primary transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[selectedIndex].image}
              alt={filteredItems[selectedIndex].title}
              className="w-full h-full object-contain rounded-lg"
            />
            
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent rounded-b-lg">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium mb-2">
                {filteredItems[selectedIndex].category}
              </span>
              <h3 className="font-elegant text-2xl font-semibold text-foreground mb-1">
                {filteredItems[selectedIndex].title}
              </h3>
              <p className="text-muted-foreground">
                {filteredItems[selectedIndex].description}
              </p>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/80 rounded-full text-sm text-muted-foreground">
            {selectedIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
