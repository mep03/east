/**
 * @info Determines whether a given custom URL is valid.
 * @desc This function checks if the provided custom URL contains only allowed characters, including:
 *       - Letters (both uppercase and lowercase)
 *       - Digits
 *       - Minus sign (-)
 *       - Underscore (_)
 * @param {string} customUrl - The custom URL to be validated.
 * @returns {boolean} - True if the custom URL is valid, otherwise false.
 */
export function isValidCustomUrl(customUrl: string): boolean {
  const pattern = /^[a-zA-Z0-9\-_]+$/;
  return pattern.test(customUrl);
}
