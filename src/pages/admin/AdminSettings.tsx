import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Globe, Phone, Clock, Share2, Loader2, Building2, Search, CreditCard, CalendarDays, Puzzle } from "lucide-react";
import BackupRestore from "@/components/admin/BackupRestore";

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      toast.error("Erreur lors du chargement des paramètres");
    } else if (data) {
      const settingsMap: Record<string, any> = {};
      data.forEach((s: Setting) => {
        settingsMap[s.key] = typeof s.value === 'string' ? JSON.parse(s.value) : s.value;
      });
      setSettings(settingsMap);
    }
    setIsLoading(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
      category: getCategoryForKey(key)
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(update, { onConflict: 'key' });
      
      if (error) {
        toast.error(`Erreur pour ${update.key}`);
        setIsSaving(false);
        return;
      }
    }

    toast.success("Paramètres enregistrés !");
    setIsSaving(false);
  };

  const getCategoryForKey = (key: string): string => {
    if (key.startsWith('contact_') || key === 'opening_hours') return 'contact';
    if (key.startsWith('social_')) return 'social';
    if (key.startsWith('seo_')) return 'seo';
    if (key.startsWith('integration_')) return 'integrations';
    return 'general';
  };

  if (isLoading) {
    return (
      <AdminLayout title="Paramètres" description="Configuration du site">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Paramètres" description="Configuration complète de votre site">
      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="identity" className="flex items-center gap-1 text-xs">
            <Building2 className="h-3 w-3" />
            Identité
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1 text-xs">
            <Phone className="h-3 w-3" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-1 text-xs">
            <Share2 className="h-3 w-3" />
            Réseaux
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1 text-xs">
            <Search className="h-3 w-3" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1 text-xs">
            <Puzzle className="h-3 w-3" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1 text-xs">
            <Globe className="h-3 w-3" />
            Sauvegarde
          </TabsTrigger>
        </TabsList>

        {/* Identity Settings */}
        <TabsContent value="identity">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Identité du site
              </CardTitle>
              <CardDescription>Informations principales de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nom du site / Entreprise</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name || ""}
                    onChange={(e) => updateSetting("site_name", e.target.value)}
                    placeholder="Artisan Beauty"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_logo_url">URL du logo</Label>
                  <Input
                    id="site_logo_url"
                    value={settings.site_logo_url || ""}
                    onChange={(e) => updateSetting("site_logo_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_tagline">Slogan / Tagline</Label>
                <Textarea
                  id="site_tagline"
                  value={settings.site_tagline || ""}
                  onChange={(e) => updateSetting("site_tagline", e.target.value)}
                  placeholder="L'art de révéler votre beauté naturelle"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Description courte</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ""}
                  onChange={(e) => updateSetting("site_description", e.target.value)}
                  placeholder="Décrivez votre activité en quelques phrases..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_siret">SIRET</Label>
                  <Input
                    id="site_siret"
                    value={settings.site_siret || ""}
                    onChange={(e) => updateSetting("site_siret", e.target.value)}
                    placeholder="123 456 789 00012"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tva">N° TVA Intracommunautaire</Label>
                  <Input
                    id="site_tva"
                    value={settings.site_tva || ""}
                    onChange={(e) => updateSetting("site_tva", e.target.value)}
                    placeholder="FR12345678901"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Coordonnées
              </CardTitle>
              <CardDescription>Informations de contact affichées sur le site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email principal</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => updateSetting("contact_email", e.target.value)}
                    placeholder="contact@artisanbeauty.fr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Téléphone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ""}
                    onChange={(e) => updateSetting("contact_phone", e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">Adresse complète</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ""}
                  onChange={(e) => updateSetting("contact_address", e.target.value)}
                  placeholder="123 Rue de la Beauté, 75008 Paris"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_city">Ville</Label>
                  <Input
                    id="contact_city"
                    value={settings.contact_city || ""}
                    onChange={(e) => updateSetting("contact_city", e.target.value)}
                    placeholder="Paris"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_postal_code">Code postal</Label>
                  <Input
                    id="contact_postal_code"
                    value={settings.contact_postal_code || ""}
                    onChange={(e) => updateSetting("contact_postal_code", e.target.value)}
                    placeholder="75008"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horaires d'ouverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"].map((day) => (
                  <div key={day} className="space-y-2">
                    <Label htmlFor={`hours_${day}`} className="capitalize">{day}</Label>
                    <Input
                      id={`hours_${day}`}
                      value={settings.opening_hours?.[day] || ""}
                      onChange={(e) => {
                        const newHours = { ...settings.opening_hours, [day]: e.target.value };
                        updateSetting("opening_hours", newHours);
                      }}
                      placeholder="9h-19h ou Fermé"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Settings */}
        <TabsContent value="social">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Réseaux sociaux
              </CardTitle>
              <CardDescription>Liens vers vos profils sociaux (affichés dans le footer)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram || ""}
                    onChange={(e) => updateSetting("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/votre-compte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook || ""}
                    onChange={(e) => updateSetting("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/votre-page"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_tiktok">TikTok</Label>
                  <Input
                    id="social_tiktok"
                    value={settings.social_tiktok || ""}
                    onChange={(e) => updateSetting("social_tiktok", e.target.value)}
                    placeholder="https://tiktok.com/@votre-compte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube || ""}
                    onChange={(e) => updateSetting("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/@votre-chaine"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ""}
                    onChange={(e) => updateSetting("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/votre-profil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_pinterest">Pinterest</Label>
                  <Input
                    id="social_pinterest"
                    value={settings.social_pinterest || ""}
                    onChange={(e) => updateSetting("social_pinterest", e.target.value)}
                    placeholder="https://pinterest.com/votre-compte"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Référencement (SEO)
              </CardTitle>
              <CardDescription>Optimisez votre visibilité sur les moteurs de recherche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Titre de la page d'accueil (meta title)</Label>
                <Input
                  id="seo_title"
                  value={settings.seo_title || ""}
                  onChange={(e) => updateSetting("seo_title", e.target.value)}
                  placeholder="Artisan Beauty | Maquilleuse Professionnelle Paris"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {(settings.seo_title?.length || 0)}/60 caractères recommandés
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">Meta description</Label>
                <Textarea
                  id="seo_description"
                  value={settings.seo_description || ""}
                  onChange={(e) => updateSetting("seo_description", e.target.value)}
                  placeholder="Artiste maquilleuse professionnelle à Paris. Maquillage mariage, événements, formations..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {(settings.seo_description?.length || 0)}/160 caractères recommandés
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Mots-clés (séparés par des virgules)</Label>
                <Input
                  id="seo_keywords"
                  value={settings.seo_keywords || ""}
                  onChange={(e) => updateSetting("seo_keywords", e.target.value)}
                  placeholder="maquilleuse paris, maquillage mariage, formation maquillage"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_og_image">Image Open Graph (réseaux sociaux)</Label>
                  <Input
                    id="seo_og_image"
                    value={settings.seo_og_image || ""}
                    onChange={(e) => updateSetting("seo_og_image", e.target.value)}
                    placeholder="https://votresite.com/og-image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_canonical">URL canonique</Label>
                  <Input
                    id="seo_canonical"
                    value={settings.seo_canonical || ""}
                    onChange={(e) => updateSetting("seo_canonical", e.target.value)}
                    placeholder="https://www.votresite.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_google_analytics">ID Google Analytics</Label>
                <Input
                  id="seo_google_analytics"
                  value={settings.seo_google_analytics || ""}
                  onChange={(e) => updateSetting("seo_google_analytics", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Stripe */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Stripe (Paiements)
                </CardTitle>
                <CardDescription>Configurez les paiements en ligne</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activer Stripe</p>
                    <p className="text-sm text-muted-foreground">Permettre les paiements en ligne</p>
                  </div>
                  <Switch
                    checked={settings.integration_stripe_enabled || false}
                    onCheckedChange={(checked) => updateSetting("integration_stripe_enabled", checked)}
                  />
                </div>
                {settings.integration_stripe_enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Clé publique Stripe</Label>
                      <Input
                        value={settings.integration_stripe_public_key || ""}
                        onChange={(e) => updateSetting("integration_stripe_public_key", e.target.value)}
                        placeholder="pk_live_..."
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💡 La clé secrète Stripe est gérée de manière sécurisée. 
                        Pour la configurer, contactez l'administrateur ou utilisez les paramètres avancés.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Google Calendar */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Google Calendar (Réservations)
                </CardTitle>
                <CardDescription>Synchronisez vos réservations avec Google Calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activer Google Calendar</p>
                    <p className="text-sm text-muted-foreground">Synchroniser les réservations automatiquement</p>
                  </div>
                  <Switch
                    checked={settings.integration_gcal_enabled || false}
                    onCheckedChange={(checked) => updateSetting("integration_gcal_enabled", checked)}
                  />
                </div>
                {settings.integration_gcal_enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>ID du calendrier</Label>
                      <Input
                        value={settings.integration_gcal_calendar_id || ""}
                        onChange={(e) => updateSetting("integration_gcal_calendar_id", e.target.value)}
                        placeholder="votre-email@gmail.com ou ID du calendrier"
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💡 Pour configurer l'intégration Google Calendar, vous devrez autoriser l'accès à votre compte Google.
                        Cette fonctionnalité sera disponible prochainement via les connecteurs.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Email / Newsletter */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="h-5 w-5 text-primary" />
                  Autres intégrations
                </CardTitle>
                <CardDescription>Services tiers et outils marketing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mailchimp / Newsletter API Key</Label>
                  <Input
                    value={settings.integration_mailchimp_api_key || ""}
                    onChange={(e) => updateSetting("integration_mailchimp_api_key", e.target.value)}
                    placeholder="Clé API Mailchimp (optionnel)"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Business (numéro)</Label>
                  <Input
                    value={settings.integration_whatsapp_number || ""}
                    onChange={(e) => updateSetting("integration_whatsapp_number", e.target.value)}
                    placeholder="+33612345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook Pixel ID</Label>
                  <Input
                    value={settings.integration_fb_pixel || ""}
                    onChange={(e) => updateSetting("integration_fb_pixel", e.target.value)}
                    placeholder="123456789012345"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup/Restore */}
        <TabsContent value="backup">
          <BackupRestore />
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
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
