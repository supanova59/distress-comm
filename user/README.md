# Distress Comm — Mobile (User)

Offline-first mobile app for raising distress calls. Users can submit a call (disaster type, severity, location, active flag) and send it via **Bluetooth Low Energy** to a nearby rescue device. Payload is compact and fits within **512 bytes** for BLE MTU constraints.

## Schema (matches backend)

- `disaster_type` (required): earthquake | flood | fire | storm | landslide | tsunami | other
- `severity`: low | medium | high | critical
- `location` (required): [lat, lng]
- `is_active`: boolean (default true)
- Timestamps added on create/update

## Bluetooth

- **Role**: Central. The app scans for a nearby device that advertises the distress-comm service, connects, and writes the payload to a characteristic.
- **Payload**: JSON with short keys (`d`, `s`, `l`, `a`, `t`) encoded as UTF-8, then sent as base64 to stay under 512 bytes.
- **UUIDs** (must match the receiver / admin relay):
  - Service: `a1b2c3d4-e5f6-4a1b-82c3-d4e5f6a1b2c3`
  - Write characteristic: `b2c3d4e5-f6a1-4b2c-83d4-e5f6a1b2c3d4`

## Run

```bash
pnpm install
npx expo start
```

**Note**: BLE does not work in Expo Go. For Bluetooth you need a **development build**:

```bash
npx expo prebuild
npx expo run:android   # or run:ios
```

Use a physical device; Bluetooth is not available in simulators/emulators.

## Permissions

- **Location**: Required to attach coordinates to the distress call.
- **Bluetooth**: Required to scan and connect to nearby rescue devices.

These are requested at runtime when you open the app or tap “Raise call”.
