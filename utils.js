export function isNumeric(char) {
  return /[0-9]/.test(char);
}

export function isAlpha(char) {
  return /[A-Za-z_]/.test(char);
}

export function isAlphaNum(char) {
  return /[A-Za-z0-9_]/.test(char);
}
