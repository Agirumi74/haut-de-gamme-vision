import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Menu, User, LogOut, Settings, Shield, ChevronDown, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email || "Utilisateur";
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
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
          </Link>

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
            
            {/* Auth State */}
            {isLoading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-2 hover:bg-accent"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-luxury text-primary-foreground text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profil" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/connexion">
                    Connexion
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/inscription">
                    Inscription
                  </Link>
                </Button>
              </div>
            )}
            
            <Button 
              className="bg-gradient-luxury text-primary-foreground hover:opacity-90 transition-opacity shadow-lg font-medium"
              onClick={() => navigate("/reservation")}
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

                  {/* User Info (if logged in) */}
                  {!isLoading && user && (
                    <div className="p-4 border-b border-border bg-accent/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-luxury text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 py-4 px-4 overflow-y-auto" aria-label="Navigation mobile">
                    <ul className="space-y-1">
                      {navItems.map((item) => (
                        <li key={item.label}>
                          <SheetClose asChild>
                            {(item as any).isRoute ? (
                              <Link
                                to={item.href}
                                className="flex items-center px-4 py-3 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200 font-medium text-base"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <a
                                href={item.href}
                                className="flex items-center px-4 py-3 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200 font-medium text-base"
                                onClick={() => handleNavClick(item.href)}
                              >
                                {item.label}
                              </a>
                            )}
                          </SheetClose>
                        </li>
                      ))}

                      {/* Auth Links for Mobile */}
                      {!isLoading && user && (
                        <>
                          <li className="pt-4 border-t border-border mt-4">
                            <SheetClose asChild>
                              <Link
                                to="/profil"
                                className="flex items-center px-4 py-3 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200 font-medium text-base"
                              >
                                <User className="h-5 w-5 mr-3" />
                                Mon profil
                              </Link>
                            </SheetClose>
                          </li>
                          {isAdmin && (
                            <li>
                              <SheetClose asChild>
                                <Link
                                  to="/admin/dashboard"
                                  className="flex items-center px-4 py-3 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200 font-medium text-base"
                                >
                                  <Shield className="h-5 w-5 mr-3" />
                                  Administration
                                </Link>
                              </SheetClose>
                            </li>
                          )}
                          <li>
                            <SheetClose asChild>
                              <button
                                onClick={handleSignOut}
                                className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 font-medium text-base"
                              >
                                <LogOut className="h-5 w-5 mr-3" />
                                Se déconnecter
                              </button>
                            </SheetClose>
                          </li>
                        </>
                      )}

                      {!isLoading && !user && (
                        <li className="pt-4 border-t border-border mt-4 space-y-2">
                          <SheetClose asChild>
                            <Link
                              to="/connexion"
                              className="flex items-center justify-center w-full px-4 py-3 text-foreground border border-border hover:bg-accent rounded-lg transition-all duration-200 font-medium text-base"
                            >
                              Connexion
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              to="/inscription"
                              className="flex items-center justify-center w-full px-4 py-3 bg-accent text-foreground hover:bg-accent/80 rounded-lg transition-all duration-200 font-medium text-base"
                            >
                              Inscription
                            </Link>
                          </SheetClose>
                        </li>
                      )}
                    </ul>
                  </nav>

                  {/* Mobile CTA */}
                  <div className="p-4 border-t border-border">
                    <SheetClose asChild>
                      <Button 
                        className="w-full bg-gradient-luxury text-primary-foreground hover:opacity-90 transition-opacity shadow-lg font-medium py-3"
                        onClick={() => navigate("/reservation")}
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
