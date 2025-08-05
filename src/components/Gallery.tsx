import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X, ZoomIn } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  return (
    <section id="galerie" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Portfolio
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Mes Créations
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Artistiques
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection de mes réalisations. Chaque création raconte 
            une histoire unique et reflète la personnalité de mes clientes.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`
                ${activeCategory === category 
                  ? "bg-gradient-luxury text-white" 
                  : "border-primary text-primary hover:bg-primary hover:text-white"
                }
                transition-all duration-300
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden bg-gradient-card border-border/50 hover-glow cursor-pointer animate-fade-in"
              onClick={() => setSelectedImage(item.image)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block px-3 py-1 bg-primary/80 rounded-full text-xs font-medium mb-2">
                        {item.category}
                      </span>
                      <h3 className="font-elegant text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/90">
                        {item.description}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Portfolio en grand"
                className="w-full h-full object-contain rounded-lg animate-scale-in"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;