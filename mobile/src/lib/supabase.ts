import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const SUPABASE_URL =
  "https://tkljpaysyiivyzfmslce.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_281vr3eXxVMcj_tyZn7xAw_-UJ1GJE3";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      ...(Platform.OS === "web"
        ? {}
        : {
            storage: AsyncStorage,
          }),

      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);