import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Contact
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Réservez Votre
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Consultation
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prenez rendez-vous pour une consultation personnalisée. Je vous accompagne 
            dans la création de votre look idéal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Informations de Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Studio Artisan Beauty</p>
                      <p className="text-sm text-muted-foreground">
                        123 Rue de la Beauté<br />
                        75001 Paris, France
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium text-foreground">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">contact@artisanbeauty.fr</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Horaires d'Ouverture
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Lundi - Vendredi</span>
                        <span className="text-sm font-medium text-foreground">9h - 19h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Samedi</span>
                        <span className="text-sm font-medium text-foreground">9h - 17h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Dimanche</span>
                        <span className="text-sm font-medium text-foreground">Sur RDV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Suivez-moi
                </h3>
                <div className="flex space-x-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => window.open('https://instagram.com/artisanbeauty', '_blank')}
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => window.open('https://facebook.com/artisanbeauty', '_blank')}
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardContent className="p-8">
                <h3 className="font-elegant text-2xl font-semibold text-foreground mb-6">
                  Demande de Rendez-vous
                </h3>
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  alert("Votre demande a été envoyée ! Nous vous contacterons sous 24h.");
                }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Prénom *
                      </label>
                      <Input placeholder="Votre prénom" className="border-border/50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nom *
                      </label>
                      <Input placeholder="Votre nom" className="border-border/50" required />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input type="email" placeholder="votre@email.com" className="border-border/50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Téléphone
                      </label>
                      <Input placeholder="Votre numéro" className="border-border/50" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Service souhaité *
                    </label>
                    <select className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground" required>
                      <option value="">Sélectionnez un service</option>
                      <option value="maquillage">Maquillage professionnel</option>
                      <option value="formation">Formation beauté</option>
                      <option value="consultation">Consultation VIP</option>
                      <option value="relooking">Relooking complet</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date souhaitée
                    </label>
                    <Input type="date" className="border-border/50" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea 
                      placeholder="Décrivez vos attentes, l'occasion, vos préférences..."
                      className="border-border/50 min-h-[120px]"
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full bg-gradient-luxury text-white hover-glow luxury-shadow">
                    Envoyer ma demande
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;