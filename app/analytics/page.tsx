'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { CheckCircle2, RadioReceiver, Timer, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#3b82f6'
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800 flex items-center px-6 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-semibold">System Analytics</h1>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium text-sm">Disasters Solved</h3>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <div className="text-4xl font-light font-mono">
                {loading ? '-' : data?.disastersSolved}
              </div>
              <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                +12% from last week
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium text-sm">Nodes Connected</h3>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <RadioReceiver className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="text-4xl font-light font-mono">
                {loading ? '-' : data?.nodesConnected}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Active mesh network devices
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium text-sm">Avg Response Time</h3>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <div className="text-4xl font-light font-mono">
                {loading ? '-' : data?.averageResponseTime}
              </div>
              <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                -1.2 mins from last week
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-zinc-100 font-medium mb-6">Distress Calls Over Time (24h)</h3>
              <div className="h-[300px] w-full">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-sm">LOADING DATA...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.callsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#f4f4f5' }}
                      />
                      <Area type="monotone" dataKey="calls" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-zinc-100 font-medium mb-6">Calls by Severity</h3>
              <div className="h-[300px] w-full">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-sm">LOADING DATA...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.severityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        cursor={{ fill: '#27272a', opacity: 0.4 }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data?.severityDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
