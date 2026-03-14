"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Radio, Clock, ShieldAlert } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500 font-mono text-sm">
			INITIALIZING MAP...
		</div>
	),
});

export default function DashboardPage() {
	const [calls, setCalls] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCalls = async () => {
			try {
				const res = await fetch("/api/calls");
				const data = await res.json();
				setCalls(data);
			} catch (error) {
				console.error("Failed to fetch calls:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCalls();
		const interval = setInterval(fetchCalls, 10000); // Poll every 10s
		return () => clearInterval(interval);
	}, []);

	const activeCalls = calls.filter((c) => c.status === "active");
	const criticalCount = activeCalls.filter(
		(c) => c.severity === "critical",
	).length;

	return (
		<div className="flex h-screen bg-zinc-950 overflow-hidden">
			<Sidebar />
			<main className="flex-1 flex flex-col min-w-0">
				<header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-sm z-10">
					<h1 className="text-xl font-semibold">Active Distress Calls</h1>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
							<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
							<span className="text-xs font-mono text-zinc-400">
								MESH NETWORK ONLINE
							</span>
						</div>
						{criticalCount > 0 && (
							<div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
								<AlertTriangle className="w-4 h-4" />
								<span className="text-xs font-bold">
									{criticalCount} CRITICAL
								</span>
							</div>
						)}
					</div>
				</header>

				<div className="flex-1 p-6 flex gap-6 overflow-hidden">
					{/* List Section */}
					<div className="w-1/3 flex flex-col bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
						<div className="p-4 border-b border-zinc-800 bg-zinc-900">
							<h2 className="font-medium flex items-center gap-2">
								<Radio className="w-4 h-4 text-zinc-400" />
								Incoming Signals
							</h2>
						</div>
						<div className="flex-1 overflow-y-auto p-4 space-y-3">
							{loading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"
									/>
								))
							) : activeCalls.length === 0 ? (
								<div className="h-full flex flex-col items-center justify-center text-zinc-500">
									<ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
									<p>No active distress calls</p>
								</div>
							) : (
								activeCalls.map((call) => (
									<div
										key={call.id}
										className="p-4 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors cursor-pointer group"
									>
										<div className="flex items-start justify-between mb-2">
											<div className="flex items-center gap-2">
												<span
													className={`w-2 h-2 rounded-full ${
														call.severity === "critical"
															? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
															: call.severity === "high"
																? "bg-orange-500"
																: "bg-yellow-500"
													}`}
												/>
												<span className="font-mono text-xs text-zinc-400">
													{call.node}
												</span>
											</div>
											<span className="text-xs text-zinc-500 flex items-center gap-1">
												<Clock className="w-3 h-3" />
												{formatDistanceToNow(new Date(call.timestamp), {
													addSuffix: true,
												})}
											</span>
										</div>
										<p className="text-sm font-medium text-zinc-200">
											{call.message}
										</p>
										<div className="mt-3 flex items-center justify-between">
											<span
												className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
													call.severity === "critical"
														? "bg-red-500/10 text-red-500"
														: call.severity === "high"
															? "bg-orange-500/10 text-orange-500"
															: "bg-yellow-500/10 text-yellow-500"
												}`}
											>
												{call.severity}
											</span>
											<button className="text-xs font-medium text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
												View Details &rarr;
											</button>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					{/* Map Section */}
					<div className="flex-1 relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
						<MapComponent calls={calls} />
					</div>
				</div>
			</main>
		</div>
	);
}
