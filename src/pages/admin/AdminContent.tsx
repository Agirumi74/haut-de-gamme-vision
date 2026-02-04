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
import { Save, FileText, Home, Info, Loader2 } from "lucide-react";

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
    <AdminLayout title="Contenus" description="Modifiez les textes de votre site">
      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Accueil
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            À propos
          </TabsTrigger>
        </TabsList>

        {/* Home Page Content */}
        <TabsContent value="home">
          <Accordion type="multiple" defaultValue={["hero", "about", "cta"]} className="space-y-4">
            {/* Hero Section */}
            <AccordionItem value="hero" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Section Hero</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label>Titre principal</Label>
                  <Input
                    value={content.home?.hero?.title || ""}
                    onChange={(e) => updateContent("home", "hero", "title", e.target.value)}
                    placeholder="L'Excellence du Maquillage Professionnel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Textarea
                    value={content.home?.hero?.subtitle || ""}
                    onChange={(e) => updateContent("home", "hero", "subtitle", e.target.value)}
                    placeholder="Description de votre activité..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bouton principal</Label>
                    <Input
                      value={content.home?.hero?.cta_primary || ""}
                      onChange={(e) => updateContent("home", "hero", "cta_primary", e.target.value)}
                      placeholder="Réserver maintenant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bouton secondaire</Label>
                    <Input
                      value={content.home?.hero?.cta_secondary || ""}
                      onChange={(e) => updateContent("home", "hero", "cta_secondary", e.target.value)}
                      placeholder="Découvrir nos services"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* About Section */}
            <AccordionItem value="about" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Section À propos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.about?.title || ""}
                    onChange={(e) => updateContent("home", "about", "title", e.target.value)}
                    placeholder="Notre Philosophie"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.home?.about?.description || ""}
                    onChange={(e) => updateContent("home", "about", "description", e.target.value)}
                    placeholder="Décrivez votre philosophie..."
                    rows={4}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Services Intro */}
            <AccordionItem value="services" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Section Services</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.services_intro?.title || ""}
                    onChange={(e) => updateContent("home", "services_intro", "title", e.target.value)}
                    placeholder="Nos Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Input
                    value={content.home?.services_intro?.subtitle || ""}
                    onChange={(e) => updateContent("home", "services_intro", "subtitle", e.target.value)}
                    placeholder="Des prestations sur-mesure..."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* CTA Section */}
            <AccordionItem value="cta" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Section Appel à l'action</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={content.home?.cta?.title || ""}
                    onChange={(e) => updateContent("home", "cta", "title", e.target.value)}
                    placeholder="Prête à Révéler Votre Beauté ?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.home?.cta?.description || ""}
                    onChange={(e) => updateContent("home", "cta", "description", e.target.value)}
                    placeholder="Texte d'incitation..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texte du bouton</Label>
                  <Input
                    value={content.home?.cta?.button_text || ""}
                    onChange={(e) => updateContent("home", "cta", "button_text", e.target.value)}
                    placeholder="Réserver maintenant"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* About Page Content */}
        <TabsContent value="about">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Page À propos</CardTitle>
              <CardDescription>Contenu de la page À propos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={content.about?.main?.title || ""}
                  onChange={(e) => updateContent("about", "main", "title", e.target.value)}
                  placeholder="À Propos"
                />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea
                  value={content.about?.main?.content || ""}
                  onChange={(e) => updateContent("about", "main", "content", e.target.value)}
                  placeholder="Histoire de votre entreprise..."
                  rows={8}
                />
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
              Enregistrer le contenu
            </>
          )}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
