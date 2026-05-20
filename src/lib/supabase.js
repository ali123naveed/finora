import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/clerk-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const session = useSession();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  accessToken: session?.getToken({ template: "supabase" }),
});
