import apicache from "apicache";

const cacheapi = apicache.middleware;

/**
 * Middleware to set up caching using apicache
 * @param duration - The duration for caching in human-readable format (e.g., '1 hour', '5 minutes')
 * @returns Cache middleware
 */
export const cache = (duration: string) => {
  return cacheapi(duration);
};
