/**
 * Compact encoding for BLE payload. Must fit in 512 bytes.
 * Short keys and codes keep JSON small; typical payload ~80–120 bytes.
 */

import type { DistressCall, DisasterType, Severity } from "./types";

const MAX_BYTES = 512;

// Short codes for Bluetooth (saves bytes)
const D_CODES: Record<DisasterType, string> = {
  earthquake: "eq",
  flood: "fl",
  fire: "fr",
  storm: "st",
  landslide: "ls",
  tsunami: "ts",
  other: "ot",
};

const S_CODES: Record<Severity, string> = {
  low: "l",
  medium: "m",
  high: "h",
  critical: "c",
};

const D_DECODE: Record<string, DisasterType> = Object.fromEntries(
  (Object.entries(D_CODES) as [DisasterType, string][]).map(([k, v]) => [v, k])
);

const S_DECODE: Record<string, Severity> = Object.fromEntries(
  (Object.entries(S_CODES) as [Severity, string][]).map(([k, v]) => [v, k])
);

export interface CompactPayload {
  d: string; // disaster_type code
  s: string; // severity code
  l: [number, number]; // location [lat, lng]
  a: number; // is_active 1|0
  t: number; // createdAt Unix ms
}

export function encodeForBluetooth(call: DistressCall): Uint8Array {
  const t = call.createdAt
    ? new Date(call.createdAt).getTime()
    : Date.now();
  const payload: CompactPayload = {
    d: D_CODES[call.disaster_type],
    s: call.severity ? S_CODES[call.severity] : "m",
    l: call.location,
    a: call.is_active ? 1 : 0,
    t,
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  if (bytes.length > MAX_BYTES) {
    throw new Error(`Payload too large: ${bytes.length} bytes (max ${MAX_BYTES})`);
  }
  return bytes;
}

export function decodeFromBluetooth(bytes: Uint8Array): DistressCall {
  const json = new TextDecoder().decode(bytes);
  const raw = JSON.parse(json) as CompactPayload;
  const disaster_type = D_DECODE[raw.d] ?? "other";
  const severity = S_DECODE[raw.s] ?? "medium";
  return {
    disaster_type,
    severity,
    location: raw.l,
    is_active: raw.a === 1,
    createdAt: new Date(raw.t).toISOString(),
    updatedAt: new Date(raw.t).toISOString(),
  };
}

export function getPayloadByteLength(call: DistressCall): number {
  return encodeForBluetooth(call).length;
}
