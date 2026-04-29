import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // unprotected routes
  const isPublicRoute = request.nextUrl.pathname.startsWith("/auth");

  if (!user && !isPublicRoute) {
    // redirect to login page if user is not authenticated and trying to access protected route
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isPublicRoute) {
    // redirect to dashboard if user is authenticated and trying to access auth page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
