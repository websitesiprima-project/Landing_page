import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // 1. Buat Response Awal
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // 2. Cek User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- DEBUGGING LOG (LIHAT DI TERMINAL VS CODE) ---
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
  console.log(
    `[Middleware] User Logged In: ${user ? "YES (" + user.email + ")" : "NO"}`,
  );
  // ------------------------------------------------

  // 3. ATURAN PROTEKSI HALAMAN

  // A. Jika TIDAK login, tapi mau masuk Dashboard -> Tendang ke Login
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("[Middleware] Redirecting Guest to /auth");
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // B. Jika SUDAH login, tapi ada di Login/Home -> Lempar ke Dashboard
  if (user) {
    if (
      request.nextUrl.pathname === "/auth" ||
      request.nextUrl.pathname === "/"
    ) {
      console.log("[Middleware] Redirecting User to /dashboard");
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
};
