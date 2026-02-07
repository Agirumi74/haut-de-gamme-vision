import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Save, FileText, Home, Info, Loader2, HelpCircle, Star, Phone, Mail, Users, Image, Sparkles } from "lucide-react";

interface ContentSection {
  id: string;
  page: string;
  section: string;
  content: Record<string, any>;
}

const AdminContent = () => {
  const [content, setContent] = useState<Record<string, Record<string, any>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("*");

    if (error) {
      toast.error("Erreur lors du chargement du contenu");
    } else if (data) {
      const contentMap: Record<string, Record<string, any>> = {};
      data.forEach((item) => {
        if (!contentMap[item.page]) contentMap[item.page] = {};
        contentMap[item.page][item.section] = item.content as Record<string, any>;
      });
      setContent(contentMap);
    }
    setIsLoading(false);
  };

  const updateContent = (page: string, section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [section]: {
          ...prev[page]?.[section],
          [field]: value
        }
      }
    }));
  };

  const updateArrayContent = (page: string, section: string, index: number, field: string, value: string) => {
    setContent(prev => {
      const items = [...(prev[page]?.[section]?.items || [])];
      if (!items[index]) items[index] = {};
      items[index][field] = value;
      return {
        ...prev,
        [page]: {
          ...prev[page],
          [section]: {
            ...prev[page]?.[section],
            items
          }
        }
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    for (const [page, sections] of Object.entries(content)) {
      for (const [section, sectionContent] of Object.entries(sections)) {
        const { error } = await supabase
          .from("site_content")
          .upsert({
            page,
            section,
            content: sectionContent
          }, { onConflict: 'page,section' });

        if (error) {
          toast.error(`Erreur pour ${page}/${section}`);
          setIsSaving(false);
          return;
        }
      }
    }

    toast.success("Contenu enregistré !");
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Contenus" description="Gestion du contenu des pages">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contenus" description="Modifiez tous les textes de votre site">
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="hero" className="flex items-center gap-1 text-xs">
            <Home className="h-3 w-3" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-1 text-xs">
            <Info className="h-3 w-3" />
            À propos
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-1 text-xs">
            <Sparkles className="h-3 w-3" />
            Services
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-1 text-xs">
            <FileText className="h-3 w-3" />
            Process
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-1 text-xs">
            <Image className="h-3 w-3" />
            Galerie
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1 text-xs">
            <Users className="h-3 w-3" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3" />
            Témoignages
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1 text-xs">
            <HelpCircle className="h-3 w-3" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1 text-xs">
            <Phone className="h-3 w-3" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex items-center gap-1 text-xs">
            <Mail className="h-3 w-3" />
            Newsletter
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Section Hero
              </CardTitle>
              <CardDescription>La première impression de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge / Accroche</Label>
                <Input
                  value={content.home?.hero?.badge || ""}
                  onChange={(e) => updateContent("home", "hero", "badge", e.target.value)}
                  placeholder="L'artisane de votre beauté"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre principal</Label>
                  <Input
                    value={content.home?.hero?.title || ""}
                    onChange={(e) => updateContent("home", "hero", "title", e.target.value)}
                    placeholder="Une Approche"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.hero?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "hero", "title_highlight", e.target.value)}
                    placeholder="Unique & Raffinée"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sous-titre / Description</Label>
                <Textarea
                  value={content.home?.hero?.subtitle || ""}
                  onChange={(e) => updateContent("home", "hero", "subtitle", e.target.value)}
                  placeholder="Description de votre activité..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bouton principal</Label>
                  <Input
                    value={content.home?.hero?.cta_primary || ""}
                    onChange={(e) => updateContent("home", "hero", "cta_primary", e.target.value)}
                    placeholder="Découvrir mes services"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bouton secondaire</Label>
                  <Input
                    value={content.home?.hero?.cta_secondary || ""}
                    onChange={(e) => updateContent("home", "hero", "cta_secondary", e.target.value)}
                    placeholder="Voir mon travail"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Section À propos
              </CardTitle>
              <CardDescription>Présentez votre histoire et votre expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.about?.title || ""}
                    onChange={(e) => updateContent("home", "about", "title", e.target.value)}
                    placeholder="L'Art au Service de"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.about?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "about", "title_highlight", e.target.value)}
                    placeholder="Votre Beauté"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paragraphe 1</Label>
                <Textarea
                  value={content.home?.about?.paragraph1 || ""}
                  onChange={(e) => updateContent("home", "about", "paragraph1", e.target.value)}
                  placeholder="Premier paragraphe..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Paragraphe 2</Label>
                <Textarea
                  value={content.home?.about?.paragraph2 || ""}
                  onChange={(e) => updateContent("home", "about", "paragraph2", e.target.value)}
                  placeholder="Deuxième paragraphe..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Paragraphe 3</Label>
                <Textarea
                  value={content.home?.about?.paragraph3 || ""}
                  onChange={(e) => updateContent("home", "about", "paragraph3", e.target.value)}
                  placeholder="Troisième paragraphe..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom signature</Label>
                  <Input
                    value={content.home?.about?.signature_name || ""}
                    onChange={(e) => updateContent("home", "about", "signature_name", e.target.value)}
                    placeholder="Marie Dubois"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre signature</Label>
                  <Input
                    value={content.home?.about?.signature_title || ""}
                    onChange={(e) => updateContent("home", "about", "signature_title", e.target.value)}
                    placeholder="Artiste Maquilleuse Professionnelle"
                  />
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-medium mb-4">Statistiques</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Label>Stat {i} (nombre)</Label>
                      <Input
                        value={content.home?.about?.[`stat${i}_number`] || ""}
                        onChange={(e) => updateContent("home", "about", `stat${i}_number`, e.target.value)}
                        placeholder="15+"
                      />
                      <Input
                        value={content.home?.about?.[`stat${i}_label`] || ""}
                        onChange={(e) => updateContent("home", "about", `stat${i}_label`, e.target.value)}
                        placeholder="Label"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Section Services
              </CardTitle>
              <CardDescription>Introduction de la section services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.services_intro?.badge || ""}
                  onChange={(e) => updateContent("home", "services_intro", "badge", e.target.value)}
                  placeholder="Mes Services"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.services_intro?.title || ""}
                    onChange={(e) => updateContent("home", "services_intro", "title", e.target.value)}
                    placeholder="L'Excellence au Service de"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.services_intro?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "services_intro", "title_highlight", e.target.value)}
                    placeholder="Votre Beauté"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sous-titre</Label>
                <Textarea
                  value={content.home?.services_intro?.subtitle || ""}
                  onChange={(e) => updateContent("home", "services_intro", "subtitle", e.target.value)}
                  placeholder="Description des services..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Process Section */}
        <TabsContent value="process">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Section Process
              </CardTitle>
              <CardDescription>Les étapes de votre accompagnement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.process?.badge || ""}
                  onChange={(e) => updateContent("home", "process", "badge", e.target.value)}
                  placeholder="Mon Approche"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.process?.title || ""}
                    onChange={(e) => updateContent("home", "process", "title", e.target.value)}
                    placeholder="Une Expérience"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.process?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "process", "title_highlight", e.target.value)}
                    placeholder="Sur-Mesure"
                  />
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-medium mb-4">Étapes (4 étapes)</h4>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Étape {i + 1} - Titre</Label>
                      <Input
                        value={content.home?.process?.items?.[i]?.title || ""}
                        onChange={(e) => updateArrayContent("home", "process", i, "title", e.target.value)}
                        placeholder="Titre étape"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={content.home?.process?.items?.[i]?.description || ""}
                        onChange={(e) => updateArrayContent("home", "process", i, "description", e.target.value)}
                        placeholder="Description de l'étape..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Section */}
        <TabsContent value="gallery">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Section Galerie
              </CardTitle>
              <CardDescription>Titres de la section portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.gallery?.badge || ""}
                  onChange={(e) => updateContent("home", "gallery", "badge", e.target.value)}
                  placeholder="Portfolio"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.gallery?.title || ""}
                    onChange={(e) => updateContent("home", "gallery", "title", e.target.value)}
                    placeholder="Mes"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.gallery?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "gallery", "title_highlight", e.target.value)}
                    placeholder="Réalisations"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sous-titre</Label>
                <Textarea
                  value={content.home?.gallery?.subtitle || ""}
                  onChange={(e) => updateContent("home", "gallery", "subtitle", e.target.value)}
                  placeholder="Découvrez quelques-unes de mes réalisations..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Section */}
        <TabsContent value="team">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Section Équipe
              </CardTitle>
              <CardDescription>Titres de la section équipe (membres gérés dans Équipe)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.team?.badge || ""}
                  onChange={(e) => updateContent("home", "team", "badge", e.target.value)}
                  placeholder="L'Équipe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.team?.title || ""}
                    onChange={(e) => updateContent("home", "team", "title", e.target.value)}
                    placeholder="Des Expertes"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.team?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "team", "title_highlight", e.target.value)}
                    placeholder="Passionnées"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sous-titre</Label>
                <Textarea
                  value={content.home?.team?.subtitle || ""}
                  onChange={(e) => updateContent("home", "team", "subtitle", e.target.value)}
                  placeholder="Une équipe dévouée à votre beauté..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Section Témoignages
              </CardTitle>
              <CardDescription>Avis clients et titres de section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.testimonials?.badge || ""}
                  onChange={(e) => updateContent("home", "testimonials", "badge", e.target.value)}
                  placeholder="Témoignages"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.testimonials?.title || ""}
                    onChange={(e) => updateContent("home", "testimonials", "title", e.target.value)}
                    placeholder="Ce Que Disent"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.testimonials?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "testimonials", "title_highlight", e.target.value)}
                    placeholder="Mes Clientes"
                  />
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-medium mb-4">Témoignages (jusqu'à 6)</h4>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={content.home?.testimonials?.items?.[i]?.name || ""}
                        onChange={(e) => updateArrayContent("home", "testimonials", i, "name", e.target.value)}
                        placeholder="Marie D."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Occasion</Label>
                      <Input
                        value={content.home?.testimonials?.items?.[i]?.occasion || ""}
                        onChange={(e) => updateArrayContent("home", "testimonials", i, "occasion", e.target.value)}
                        placeholder="Mariage"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Témoignage</Label>
                      <Textarea
                        value={content.home?.testimonials?.items?.[i]?.text || ""}
                        onChange={(e) => updateArrayContent("home", "testimonials", i, "text", e.target.value)}
                        placeholder="Son témoignage..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Section */}
        <TabsContent value="faq">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Section FAQ
              </CardTitle>
              <CardDescription>Questions fréquentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.faq?.badge || ""}
                  onChange={(e) => updateContent("home", "faq", "badge", e.target.value)}
                  placeholder="FAQ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.faq?.title || ""}
                    onChange={(e) => updateContent("home", "faq", "title", e.target.value)}
                    placeholder="Questions"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.faq?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "faq", "title_highlight", e.target.value)}
                    placeholder="Fréquentes"
                  />
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-medium mb-4">Questions (jusqu'à 8)</h4>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Question {i + 1}</Label>
                      <Input
                        value={content.home?.faq?.items?.[i]?.question || ""}
                        onChange={(e) => updateArrayContent("home", "faq", i, "question", e.target.value)}
                        placeholder="Votre question..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Réponse</Label>
                      <Textarea
                        value={content.home?.faq?.items?.[i]?.answer || ""}
                        onChange={(e) => updateArrayContent("home", "faq", i, "answer", e.target.value)}
                        placeholder="La réponse..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Section Contact
              </CardTitle>
              <CardDescription>Titres et textes de la section contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.home?.contact?.badge || ""}
                  onChange={(e) => updateContent("home", "contact", "badge", e.target.value)}
                  placeholder="Contact"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.contact?.title || ""}
                    onChange={(e) => updateContent("home", "contact", "title", e.target.value)}
                    placeholder="Prenons"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.contact?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "contact", "title_highlight", e.target.value)}
                    placeholder="Contact"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sous-titre</Label>
                <Textarea
                  value={content.home?.contact?.subtitle || ""}
                  onChange={(e) => updateContent("home", "contact", "subtitle", e.target.value)}
                  placeholder="Une question ? Un projet ? N'hésitez pas à me contacter..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Texte bouton formulaire</Label>
                <Input
                  value={content.home?.contact?.form_button || ""}
                  onChange={(e) => updateContent("home", "contact", "form_button", e.target.value)}
                  placeholder="Envoyer le message"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newsletter Section */}
        <TabsContent value="newsletter">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Section Newsletter
              </CardTitle>
              <CardDescription>Inscription à la newsletter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.newsletter?.title || ""}
                    onChange={(e) => updateContent("home", "newsletter", "title", e.target.value)}
                    placeholder="Restez Inspirée"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (surligné)</Label>
                  <Input
                    value={content.home?.newsletter?.title_highlight || ""}
                    onChange={(e) => updateContent("home", "newsletter", "title_highlight", e.target.value)}
                    placeholder="& Informée"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content.home?.newsletter?.description || ""}
                  onChange={(e) => updateContent("home", "newsletter", "description", e.target.value)}
                  placeholder="Inscrivez-vous pour recevoir mes conseils beauté..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Placeholder email</Label>
                  <Input
                    value={content.home?.newsletter?.placeholder || ""}
                    onChange={(e) => updateContent("home", "newsletter", "placeholder", e.target.value)}
                    placeholder="Votre email..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texte bouton</Label>
                  <Input
                    value={content.home?.newsletter?.button || ""}
                    onChange={(e) => updateContent("home", "newsletter", "button", e.target.value)}
                    placeholder="S'inscrire"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-gradient-luxury text-primary-foreground shadow-lg"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer tout le contenu
            </>
          )}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
