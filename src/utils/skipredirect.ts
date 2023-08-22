/**
 * @info Determines whether a given short URL should be skipped for redirection.
 * @desc This function checks if the provided short URL is among the predefined values or if it starts with "dashboard".
 *       Short URLs like "signin", "signup", "privacy", and "about" are considered to be skipped for redirection,
 *       along with those starting with "dashboard". Returns true if skipping is required, otherwise false.
 * @param shortUrl The short URL to be checked for redirection skipping.
 * @returns True if the short URL should be skipped for redirection, otherwise false.
 */
export function shouldSkipRedirect(shortUrl: string): boolean {
  return (
    shortUrl === "signin" ||
    shortUrl === "signup" ||
    shortUrl === "privacy" ||
    shortUrl === "about" ||
    shortUrl.startsWith("dashboard")
  );
}
