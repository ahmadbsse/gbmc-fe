import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret key

export async function middleware(req) {
  const token = req.cookies.get("authToken");
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      // Redirect to login if no token is found
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    try {
      // Extract the token value (for Edge Runtime, token could be string or object)
      const tokenValue = typeof token === "string" ? token : token?.value;

      if (!tokenValue) throw new Error("Token missing or invalid");

      // Verify the JWT using jose
      await jwtVerify(tokenValue, secret);
    } catch (err) {
      console.error("JWT verification failed:", err.message);

      // Redirect to login on error
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next(); // Proceed if JWT is valid
}

export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to all admin routes
};
