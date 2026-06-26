/**
 * Genera un hash SHA-256 asíncrono para una contraseña en texto plano
 * utilizando la Web Crypto API nativa del navegador.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Helper para verificar si un string tiene el formato de un hash SHA-256 válido
 * (exactamente 64 caracteres hexadecimales).
 */
export function isSHA256(str: string): boolean {
  return /^[a-f0-9]{64}$/i.test(str);
}
