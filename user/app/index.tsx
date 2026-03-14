import { getPayloadByteLength } from "../lib/payload";
import type { DistressCall } from "../lib/types";
import { DISASTER_TYPES, SEVERITIES } from "../lib/types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import {
  isBluetoothReady,
  scanForRescueDevice,
  connectAndWrite,
} from "../lib/ble";
import type { Device } from "react-native-ble-plx";

const INITIAL_CALL: Omit<DistressCall, "createdAt" | "updatedAt"> = {
  disaster_type: "earthquake",
  severity: "medium",
  location: [0, 0],
  is_active: true,
};

export default function RaiseCallScreen() {
  const [call, setCall] = useState(INITIAL_CALL);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [sending, setSending] = useState(false);
  const [bleReady, setBleReady] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);

  const refreshLocation = useCallback(async () => {
    setLocationStatus("loading");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationStatus("error");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCall((prev) => ({
        ...prev,
        location: [loc.coords.latitude, loc.coords.longitude],
      }));
      setLocationStatus("ok");
    } catch {
      setLocationStatus("error");
    }
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  useEffect(() => {
    let mounted = true;
    isBluetoothReady().then((ok) => mounted && setBleReady(ok));
    return () => {
      mounted = false;
    };
  }, []);

  const byteLength = (() => {
    try {
      const full: DistressCall = { ...call, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return getPayloadByteLength(full);
    } catch {
      return 0;
    }
  })();

  const update = <K extends keyof typeof call>(key: K, value: typeof call[K]) => {
    setCall((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (locationStatus !== "ok") {
      Alert.alert("Location required", "Please allow location and try again.");
      return;
    }
    const full: DistressCall = {
      ...call,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (byteLength > 512) {
      Alert.alert("Payload too large", `Payload is ${byteLength} bytes (max 512).`);
      return;
    }

    if (!bleReady) {
      Alert.alert("Bluetooth off", "Turn on Bluetooth to send to a nearby device.");
      return;
    }

    setScanning(true);
    setDevices([]);
    const found: Device[] = [];
    try {
      await scanForRescueDevice((device) => {
        if (!found.some((d) => d.id === device.id)) {
          found.push(device);
          setDevices((prev) =>
            prev.some((d) => d.id === device.id) ? prev : [...prev, device]
          );
        }
      }, 8000);
    } finally {
      setScanning(false);
    }

    if (found.length === 0) {
      Alert.alert(
        "No device found",
        "No nearby rescue device is advertising. Make sure the other device is in range and running the receiver."
      );
      return;
    }

    const deviceToUse = found[0];
    setSending(true);
    try {
      await connectAndWrite(deviceToUse.id, full);
      Alert.alert("Sent", "Distress call was sent via Bluetooth.");
    } catch (e) {
      Alert.alert(
        "Send failed",
        e instanceof Error ? e.message : "Could not send to device."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.label}>Disaster type</Text>
        <View style={styles.chips}>
          {DISASTER_TYPES.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.chip,
                call.disaster_type === value && styles.chipActive,
              ]}
              onPress={() => update("disaster_type", value)}
            >
              <Text
                style={[
                  styles.chipText,
                  call.disaster_type === value && styles.chipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Severity</Text>
        <View style={styles.chips}>
          {SEVERITIES.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.chip,
                call.severity === value && styles.chipActive,
              ]}
              onPress={() => update("severity", value)}
            >
              <Text
                style={[
                  styles.chipText,
                  call.severity === value && styles.chipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.row}>
          <Text style={styles.coords}>
            {locationStatus === "loading"
              ? "Getting location…"
              : locationStatus === "error"
                ? "Location denied or unavailable"
                : `${call.location[0].toFixed(5)}, ${call.location[1].toFixed(5)}`}
          </Text>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={refreshLocation}
            disabled={locationStatus === "loading"}
          >
            <Text style={styles.refreshBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.toggle, call.is_active && styles.toggleActive]}
          onPress={() => update("is_active", !call.is_active)}
        >
          <Text
            style={[styles.toggleText, call.is_active && styles.toggleTextActive]}
          >
            Call is active
          </Text>
          <View style={[styles.toggleDot, call.is_active && styles.toggleDotActive]} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.bytes}>Payload: {byteLength} / 512 bytes</Text>
        {scanning && (
          <View style={styles.scanRow}>
            <ActivityIndicator color="#38bdf8" size="small" />
            <Text style={styles.scanText}>Scanning for nearby device…</Text>
          </View>
        )}
        {bleReady === false && (
          <Text style={styles.warn}>Bluetooth is off</Text>
        )}
        <TouchableOpacity
          style={[
            styles.submit,
            (sending || locationStatus !== "ok" || scanning) && styles.submitDisabled,
          ]}
          onPress={submit}
          disabled={sending || locationStatus !== "ok" || scanning}
        >
          {sending ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.submitText}>Raise call & send via Bluetooth</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 24 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  chipActive: { backgroundColor: "#0ea5e9", borderColor: "#0ea5e9" },
  chipText: { color: "#94a3b8", fontSize: 14, fontWeight: "500" },
  chipTextActive: { color: "#0f172a" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  coords: { flex: 1, color: "#e2e8f0", fontSize: 14 },
  refreshBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#1e293b",
    borderRadius: 8,
  },
  refreshBtnText: { color: "#38bdf8", fontSize: 13, fontWeight: "600" },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  toggleActive: { borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.12)" },
  toggleText: { color: "#94a3b8", fontSize: 15 },
  toggleTextActive: { color: "#22c55e" },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#475569",
  },
  toggleDotActive: { backgroundColor: "#22c55e" },
  footer: { marginTop: 8 },
  bytes: { color: "#64748b", fontSize: 12, marginBottom: 8 },
  scanRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  scanText: { color: "#38bdf8", fontSize: 13 },
  warn: { color: "#f59e0b", fontSize: 13, marginBottom: 8 },
  submit: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitDisabled: { backgroundColor: "#475569", opacity: 0.8 },
  submitText: { color: "#0f172a", fontSize: 16, fontWeight: "700" },
});
