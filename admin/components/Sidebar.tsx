'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Map, BarChart2, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Active Calls', icon: Map },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 h-screen flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
        <Activity className="w-6 h-6 text-red-500" />
        <span className="font-bold text-lg text-zinc-100 tracking-tight">NEXUS<span className="text-red-500">RESPONSE</span></span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-red-500/10 text-red-500' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
}
