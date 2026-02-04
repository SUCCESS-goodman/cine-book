// Validation patterns for Register / Login forms

export const EMAIL_PATTERN = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Please enter a valid email address",
};

// Password: at least one letter, one number, 8+ characters
export const PASSWORD_PATTERN = {
  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  message: "Password must contain at least one letter and one number (min 8 characters)",
};

// Stronger password: lowercase, uppercase, digit, special char (@$!%?&)
export const PASSWORD_STRONG_PATTERN = {
  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  message: "Password must contain at least one lowercase, one uppercase, one number and one special character (@$!%*?&)",
};

export function validateEmail(email) {
  if (!email?.trim()) return "Email is required";
  if (!EMAIL_PATTERN.value.test(email.trim())) return EMAIL_PATTERN.message;
  return null;
}

export function validatePassword(password, useStrong = false) {
  if (!password) return "Password is required";
  const pattern = useStrong ? PASSWORD_STRONG_PATTERN : PASSWORD_PATTERN;
  if (!pattern.value.test(password)) return pattern.message;
  return null;
}
