import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Demande envoyée !",
      description: "Nous vous contacterons dans les 24 heures.",
    });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase mb-6">
            Contact
          </span>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Réservez Votre
            <span className="block bg-gradient-luxury bg-clip-text text-transparent mt-2">
              Consultation
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Prenez rendez-vous pour une consultation personnalisée. Je vous accompagne 
            dans la création de votre look idéal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-card border-border/30 shadow-card hover:shadow-luxury transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Informations de Contact
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start space-x-4 group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Studio Artisan Beauty</p>
                      <p className="text-sm text-muted-foreground">
                        123 Rue de la Beauté<br />
                        75001 Paris, France
                      </p>
                    </div>
                  </div>
                  
                  <a href="tel:+33123456789" className="flex items-center space-x-4 group hover:text-primary transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium text-foreground">+33 1 23 45 67 89</p>
                    </div>
                  </a>
                  
                  <a href="mailto:contact@artisanbeauty.fr" className="flex items-center space-x-4 group hover:text-primary transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">contact@artisanbeauty.fr</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/30 shadow-card">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horaires
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Lundi - Vendredi</span>
                    <span className="font-medium text-foreground">9h - 19h</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Samedi</span>
                    <span className="font-medium text-foreground">9h - 17h</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="font-medium text-primary">Sur RDV</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/30 shadow-card">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-4">
                  Suivez-moi
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Retrouvez mes dernières réalisations et conseils beauté
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://instagram.com/artisanbeauty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-medium">Instagram</span>
                  </a>
                  <a
                    href="https://facebook.com/artisanbeauty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="font-medium">Facebook</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border/30 shadow-luxury">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-elegant text-2xl font-semibold text-foreground mb-4">
                      Demande envoyée avec succès !
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Merci pour votre message. Je vous contacterai dans les 24 heures pour confirmer votre rendez-vous.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSubmitted(false)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Envoyer une autre demande
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-elegant text-2xl font-semibold text-foreground mb-2">
                      Demande de Rendez-vous
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Remplissez le formulaire ci-dessous et je vous recontacterai rapidement.
                    </p>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                            Prénom <span className="text-primary">*</span>
                          </label>
                          <Input 
                            id="firstName"
                            name="firstName"
                            placeholder="Votre prénom" 
                            className="border-border/50 focus:border-primary" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                            Nom <span className="text-primary">*</span>
                          </label>
                          <Input 
                            id="lastName"
                            name="lastName"
                            placeholder="Votre nom" 
                            className="border-border/50 focus:border-primary" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-foreground">
                            Email <span className="text-primary">*</span>
                          </label>
                          <Input 
                            id="email"
                            name="email"
                            type="email" 
                            placeholder="votre@email.com" 
                            className="border-border/50 focus:border-primary" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                            Téléphone
                          </label>
                          <Input 
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="06 XX XX XX XX" 
                            className="border-border/50 focus:border-primary" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="service" className="block text-sm font-medium text-foreground">
                            Service souhaité <span className="text-primary">*</span>
                          </label>
                          <select 
                            id="service"
                            name="service"
                            className="w-full h-10 px-3 py-2 border border-border/50 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                            required
                          >
                            <option value="">Sélectionnez un service</option>
                            <option value="mariage">Maquillage Mariée</option>
                            <option value="evenement">Maquillage Événement</option>
                            <option value="formation">Formation Beauté</option>
                            <option value="consultation">Consultation VIP</option>
                            <option value="shooting">Shooting Photo</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="date" className="block text-sm font-medium text-foreground">
                            Date souhaitée
                          </label>
                          <Input 
                            id="date"
                            name="date"
                            type="date" 
                            className="border-border/50 focus:border-primary" 
                            min={new Date().toISOString().split('T')[0]} 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-medium text-foreground">
                          Message
                        </label>
                        <Textarea 
                          id="message"
                          name="message"
                          placeholder="Décrivez vos attentes, l'occasion, vos préférences... Plus vous êtes précis(e), mieux je pourrai vous accompagner."
                          className="border-border/50 focus:border-primary min-h-[120px] resize-none"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-gradient-luxury text-primary-foreground hover:opacity-90 shadow-luxury group"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer ma demande
                            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground">
                        En soumettant ce formulaire, vous acceptez notre{' '}
                        <a href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</a>.
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;