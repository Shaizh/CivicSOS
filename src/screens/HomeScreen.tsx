import React from 'react';
import { 
  ShieldAlert, 
  HeartHandshake, 
  Activity, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ArrowRight, 
  Lock, 
  Zap, 
  Compass, 
  AlertCircle 
} from 'lucide-react';
import { HelpRequest, UserProfile } from '../types';
import { motion } from 'motion/react';

interface HomeScreenProps {
  stats: {
    activeRequests: number;
    nearbyVolunteers: number;
    completedToday: number;
  };
  onRequestHelp: () => void;
  onBecomeVolunteer: () => void;
  onSelectRequest: (request: HelpRequest) => void;
  activeRequests: HelpRequest[];
  onOpenCall: (name: string, subtitle: string, number: string) => void;
  detectedCity?: string;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onRequestHelp,
  onBecomeVolunteer,
  onSelectRequest,
  activeRequests,
  onOpenCall,
  detectedCity,
  currentUser,
  onOpenLogin,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 pb-20 pt-2"
    >
      {/* Current User Status Banner */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {currentUser ? (
            <>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
              />
              <div className="truncate">
                <span className="font-bold text-slate-800 block truncate">
                  Hello, {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 block truncate font-medium">
                  {currentUser.role === 'volunteer'
                    ? `${currentUser.volunteerBadge || 'Active Volunteer'} · ${currentUser.isOnDuty ? 'On Duty' : 'Off Duty'}`
                    : `Resident · ${currentUser.bloodGroup ? `Blood ${currentUser.bloodGroup}` : 'Protected'}`}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                C
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Civic Resident Guest</span>
                <span className="text-[10px] text-slate-500 block">Fast emergency dispatch mode</span>
              </div>
            </>
          )}
        </div>

        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 shrink-0 ml-2 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-colors"
          >
            {currentUser ? 'Switch' : 'Sign In'}
          </button>
        )}
      </div>

      {/* Hero Banner / Tagline Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-5 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Community Rapid Response</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
            CivicSOS
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            &ldquo;Get help. Give help. Build a safer community.&rdquo;
          </p>

          {/* Dual Primary CTAs with tactile motion feedback */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRequestHelp}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/40 flex items-center justify-center gap-2.5 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">Request Help</span>
              <ArrowRight className="w-4 h-4 text-red-100 group-hover:translate-x-1 transition-transform ml-auto" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onBecomeVolunteer}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">Become a Volunteer</span>
              <ArrowRight className="w-4 h-4 text-blue-100 group-hover:translate-x-1 transition-transform ml-auto" />
            </motion.button>
          </div>
        </div>

        {/* Ambient background decorative glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Live Community Status Bar (Animated Count-up Statistics) */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Live Community Status
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {detectedCity || 'Active Network'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
          <motion.div
            key={stats.activeRequests}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="px-1"
          >
            <div className="flex items-center justify-center gap-1 text-red-600 mb-0.5">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-xl font-extrabold font-mono tabular-nums">{stats.activeRequests}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Active Requests</p>
          </motion.div>

          <div className="px-1">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-0.5">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xl font-extrabold font-mono tabular-nums">{stats.nearbyVolunteers}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Nearby Volunteers</p>
          </div>

          <motion.div
            key={stats.completedToday}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="px-1"
          >
            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xl font-extrabold font-mono tabular-nums">{stats.completedToday}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Completed Today</p>
          </motion.div>
        </div>
      </div>

      {/* Value Proposition Card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 p-4 border border-blue-100/80 shadow-sm space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-snug">
              Neighborhood Mutual Aid Network
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              When seconds count before emergency services arrive, verified local volunteers respond to road accidents, medical distress, missing persons, and critical relief.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">Direct Peer-to-Peer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">~5 Min Response Window</span>
          </div>
        </div>
      </div>

      {/* Quick Direct 1-Tap Emergency Dials */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            1-Tap Emergency Hotlines
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">Toll-free 24/7</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenCall('Emergency Ambulance', 'Medical Trauma & Paramedic Dispatch', '108')}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition-all"
          >
            <span className="text-[10px] font-bold text-red-600 block">Ambulance</span>
            <span className="text-base font-extrabold text-red-700 font-mono">108</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenCall('Police Control', 'Emergency Police Dispatch', '100')}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all"
          >
            <span className="text-[10px] font-bold text-blue-600 block">Police</span>
            <span className="text-base font-extrabold text-blue-700 font-mono">100</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenCall('Fire & Disaster', 'Fire Brigade & Disaster Rescue', '101')}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all"
          >
            <span className="text-[10px] font-bold text-amber-600 block">Fire Rescue</span>
            <span className="text-base font-extrabold text-amber-700 font-mono">101</span>
          </motion.button>
        </div>
      </div>

      {/* Live Local Requests Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
            Nearby Urgent Incidents
          </h3>
          <button
            onClick={onBecomeVolunteer}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({activeRequests.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {activeRequests.slice(0, 2).map((req) => (
            <motion.div
              key={req.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => onSelectRequest(req)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      req.urgency === 'high'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : req.urgency === 'medium'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {req.urgency} Urgency
                  </span>
                  <span className="text-xs font-semibold text-slate-700 capitalize">
                    {req.category.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{req.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                {req.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {req.location}
                </span>
                <span className="text-blue-600 font-semibold shrink-0">Tap to Help &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
