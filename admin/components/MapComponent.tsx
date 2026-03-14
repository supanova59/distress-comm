"use client";

// import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
const icon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

const criticalIcon = L.icon({
	...icon.options,
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
});

const highIcon = L.icon({
	...icon.options,
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
});

const mediumIcon = L.icon({
	...icon.options,
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
});

export default function MapComponent({ calls }: { calls: any[] }) {
	const activeCalls = calls.filter((c) => c.status === "active");
	const center =
		activeCalls.length > 0
			? [activeCalls[0].location.lat, activeCalls[0].location.lng]
			: [12.9629, 77.5775]; // Default Bengaluru

	return (
		<div className="w-full h-full">
			<MapContainer
				center={center as [number, number]}
				zoom={12}
				style={{ height: "100%", width: "100%", background: "#09090b" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
					url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				/>
				{activeCalls.map((call) => {
					let markerIcon = icon;
					if (call.severity === "critical") markerIcon = criticalIcon;
					else if (call.severity === "high") markerIcon = highIcon;
					else if (call.severity === "medium") markerIcon = mediumIcon;

					return (
						<Marker
							key={call.id}
							position={[call.location.lat, call.location.lng]}
							icon={markerIcon}
						>
							<Popup className="custom-popup">
								<div className="p-1">
									<div className="font-bold text-zinc-100">{call.node}</div>
									<div className="text-sm text-zinc-400 mb-1">
										{call.message}
									</div>
									<div
										className={`text-xs font-bold uppercase ${
											call.severity === "critical"
												? "text-red-500"
												: call.severity === "high"
													? "text-orange-500"
													: "text-yellow-500"
										}`}
									>
										{call.severity} SEVERITY
									</div>
								</div>
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</div>
	);
}
