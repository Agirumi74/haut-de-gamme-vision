import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import BookingModal from "./BookingModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const navItems = [
    { label: "Accueil", href: "#" },
    { label: "Services", href: "#services" },
    { label: "Formations", href: "#formations" },
    { label: "Galerie", href: "#galerie" },
    { label: "Équipe", href: "#equipe" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
              <span className="text-white font-elegant font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-elegant text-2xl font-bold text-foreground">
                Artisan Beauty
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button 
              variant="default" 
              className="bg-gradient-luxury text-white hover-glow"
              onClick={() => window.location.href = "/reservation"}
            >
              Réserver
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
               <Button 
                 variant="default" 
                 className="bg-gradient-luxury text-white mt-4"
                  onClick={() => window.location.href = "/reservation"}
                >
                 Réserver
               </Button>
            </nav>
          </div>
        )}
      </div>
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </header>
  );
};

export default Header;