import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  page: string;
  section: string;
  content: Record<string, any>;
}

export const useSiteContent = (page: string, section?: string) => {
  return useQuery({
    queryKey: ["site-content", page, section],
    queryFn: async () => {
      let query = supabase
        .from("site_content")
        .select("*")
        .eq("page", page);
      
      if (section) {
        query = query.eq("section", section);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to a more usable format
      const contentMap: Record<string, Record<string, any>> = {};
      data?.forEach((item) => {
        contentMap[item.section] = item.content as Record<string, any>;
      });

      return contentMap;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: Record<string, any> = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value;
      });

      return settingsMap;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useActiveTheme = () => {
  return useQuery({
    queryKey: ["active-theme"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
