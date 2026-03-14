/**
 * Uint8Array <-> base64 for BLE (react-native-ble-plx expects base64).
 */

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let out = "";
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const a = bytes[i];
    const b = i + 1 < len ? bytes[i + 1] : 0;
    const c = i + 2 < len ? bytes[i + 2] : 0;
    out += CHARS[a >> 2];
    out += CHARS[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < len ? CHARS[((b & 15) << 2) | (c >> 6)] : "=";
    out += i + 2 < len ? CHARS[c & 63] : "=";
  }
  return out;
}
