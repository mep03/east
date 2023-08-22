/**
 * Generates a token.
 * @info This function generates a random token consisting of alphanumeric characters.
 * @desc Handles the logic for generating a token.
 * @returns {string} A randomly generated token.
 */
export function generateToken(): string {
  const tokenLength = 32;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
