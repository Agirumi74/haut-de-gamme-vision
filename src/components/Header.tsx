import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();

  const navItems = [
    { label: "Accueil", href: "#" },
    { label: "Services", href: "#services" },
    { label: "Formations", href: "#formations" },
    { label: "Blog", href: "/blog", isRoute: true },
    { label: "Galerie", href: "#galerie" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center space-x-2 md:space-x-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg p-1"
            aria-label="Artisan Beauty - Retour à l'accueil"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-luxury rounded-full flex items-center justify-center shadow-md" aria-hidden="true">
              <span className="text-primary-foreground font-elegant font-bold text-base md:text-lg">A</span>
            </div>
            <div>
              <span className="font-elegant text-lg md:text-2xl font-bold text-foreground">
                Artisan Beauty
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Navigation principale">
            {navItems.map((item) => 
              (item as any).isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1"
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <Link to="/profil">
                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-luxury text-primary-foreground text-sm">
                    {profile?.first_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/connexion">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Link>
              </Button>
            )}
            <Button 
              className="bg-gradient-luxury text-primary-foreground hover:opacity-90 transition-opacity shadow-lg font-medium"
              onClick={() => window.location.href = "/reservation"}
            >
              Réserver
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-foreground hover:bg-accent"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background border-l border-border p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center shadow-md">
                        <span className="text-primary-foreground font-elegant font-bold text-sm">A</span>
                      </div>
                      <span className="font-elegant text-lg font-bold text-foreground">Menu</span>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 py-6 px-4" aria-label="Navigation mobile">
                    <ul className="space-y-1">
                      {navItems.map((item) => (
                        <li key={item.label}>
                          <SheetClose asChild>
                            <a
                              href={item.href}
                              className="flex items-center px-4 py-3 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200 font-medium text-base"
                              onClick={() => handleNavClick(item.href)}
                            >
                              {item.label}
                            </a>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile CTA */}
                  <div className="p-4 border-t border-border">
                    <SheetClose asChild>
                      <Button 
                        className="w-full bg-gradient-luxury text-primary-foreground hover:opacity-90 transition-opacity shadow-lg font-medium py-3"
                        onClick={() => window.location.href = "/reservation"}
                      >
                        Réserver maintenant
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
