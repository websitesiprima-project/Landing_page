import { createBrowserClient } from "@supabase/ssr";

// Gunakan createBrowserClient agar sesi otomatis tersimpan di Cookies
// sehingga bisa dibaca oleh Middleware dan Server Components.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
