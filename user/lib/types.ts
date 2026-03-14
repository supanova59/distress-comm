/**
 * Distress call schema (matches backend).
 * Used for form state and local storage; Bluetooth uses compact encoding.
 */
export type DisasterType =
  | "earthquake"
  | "flood"
  | "fire"
  | "storm"
  | "landslide"
  | "tsunami"
  | "other";

export type Severity = "low" | "medium" | "high" | "critical";

export interface DistressCall {
  disaster_type: DisasterType;
  severity?: Severity;
  location: [number, number]; // [lat, lng]
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const DISASTER_TYPES: { value: DisasterType; label: string }[] = [
  { value: "earthquake", label: "Earthquake" },
  { value: "flood", label: "Flood" },
  { value: "fire", label: "Fire" },
  { value: "storm", label: "Storm" },
  { value: "landslide", label: "Landslide" },
  { value: "tsunami", label: "Tsunami" },
  { value: "other", label: "Other" },
];

export const SEVERITIES: { value: Severity; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];
