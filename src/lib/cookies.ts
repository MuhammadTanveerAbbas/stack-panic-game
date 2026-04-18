import Cookies from "js-cookie";

const IS_PRODUCTION = import.meta.env.PROD;

/** Shared cookie options applied to all writes. Secure flag is set in production only. */
const BASE_OPTIONS: Cookies.CookieAttributes = {
  sameSite: "Lax",
  secure: IS_PRODUCTION,
};

/**
 * Retrieves a cookie value by key.
 * Returns undefined when running server-side or when the cookie doesn't exist.
 */
export function getCookie(key: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(key);
}

/**
 * Sets a cookie with the given key, value, and expiry in days.
 * Defaults to 365-day expiry. Applies sameSite and secure flags automatically.
 */
export function setCookie(
  key: string,
  value: string,
  expiresInDays = 365,
): void {
  if (typeof window === "undefined") return;
  Cookies.set(key, value, { ...BASE_OPTIONS, expires: expiresInDays });
}

/**
 * Removes a cookie by key.
 */
export function removeCookie(key: string): void {
  if (typeof window === "undefined") return;
  Cookies.remove(key);
}

/**
 * Returns a persistent anonymous user ID stored in a cookie.
 * Generates a new UUID and persists it for 365 days if none exists.
 */
export function getAnonymousUserId(): string {
  const existing = getCookie("sp_user_id");
  if (existing) return existing;
  const newId = crypto.randomUUID();
  setCookie("sp_user_id", newId, 365);
  return newId;
}
