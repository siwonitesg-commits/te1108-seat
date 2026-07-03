import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hnyxwomrfwqqfhpnxpak.supabase.co";
const supabaseKey = "sb_publishable_eNeXTCQbSaP-OK4ljDHTRQ_bDrh2t4P";

export const supabase = createClient(supabaseUrl, supabaseKey);