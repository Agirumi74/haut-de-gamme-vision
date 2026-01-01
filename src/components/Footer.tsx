import { Instagram, Facebook, Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-elegant font-bold text-xl">A</span>
              </div>
              <div>
                <h3 className="font-elegant text-2xl font-bold">Artisan Beauty</h3>
                <p className="text-xs text-background/50 uppercase tracking-wider">L'artisane de votre beauté</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Révélez votre éclat naturel avec notre approche unique 
              et personnalisée du maquillage professionnel haut de gamme.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/artisanbeauty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-background/10 rounded-xl hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Suivez-nous sur Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/artisanbeauty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-background/10 rounded-xl hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Suivez-nous sur Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h4 className="font-semibold text-lg mb-6 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><a href="/services/maquillage-pro" className="hover:text-primary hover:pl-1 transition-all">Maquillage Mariée</a></li>
              <li><a href="/services/maquillage-pro" className="hover:text-primary hover:pl-1 transition-all">Maquillage Événementiel</a></li>
              <li><a href="/services/formations" className="hover:text-primary hover:pl-1 transition-all">Formations Beauté</a></li>
              <li><a href="/services/consultations-vip" className="hover:text-primary hover:pl-1 transition-all">Consultations VIP</a></li>
              <li><a href="/services/relooking" className="hover:text-primary hover:pl-1 transition-all">Relooking Complet</a></li>
            </ul>
          </nav>

          {/* Navigation */}
          <nav aria-label="Navigation principale">
            <h4 className="font-semibold text-lg mb-6 relative inline-block">
              Navigation
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><a href="/" className="hover:text-primary hover:pl-1 transition-all">Accueil</a></li>
              <li><a href="/#services" className="hover:text-primary hover:pl-1 transition-all">Services</a></li>
              <li><a href="/#formations" className="hover:text-primary hover:pl-1 transition-all">Formations</a></li>
              <li><a href="/#galerie" className="hover:text-primary hover:pl-1 transition-all">Galerie</a></li>
              <li><a href="/#contact" className="hover:text-primary hover:pl-1 transition-all">Contact</a></li>
              <li><a href="/reservation" className="hover:text-primary hover:pl-1 transition-all">Réservation</a></li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <h4 className="font-semibold text-lg mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h4>
            <div className="space-y-4 text-sm text-background/70">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>Studio Artisan Beauty<br/>123 Rue de la Beauté<br/>75001 Paris</span>
              </div>
              <a href="tel:+33123456789" className="flex items-center space-x-3 group hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>+33 1 23 45 67 89</span>
              </a>
              <a href="mailto:contact@artisanbeauty.fr" className="flex items-center space-x-3 group hover:text-primary transition-colors">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>contact@artisanbeauty.fr</span>
              </a>
            </div>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p className="flex items-center gap-1">
              © {currentYear} Artisan Beauty. Fait avec <Heart className="w-4 h-4 text-primary fill-primary" /> à Paris
            </p>
            <nav className="flex flex-wrap justify-center gap-6" aria-label="Liens légaux">
              <a href="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</a>
              <a href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</a>
              <a href="/cgv" className="hover:text-primary transition-colors">CGV</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;