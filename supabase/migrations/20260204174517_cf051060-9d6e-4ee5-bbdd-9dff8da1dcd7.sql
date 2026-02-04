-- Site settings table for general configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Site content table for editable page content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page, section)
);

-- Media library table
CREATE TABLE public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Theme settings table
CREATE TABLE public.theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT false,
  colors JSONB NOT NULL DEFAULT '{}',
  fonts JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings, content and theme
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Anyone can view media" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Anyone can view theme settings" ON public.theme_settings FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage media" ON public.media_library FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage theme settings" ON public.theme_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON public.media_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_theme_settings_updated_at BEFORE UPDATE ON public.theme_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for site media
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

-- Storage policies
CREATE POLICY "Public can view site media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
CREATE POLICY "Admins can upload site media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site media" ON storage.objects FOR UPDATE USING (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site media" ON storage.objects FOR DELETE USING (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'));

-- Insert default site settings
INSERT INTO public.site_settings (key, value, category) VALUES
  ('site_name', '"Artisan Beauty"', 'general'),
  ('site_tagline', '"L''art de révéler votre beauté naturelle"', 'general'),
  ('contact_email', '"contact@artisanbeauty.fr"', 'contact'),
  ('contact_phone', '"+33 1 23 45 67 89"', 'contact'),
  ('contact_address', '"123 Rue de la Beauté, 75008 Paris"', 'contact'),
  ('opening_hours', '{"lundi": "9h-19h", "mardi": "9h-19h", "mercredi": "9h-19h", "jeudi": "9h-19h", "vendredi": "9h-19h", "samedi": "10h-18h", "dimanche": "Fermé"}', 'contact'),
  ('social_instagram', '"https://instagram.com/artisanbeauty"', 'social'),
  ('social_facebook', '"https://facebook.com/artisanbeauty"', 'social'),
  ('social_tiktok', '""', 'social');

-- Insert default page content
INSERT INTO public.site_content (page, section, content) VALUES
  ('home', 'hero', '{"title": "L''Excellence du Maquillage Professionnel", "subtitle": "Artisan Beauty sublime votre beauté naturelle avec des techniques d''expert et des produits premium", "cta_primary": "Réserver maintenant", "cta_secondary": "Découvrir nos services"}'),
  ('home', 'about', '{"title": "Notre Philosophie", "description": "Chez Artisan Beauty, nous croyons que chaque visage raconte une histoire unique. Notre mission est de révéler votre beauté authentique à travers des techniques de maquillage expertes et des produits soigneusement sélectionnés."}'),
  ('home', 'services_intro', '{"title": "Nos Services", "subtitle": "Des prestations sur-mesure pour révéler votre beauté"}'),
  ('home', 'cta', '{"title": "Prête à Révéler Votre Beauté ?", "description": "Réservez votre séance de maquillage professionnel et laissez-nous sublimer votre beauté naturelle.", "button_text": "Réserver maintenant"}'),
  ('about', 'main', '{"title": "À Propos", "content": "Artisan Beauty est né d''une passion pour l''art du maquillage et le désir de révéler la beauté unique de chaque personne."}');

-- Insert default theme
INSERT INTO public.theme_settings (name, is_active, colors, fonts) VALUES
  ('Luxury Gold', true, '{"primary": "43 74% 49%", "secondary": "36 33% 80%", "accent": "43 100% 50%", "background": "40 20% 98%", "foreground": "240 10% 3.9%"}', '{"heading": "Playfair Display", "body": "Lato"}');