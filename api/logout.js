export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader(
    "Set-Cookie",
    "booktrack_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  );
  return res.status(200).json({ ok: true });
}
