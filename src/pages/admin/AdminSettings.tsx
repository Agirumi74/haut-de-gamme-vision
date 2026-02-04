import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Globe, Phone, Clock, Share2, Loader2 } from "lucide-react";

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
    <AdminLayout title="Paramètres" description="Configuration générale du site">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Réseaux</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Informations générales
              </CardTitle>
              <CardDescription>Nom et slogan du site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nom du site</Label>
                <Input
                  id="site_name"
                  value={settings.site_name || ""}
                  onChange={(e) => updateSetting("site_name", e.target.value)}
                  placeholder="Artisan Beauty"
                />
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
                  <Label htmlFor="contact_email">Email</Label>
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
                <Label htmlFor="contact_address">Adresse</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ""}
                  onChange={(e) => updateSetting("contact_address", e.target.value)}
                  placeholder="123 Rue de la Beauté, 75008 Paris"
                  rows={2}
                />
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
                      placeholder="9h-19h"
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
              <CardDescription>Liens vers vos profils sociaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input
                  id="social_instagram"
                  value={settings.social_instagram || ""}
                  onChange={(e) => updateSetting("social_instagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input
                  id="social_facebook"
                  value={settings.social_facebook || ""}
                  onChange={(e) => updateSetting("social_facebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_tiktok">TikTok</Label>
                <Input
                  id="social_tiktok"
                  value={settings.social_tiktok || ""}
                  onChange={(e) => updateSetting("social_tiktok", e.target.value)}
                  placeholder="https://tiktok.com/@..."
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
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
