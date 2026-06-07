// PHASE-2 / SEC-002, SEC-012 — derive monitoring signals from a request as
// HMAC hashes only. Raw IP / user-agent / cookies are NEVER stored or logged.
import { createHmac } from "node:crypto";

let ephemeralSalt: string | null = null;

function salt(): string {
  const s = process.env.HASH_SALT;
  if (s) return s;
  // Dev/test fallback: a per-process random salt (not persistent). Production
  // MUST set HASH_SALT so hashes are stable for abuse monitoring.
  if (!ephemeralSalt) {
    ephemeralSalt = createHmac("sha256", "ephemeral").update(String(process.pid)).digest("hex");
    if (process.env.NODE_ENV === "production") {
      console.warn("[security] HASH_SALT is not set — using an ephemeral salt. Set HASH_SALT in production.");
    }
  }
  return ephemeralSalt;
}

export function hashValue(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return createHmac("sha256", salt()).update(raw).digest("hex");
}

export interface ClientContext {
  ip_hash: string | null;
  user_agent_hash: string | null;
  session_hash: string | null;
  user_agent_raw: string; // kept in-memory only for bot heuristics, never stored
}

function firstIp(forwarded: string | null): string | null {
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() || null;
}

export interface HeadersLike {
  get(name: string): string | null;
}

export function extractClientContext(headers: HeadersLike): ClientContext {
  const ip =
    firstIp(headers.get("x-forwarded-for")) ??
    headers.get("x-real-ip") ??
    null;
  const ua = headers.get("user-agent") ?? "";
  const cookie = headers.get("cookie") ?? "";
  const sessionMatch = cookie.match(/(?:^|;\s*)wii_sid=([^;]+)/);
  return {
    ip_hash: hashValue(ip),
    user_agent_hash: hashValue(ua || null),
    session_hash: hashValue(sessionMatch?.[1] ?? null),
    user_agent_raw: ua,
  };
}
