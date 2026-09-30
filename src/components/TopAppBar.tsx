import React from 'react';
import { ShieldAlert, Radio, AlertCircle, User, LogIn } from 'lucide-react';
import { HelpRequest, UserProfile, UserRole } from '../types';
import { motion } from 'motion/react';

interface TopAppBarProps {
  activeRequest: HelpRequest | null;
  currentUser: UserProfile | null;
  activeRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
  onNavigateToTracking?: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  nearbyVolunteersCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeRequest,
  currentUser,
  activeRole,
  onRoleSwitch,
  onNavigateToTracking,
  onOpenProfile,
  onOpenLogin,
  nearbyVolunteersCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-3.5 py-2.5 select-none">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/30 ring-1 ring-red-400/40">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">CivicSOS</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-none mt-0.5 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-blue-400" />
              <span>{nearbyVolunteersCount} Responders</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Quick Role Switcher + Profile Avatar */}
        <div className="flex items-center gap-1.5">
          {activeRequest && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.94 }}
              onClick={onNavigateToTracking}
              aria-label="View active emergency request"
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-500/30 animate-pulse transition-all shrink-0"
            >
              <AlertCircle className="w-3 h-3" />
              <span>SOS Active</span>
            </motion.button>
          )}

          {/* 1-Tap Perspective Switcher */}
          <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => onRoleSwitch('resident')}
              className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
                activeRole === 'resident'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Resident View"
            >
              Resident
            </button>
            <button
              onClick={() => onRoleSwitch('volunteer')}
              className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
                activeRole === 'volunteer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Volunteer View"
            >
              Volunteer
            </button>
          </div>

          {/* Profile Button */}
          {currentUser ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onOpenProfile}
              className="relative p-0.5 rounded-full ring-2 ring-slate-700 hover:ring-blue-500 transition-all shrink-0"
              title={`${currentUser.name} (${currentUser.role})`}
              aria-label="Open profile settings"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-1 ring-slate-900 ${
                  currentUser.role === 'volunteer'
                    ? currentUser.isOnDuty
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                    : 'bg-blue-400'
                }`}
              />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onOpenLogin}
              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shrink-0"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
