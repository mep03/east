/**
 * @info Determines whether a given password meets the criteria for a strong password.
 * @desc This function evaluates the provided password against predefined criteria for strength, including:
 *       - Minimum length of 8 characters
 *       - At least one uppercase letter
 *       - At least one lowercase letter
 *       - At least one digit
 *       - At least one special character
 * @param {string} password - The password to be evaluated.
 * @returns {boolean} - True if the password meets the strong password criteria, otherwise false.
 */
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const digitRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/;

  if (password.length < minLength) {
    return false;
  }

  if (!uppercaseRegex.test(password)) {
    return false;
  }

  if (!lowercaseRegex.test(password)) {
    return false;
  }

  if (!digitRegex.test(password)) {
    return false;
  }

  if (!specialCharRegex.test(password)) {
    return false;
  }

  return true;
};
