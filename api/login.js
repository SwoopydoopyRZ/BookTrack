import { createHmac, timingSafeEqual } from "node:crypto";

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedPassword = process.env.HOUSEHOLD_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!expectedPassword || !sessionSecret) {
    return res.status(500).json({
      error: "Login is not configured. Add HOUSEHOLD_PASSWORD and SESSION_SECRET in Vercel."
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const submitted = typeof body?.password === "string" ? body.password : "";
  const a = Buffer.from(submitted, "utf8");
  const b = Buffer.from(expectedPassword, "utf8");
  const matches = a.length === b.length && timingSafeEqual(a, b);

  if (!matches) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString("base64url");
  const token = `${payload}.${sign(payload, sessionSecret)}`;

  res.setHeader("Cache-Control", "no-store");
  res.setHeader(
    "Set-Cookie",
    `booktrack_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );
  return res.status(200).json({ ok: true });
}
