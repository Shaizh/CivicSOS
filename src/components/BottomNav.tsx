import React from 'react';
import { Home, AlertTriangle, HeartHandshake, PhoneCall, Users2 } from 'lucide-react';
import { motion } from 'motion/react';

export type NavTab = 'home' | 'request' | 'volunteers' | 'resources' | 'community';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeRequestsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeRequestsCount,
}) => {
  const tabs: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    isPrimarySos?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'request', label: 'Request', icon: AlertTriangle, isPrimarySos: true },
    { id: 'volunteers', label: 'Volunteers', icon: HeartHandshake, badge: activeRequestsCount },
    { id: 'resources', label: 'Resources', icon: PhoneCall },
    { id: 'community', label: 'Community', icon: Users2 },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isPrimarySos) {
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onSelectTab(tab.id)}
                className="relative flex flex-col items-center justify-center -top-3 group focus:outline-none"
                aria-label="Request SOS Emergency Help"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isActive
                      ? 'bg-red-600 text-white shadow-red-500/50 ring-4 ring-red-100'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/40'
                  }`}
                >
                  <Icon className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-tight mt-1 ${
                    isActive ? 'text-red-600' : 'text-slate-600 group-hover:text-red-600'
                  }`}
                >
                  SOS
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors focus:outline-none ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-blue-600 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 px-1.5 min-w-[16px] h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {tab.badge}
                  </motion.span>
                ) : null}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 truncate ${
                  isActive ? 'font-bold text-blue-600' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
