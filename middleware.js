import { next } from "@vercel/functions";

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  return Uint8Array.from(atob(padded), char => char.charCodeAt(0));
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
}

async function hasValidSession(token, secret) {
  if (!token || !secret) return false;
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signed = await crypto.subtle.sign(
      "HMAC", key, new TextEncoder().encode(payload)
    );
    if (signature !== bytesToBase64Url(new Uint8Array(signed))) return false;

    const session = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payload))
    );
    return Number.isFinite(session.exp) &&
      session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith("booktrack_session="));
  const token = cookie ? cookie.slice("booktrack_session=".length) : "";

  if (await hasValidSession(token, process.env.SESSION_SECRET)) {
    return next();
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL("/login.html", request.url).toString(),
      "Cache-Control": "no-store"
    }
  });
}

// Exact routes only: login.html, /api/* and all static files bypass middleware.
// This avoids the self-redirect loop from the previous broad matcher.
export const config = {
  matcher: ["/", "/index.html"]
};
