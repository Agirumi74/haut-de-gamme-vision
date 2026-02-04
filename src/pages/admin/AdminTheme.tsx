import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, Palette, Type, Plus, Trash2, Check, Loader2, Eye } from "lucide-react";

interface ThemeSettings {
  id: string;
  name: string;
  is_active: boolean;
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

const FONT_OPTIONS = [
  "Playfair Display",
  "Lato",
  "Montserrat",
  "Poppins",
  "Inter",
  "Cormorant Garamond",
  "Raleway",
  "Open Sans",
  "Roboto",
  "Source Sans Pro"
];

const COLOR_PRESETS = [
  { name: "Luxury Gold", primary: "43 74% 49%", secondary: "36 33% 80%", accent: "43 100% 50%" },
  { name: "Rose Élégant", primary: "350 60% 55%", secondary: "350 30% 90%", accent: "350 80% 45%" },
  { name: "Noir & Or", primary: "45 80% 45%", secondary: "0 0% 20%", accent: "45 100% 55%" },
  { name: "Nude Nature", primary: "25 40% 55%", secondary: "30 30% 85%", accent: "20 50% 45%" },
  { name: "Océan Luxe", primary: "200 60% 45%", secondary: "200 30% 85%", accent: "200 80% 40%" }
];

const AdminTheme = () => {
  const [themes, setThemes] = useState<ThemeSettings[]>([]);
  const [activeTheme, setActiveTheme] = useState<ThemeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");

  // Edit form state
  const [colors, setColors] = useState<Record<string, string>>({
    primary: "43 74% 49%",
    secondary: "36 33% 80%",
    accent: "43 100% 50%",
    background: "40 20% 98%",
    foreground: "240 10% 3.9%"
  });
  const [fonts, setFonts] = useState<Record<string, string>>({
    heading: "Playfair Display",
    body: "Lato"
  });

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("theme_settings")
      .select("*")
      .order("created_at");

    if (error) {
      toast.error("Erreur lors du chargement des thèmes");
    } else if (data) {
      const typedThemes = data.map(t => ({
        ...t,
        colors: (t.colors || {}) as Record<string, string>,
        fonts: (t.fonts || {}) as Record<string, string>
      }));
      setThemes(typedThemes);
      const active = typedThemes.find(t => t.is_active);
      if (active) {
        setActiveTheme(active);
        setColors(active.colors);
        setFonts(active.fonts);
      }
    }
    setIsLoading(false);
  };

  const updateColor = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setColors(prev => ({
      ...prev,
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent
    }));
    toast.success(`Palette "${preset.name}" appliquée`);
  };

  const handleCreateTheme = async () => {
    if (!newThemeName.trim()) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    const { data, error } = await supabase
      .from("theme_settings")
      .insert({
        name: newThemeName,
        is_active: false,
        colors,
        fonts
      })
      .select()
      .single();

    if (error) {
      toast.error("Erreur lors de la création");
    } else if (data) {
      const typedData = {
        ...data,
        colors: (data.colors || {}) as Record<string, string>,
        fonts: (data.fonts || {}) as Record<string, string>
      };
      toast.success("Thème créé !");
      setThemes(prev => [...prev, typedData]);
      setNewThemeName("");
      setIsDialogOpen(false);
    }
  };

  const handleActivateTheme = async (theme: ThemeSettings) => {
    // Deactivate all themes first
    await supabase
      .from("theme_settings")
      .update({ is_active: false })
      .neq("id", "none");

    // Activate selected theme
    const { error } = await supabase
      .from("theme_settings")
      .update({ is_active: true })
      .eq("id", theme.id);

    if (error) {
      toast.error("Erreur lors de l'activation");
    } else {
      toast.success(`Thème "${theme.name}" activé`);
      setActiveTheme(theme);
      setColors(theme.colors);
      setFonts(theme.fonts);
      fetchThemes();
    }
  };

  const handleSave = async () => {
    if (!activeTheme) {
      toast.error("Aucun thème actif");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("theme_settings")
      .update({ colors, fonts })
      .eq("id", activeTheme.id);

    if (error) {
      toast.error("Erreur lors de l'enregistrement");
    } else {
      toast.success("Thème enregistré !");
      fetchThemes();
    }

    setIsSaving(false);
  };

  const handleDeleteTheme = async (theme: ThemeSettings) => {
    if (theme.is_active) {
      toast.error("Impossible de supprimer le thème actif");
      return;
    }
    if (!confirm(`Supprimer le thème "${theme.name}" ?`)) return;

    const { error } = await supabase
      .from("theme_settings")
      .delete()
      .eq("id", theme.id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Thème supprimé");
      fetchThemes();
    }
  };

  const hslToHex = (hsl: string) => {
    const [h, s, l] = hsl.split(" ").map(v => parseFloat(v.replace("%", "")));
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Thème" description="Personnalisez l'apparence du site">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Thème" description="Personnalisez les couleurs et polices">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selector */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thèmes</span>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau thème</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nom du thème</Label>
                        <Input
                          value={newThemeName}
                          onChange={(e) => setNewThemeName(e.target.value)}
                          placeholder="Mon thème personnalisé"
                        />
                      </div>
                      <Button onClick={handleCreateTheme} className="w-full">
                        Créer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    theme.is_active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleActivateTheme(theme)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: hslToHex(theme.colors.primary || "43 74% 49%") }}
                    />
                    <span className="font-medium">{theme.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {theme.is_active && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                    {!theme.is_active && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTheme(theme);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Color Presets */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Palettes prédéfinies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {COLOR_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hslToHex(preset.primary) }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hslToHex(preset.secondary) }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hslToHex(preset.accent) }} />
                  </div>
                  <span>{preset.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Color & Font Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Colors */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Couleurs
              </CardTitle>
              <CardDescription>Personnalisez la palette de couleurs (format HSL)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg border border-border shrink-0"
                    style={{ backgroundColor: hslToHex(value) }}
                  />
                  <div className="flex-1 space-y-1">
                    <Label className="capitalize">{key.replace("_", " ")}</Label>
                    <Input
                      value={value}
                      onChange={(e) => updateColor(key, e.target.value)}
                      placeholder="43 74% 49%"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fonts */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Typographie
              </CardTitle>
              <CardDescription>Choisissez les polices du site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Police des titres</Label>
                <Select
                  value={fonts.heading}
                  onValueChange={(v) => setFonts(prev => ({ ...prev, heading: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Police du texte</Label>
                <Select
                  value={fonts.body}
                  onValueChange={(v) => setFonts(prev => ({ ...prev, body: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="mt-6 p-6 rounded-lg border border-border" style={{ backgroundColor: hslToHex(colors.background) }}>
                <h3
                  style={{
                    fontFamily: fonts.heading,
                    color: hslToHex(colors.primary),
                    fontSize: "1.5rem",
                    fontWeight: "bold"
                  }}
                >
                  Aperçu du thème
                </h3>
                <p
                  style={{
                    fontFamily: fonts.body,
                    color: hslToHex(colors.foreground),
                    marginTop: "0.5rem"
                  }}
                >
                  Voici un exemple de texte avec les polices et couleurs sélectionnées.
                </p>
                <button
                  style={{
                    backgroundColor: hslToHex(colors.primary),
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    marginTop: "1rem",
                    fontFamily: fonts.body
                  }}
                >
                  Bouton exemple
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving || !activeTheme}
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
              Enregistrer le thème
            </>
          )}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminTheme;
