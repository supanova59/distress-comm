/**
 * BLE client: scan for nearby rescue device, connect, write distress payload (≤512 bytes).
 * Rescue device should advertise SERVICE_UUID and expose WRITE_CHAR_UUID.
 */

import { BleManager, Device, State } from "react-native-ble-plx";
import { uint8ArrayToBase64 } from "./base64";
import { encodeForBluetooth } from "./payload";
import type { DistressCall } from "./types";

// Custom UUIDs for distress-comm (must match receiver/admin relay)
const SERVICE_UUID = "a1b2c3d4-e5f6-4a1b-82c3-d4e5f6a1b2c3";
const WRITE_CHAR_UUID = "b2c3d4e5-f6a1-4b2c-83d4-e5f6a1b2c3d4";

let manager: BleManager | null = null;

function getManager(): BleManager {
  if (!manager) manager = new BleManager();
  return manager;
}

export async function isBluetoothReady(): Promise<boolean> {
  const m = getManager();
  const state = await m.state();
  return state === State.PoweredOn;
}

export async function scanForRescueDevice(
  onDeviceFound: (device: Device) => void,
  timeoutMs: number = 10000
): Promise<void> {
  const m = getManager();
  await m.startDeviceScan(
    [SERVICE_UUID],
    { allowDuplicates: false },
    (err, device) => {
      if (err) return;
      if (device) onDeviceFound(device);
    }
  );
  await new Promise((r) => setTimeout(r, timeoutMs));
  m.stopDeviceScan();
}

export async function connectAndWrite(
  deviceId: string,
  call: DistressCall
): Promise<void> {
  const m = getManager();
  const payload = encodeForBluetooth(call);
  const base64 = uint8ArrayToBase64(payload);
  const device = await m.connectToDevice(deviceId);
  try {
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      WRITE_CHAR_UUID,
      base64
    );
  } finally {
    await device.cancelConnection();
  }
}

export function destroyManager(): void {
  if (manager) {
    manager.destroy();
    manager = null;
  }
}

export { SERVICE_UUID, WRITE_CHAR_UUID };
