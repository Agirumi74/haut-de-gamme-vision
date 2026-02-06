import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Services",
      questions: [
        {
          question: "Combien de temps à l'avance dois-je réserver ?",
          answer: "Pour les mariages, je recommande de réserver 3-6 mois à l'avance. Pour les autres prestations, 2-4 semaines suffisent généralement. Cependant, n'hésitez pas à me contacter même à la dernière minute, je ferai de mon mieux pour vous accommoder."
        },
        {
          question: "Proposez-vous des essais maquillage ?",
          answer: "Absolument ! Je propose systématiquement un essai maquillage pour les mariées, inclus dans la prestation. Pour les autres événements importants, l'essai peut être ajouté moyennant supplément."
        },
        {
          question: "Quels produits utilisez-vous ?",
          answer: "J'utilise exclusivement des produits haut de gamme : MAC, Urban Decay, Charlotte Tilbury, Dior, et des marques professionnelles hypoallergéniques. Tous mes produits sont testés et approuvés pour leur tenue longue durée."
        }
      ]
    },
    {
      category: "Formations",
      questions: [
        {
          question: "Faut-il avoir des prérequis pour les formations ?",
          answer: "Mes formations s'adaptent à tous les niveaux. Pour l'initiation, aucun prérequis n'est nécessaire. Pour les formations avancées, une base en maquillage est recommandée mais pas obligatoire."
        },
        {
          question: "Les formations sont-elles certifiantes ?",
          answer: "Oui, toutes mes formations donnent lieu à une certification Artisan Beauty. La formation professionnelle de 30h délivre une certification reconnue dans le milieu professionnel."
        },
        {
          question: "Le matériel est-il fourni pendant les formations ?",
          answer: "Tout le matériel professionnel est fourni pendant les formations. Pour l'initiation, vous repartez avec un kit de démarrage. Pour les formations avancées, vous bénéficiez d'un kit professionnel complet."
        }
      ]
    },
    {
      category: "Tarifs & Réservation",
      questions: [
        {
          question: "Comment se déroule la réservation ?",
          answer: "Contactez-moi via le formulaire, par téléphone ou email. Nous discutons de vos besoins, je vous propose un devis personnalisé, puis nous fixons un rendez-vous. Un acompte de 30% confirme la réservation."
        },
        {
          question: "Quels sont les moyens de paiement acceptés ?",
          answer: "J'accepte les paiements par espèces, chèque, virement bancaire et carte bancaire. Le solde est réglé le jour de la prestation."
        },
        {
          question: "Que comprennent vos prestations ?",
          answer: "Mes prestations incluent la consultation, la préparation de peau, le maquillage complet, les retouches si nécessaire, et des conseils personnalisés. Pour les mariées, je reste disponible pour les retouches le jour J."
        }
      ]
    },
    {
      category: "Pratique",
      questions: [
        {
          question: "Vous déplacez-vous à domicile ?",
          answer: "Oui, je me déplace à domicile dans un rayon de 50km autour de Paris. Des frais de déplacement peuvent s'appliquer selon la distance. Pour les mariages, le déplacement est souvent inclus."
        },
        {
          question: "Que se passe-t-il en cas d'allergie ?",
          answer: "Je réalise systématiquement un test de tolérance lors du premier contact. J'utilise des produits hypoallergéniques et peux adapter ma sélection selon vos sensibilités."
        },
        {
          question: "Proposez-vous des forfaits groupe ?",
          answer: "Oui, je propose des forfaits avantageux pour les groupes (EVJF, événements d'entreprise, etc.). Plus le groupe est important, plus le tarif unitaire est dégressif."
        }
      ]
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            FAQ
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Questions
            <span className="block text-gradient-luxury">
              Fréquentes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes. 
            Pour toute autre question, n'hésitez pas à me contacter directement.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="font-elegant text-2xl font-semibold text-foreground mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  {categoryIndex + 1}
                </div>
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 10 + questionIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <Card 
                      key={questionIndex} 
                      className="bg-gradient-card border-border/50 overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${questionIndex * 0.1}s` }}
                    >
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full p-6 text-left hover:bg-primary/5 transition-colors duration-300 flex items-center justify-between group"
                        >
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {faq.question}
                          </h4>
                          <div className="ml-4 flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary transition-transform duration-300" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            )}
                          </div>
                        </button>
                        
                        <div className={`
                          overflow-hidden transition-all duration-500 ease-in-out
                          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                          <div className="px-6 pb-6 pt-0">
                            <div className="h-px bg-border/30 mb-4"></div>
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block bg-gradient-card border-border/50 luxury-shadow">
            <CardContent className="p-8">
              <h3 className="font-elegant text-xl font-semibold text-foreground mb-4">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-muted-foreground mb-6">
                N'hésitez pas à me contacter directement, je serai ravie de répondre 
                à toutes vos questions personnalisées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-luxury text-white rounded-lg hover-glow transition-all font-medium"
                >
                  Me contacter
                </a>
                <a 
                  href="tel:+33123456789" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-medium"
                >
                  +33 1 23 45 67 89
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQ;