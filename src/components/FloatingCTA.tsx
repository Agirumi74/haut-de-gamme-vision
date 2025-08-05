import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Calendar, X } from "lucide-react";

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 50% of the page
      const scrolled = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      if (scrolled > (docHeight - winHeight) * 0.3) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <div className={`
        bg-gradient-luxury text-white rounded-2xl shadow-2xl transition-all duration-500 ease-out
        ${isExpanded ? 'w-80 p-6' : 'w-16 h-16 p-0 cursor-pointer hover-glow'}
      `}>
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full h-full flex items-center justify-center animate-glow"
          >
            <Calendar className="w-6 h-6" />
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-elegant text-lg font-semibold">
                Réservation Express
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-white/90">
              Prenez rendez-vous rapidement pour découvrir nos services.
            </p>
            
            <div className="space-y-2">
              <a href="#contact">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full bg-white text-primary hover:bg-white/90"
                >
                  Prendre RDV
                </Button>
              </a>
              <a href="tel:+33123456789">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  Appeler maintenant
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingCTA;