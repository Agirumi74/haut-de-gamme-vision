import { Instagram, Facebook, Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foreground text-background" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center shadow-lg" 
                aria-hidden="true"
              >
                <span className="text-primary-foreground font-elegant font-bold text-xl">A</span>
              </div>
              <div>
                <h2 className="font-elegant text-2xl font-bold">Artisan Beauty</h2>
                <p className="text-xs text-background/60 uppercase tracking-wider">L'artisane de votre beauté</p>
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
                className="p-3 bg-background/10 rounded-xl hover:bg-primary hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-foreground"
                aria-label="Suivez-nous sur Instagram (ouvre dans un nouvel onglet)"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="https://facebook.com/artisanbeauty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-background/10 rounded-xl hover:bg-primary hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-foreground"
                aria-label="Suivez-nous sur Facebook (ouvre dans un nouvel onglet)"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Nos services">
            <h3 className="font-semibold text-lg mb-6 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <a href="/services/maquillage-professionnel" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">
                  Maquillage Mariée
                </a>
              </li>
              <li>
                <a href="/services/maquillage-professionnel" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">
                  Maquillage Événementiel
                </a>
              </li>
              <li>
                <a href="/services/formations" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">
                  Formations Beauté
                </a>
              </li>
              <li>
                <a href="/services/consultations-vip" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">
                  Consultations VIP
                </a>
              </li>
              <li>
                <a href="/services/relooking-complet" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">
                  Relooking Complet
                </a>
              </li>
            </ul>
          </nav>

          {/* Navigation */}
          <nav aria-label="Navigation du site">
            <h3 className="font-semibold text-lg mb-6 relative inline-block">
              Navigation
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li><a href="/" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">Accueil</a></li>
              <li><a href="/#services" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">Services</a></li>
              <li><a href="/#formations" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">Formations</a></li>
              <li><a href="/#galerie" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">Galerie</a></li>
              <li><a href="/#contact" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">Contact</a></li>
              <li><a href="/reservation" className="hover:text-primary hover:pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded">Réservation</a></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" aria-hidden="true" />
            </h3>
            <address className="not-italic space-y-4 text-sm text-background/70">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Studio Artisan Beauty<br/>
                  123 Rue de la Beauté<br/>
                  75001 Paris
                </span>
              </div>
              <a 
                href="tel:+33123456789" 
                className="flex items-center space-x-3 group hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span>+33 1 23 45 67 89</span>
              </a>
              <a 
                href="mailto:contact@artisanbeauty.fr" 
                className="flex items-center space-x-3 group hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                <Mail className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span>contact@artisanbeauty.fr</span>
              </a>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p className="flex items-center gap-1">
              © {currentYear} Artisan Beauty. Fait avec{' '}
              <Heart className="w-4 h-4 text-primary fill-primary" aria-label="amour" />{' '}
              à Paris
            </p>
            <nav className="flex flex-wrap justify-center gap-6" aria-label="Liens légaux">
              <a href="/mentions-legales" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">
                Mentions légales
              </a>
              <a href="/confidentialite" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">
                Confidentialité
              </a>
              <a href="/cgv" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">
                CGV
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
