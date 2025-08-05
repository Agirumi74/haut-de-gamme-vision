import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Instagram, Linkedin, Mail, Star, Award } from "lucide-react";
import marieImage from "@/assets/team-marie.jpg";
import assistantImage from "@/assets/team-assistant.jpg";

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "Fondatrice & Artiste Maquilleuse",
      speciality: "Maquillage Mariée & Formations",
      image: marieImage,
      experience: "15 ans",
      description: "Passionnée par l'art du maquillage depuis plus de 15 ans, Marie a formé des centaines de professionnels et sublimé plus de 500 mariées.",
      certifications: [
        "CAP Esthétique-Cosmétique",
        "Formation Internationale MUA",
        "Spécialisation Maquillage Artistique"
      ],
      achievements: [
        "Prix Excellence Beauté 2023",
        "Formatrice certifiée",
        "500+ mariées sublimées"
      ],
      social: {
        instagram: "@marie.artisanbeauty",
        linkedin: "marie-dubois-mua",
        email: "marie@artisanbeauty.fr"
      }
    },
    {
      id: 2,
      name: "Camille Leroux",
      role: "Assistante & Formatrice",
      speciality: "Maquillage Naturel & Conseil",
      image: assistantImage,
      experience: "5 ans",
      description: "Spécialiste du maquillage naturel et du conseil beauté, Camille accompagne nos clientes dans leur quête de l'élégance au quotidien.",
      certifications: [
        "Formation Avancée MUA",
        "Spécialisation Conseil Beauté",
        "Certification Produits Bio"
      ],
      achievements: [
        "Experte maquillage naturel",
        "200+ consultations beauté",
        "Spécialiste produits bio"
      ],
      social: {
        instagram: "@camille.beautycoach",
        linkedin: "camille-leroux-beauty",
        email: "camille@artisanbeauty.fr"
      }
    }
  ];

  return (
    <section id="equipe" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Notre Équipe
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Les Artistes de
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Votre Beauté
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une équipe passionnée et experte, dédiée à révéler votre beauté naturelle 
            avec excellence et bienveillance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.id} 
              className="group bg-gradient-card border-border/50 hover-glow overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Experience Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-semibold text-foreground">
                          {member.experience} d'exp.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="font-elegant text-2xl font-bold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.speciality}</p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>

                    {/* Certifications */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Award className="w-4 h-4 text-primary mr-2" />
                        Certifications
                      </h4>
                      <div className="space-y-1">
                        {member.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Star className="w-4 h-4 text-primary mr-2" />
                        Réalisations
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {member.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <Star className="w-3 h-3 text-primary mr-2 fill-current" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="pt-4 border-t border-border/30">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            <Instagram className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            <Linkedin className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button size="sm" className="bg-gradient-luxury text-white">
                          Contacter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          {[
            { number: "2", label: "Expertes beauté", icon: <Star className="w-5 h-5" /> },
            { number: "20+", label: "Années d'expérience", icon: <Award className="w-5 h-5" /> },
            { number: "700+", label: "Clientes satisfaites", icon: <Star className="w-5 h-5" /> },
            { number: "100%", label: "Passion dédiée", icon: <Star className="w-5 h-5" /> }
          ].map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-gradient-luxury rounded-full text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="font-elegant text-2xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;