import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  UploadCloud,
  LayoutDashboard,
  Scale,
  Compass,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/upload', label: 'Studio', icon: UploadCloud },
  { to: '/resume', label: 'Resume AI', icon: Compass },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/compare', label: 'Compare', icon: Scale },
];

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-auto">
      {/* Ambient gradient line at top */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/30 via-cyan-500/30 to-transparent" />

      {/* Floating Bottom Bar with Glassmorphism */}
      <nav
        aria-label="Mobile Navigation"
        className="bg-[#0A0E1A]/90 backdrop-blur-2xl border-t border-[#262F4C]/80 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl"
      >
        <div className="grid grid-cols-5 items-center max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 relative group select-none ${
                    isActive
                      ? 'text-amber-400 font-bold'
                      : 'text-[#8D96B3] hover:text-white font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Glowing Indicator Pill */}
                    {isActive && (
                      <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 shadow-[0_0_8px_rgba(255,176,32,0.8)]" />
                    )}

                    <div
                      className={`p-1.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 scale-110 shadow-sm shadow-amber-500/20'
                          : 'group-hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] tracking-tight leading-none mt-0.5 whitespace-nowrap">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
