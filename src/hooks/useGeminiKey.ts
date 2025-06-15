
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGeminiKey() {
  return useQuery({
    queryKey: ["gemini-key"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api key")
        .select('"api key"')
        .limit(1)
        .maybeSingle(); // Avoid .single() in case table is empty
      if (error) throw new Error("Error fetching Gemini key");
      // Return the value of the "api key" column, or null if not found
      return data?.["api key"] as string | null;
    }
  });
}
