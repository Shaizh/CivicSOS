import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Layers, Shield } from 'lucide-react';
import { Volunteer } from '../types';
import { motion } from 'motion/react';

interface MockMapProps {
  volunteer?: Volunteer;
  userLocationName: string;
  status: string;
  compact?: boolean;
}

export const MockMap: React.FC<MockMapProps> = ({
  volunteer,
  userLocationName,
  status,
  compact = false,
}) => {
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
  const [progress, setProgress] = useState(0.28);

  // Smooth continuous progression for the volunteer beacon towards destination
  useEffect(() => {
    if (status === 'completed') {
      setProgress(0.98);
      return;
    }
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 0.94 ? prev + 0.02 : 0.94));
    }, 1200);
    return () => clearInterval(interval);
  }, [status]);

  // Cubic Bezier curve control points
  const p0 = { x: 75, y: 55 };
  const p1 = { x: 170, y: 70 };
  const p2 = { x: 220, y: 140 };
  const p3 = { x: 305, y: 175 };

  const t = progress;
  const vx =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;
  const vy =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  // Tangent angle for direction heading
  const dt = 0.01;
  const tNext = Math.min(1, t + dt);
  const nvx =
    Math.pow(1 - tNext, 3) * p0.x +
    3 * Math.pow(1 - tNext, 2) * tNext * p1.x +
    3 * (1 - tNext) * Math.pow(tNext, 2) * p2.x +
    Math.pow(tNext, 3) * p3.x;
  const nvy =
    Math.pow(1 - tNext, 3) * p0.y +
    3 * Math.pow(1 - tNext, 2) * tNext * p1.y +
    3 * (1 - tNext) * Math.pow(tNext, 2) * p2.y +
    Math.pow(tNext, 3) * p3.y;
  const headingAngle = (Math.atan2(nvy - vy, nvx - vx) * 180) / Math.PI;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md ${
        compact ? 'h-48' : 'h-64 sm:h-72'
      } ${
        mapStyle === 'satellite'
          ? 'bg-slate-950 text-white'
          : 'bg-[#EBF2FA] text-slate-800'
      }`}
    >
      {/* Background Vector Map Grid */}
      {mapStyle === 'street' ? (
        <svg
          className="absolute inset-0 w-full h-full opacity-65"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 380 240"
        >
          <defs>
            <pattern id="roadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D3E2F2" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roadGrid)" />

          {/* Park area */}
          <path d="M 15 115 Q 55 95 85 135 T 25 210 Z" fill="#DCFCE7" opacity="0.9" />

          {/* Water body */}
          <path
            d="M 335 0 Q 350 90 325 180 T 365 240"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="16"
          />

          {/* Primary Roads */}
          <path d="M 0 60 L 380 60" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <path d="M 0 60 L 380 60" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />

          <path d="M 180 0 L 180 240" stroke="#FFFFFF" strokeWidth="14" />
          <path d="M 180 0 L 180 240" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />

          <path d="M 25 180 L 380 180" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M 270 30 L 340 240" stroke="#FFFFFF" strokeWidth="8" />

          {/* Road labels */}
          <text x="14" y="52" fill="#64748B" fontSize="9" fontWeight="700" letterSpacing="0.5">
            CENTRAL CORRIDOR
          </text>
          <text x="188" y="24" fill="#64748B" fontSize="9" fontWeight="700" letterSpacing="0.5">
            CIVIC ACCESS WAY
          </text>
          <text x="190" y="174" fill="#64748B" fontSize="8" fontWeight="600">
            SOUTH CONNECTOR
          </text>
        </svg>
      ) : (
        <div className="absolute inset-0 bg-slate-950">
          <svg className="w-full h-full opacity-40" viewBox="0 0 380 240" preserveAspectRatio="none">
            <line x1="0" y1="60" x2="380" y2="60" stroke="#F59E0B" strokeWidth="4" />
            <line x1="180" y1="0" x2="180" y2="240" stroke="#3B82F6" strokeWidth="5" />
            <line x1="75" y1="55" x2="305" y2="175" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" />
          </svg>
        </div>
      )}

      {/* SVG Trajectory Path with Animated Pulse */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 240">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>

        {/* Ambient road glow */}
        <path
          d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`}
          fill="none"
          stroke="#93C5FD"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Animated Dashed Route Line */}
        <path
          d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeDasharray="6,5"
          strokeLinecap="round"
        />
      </svg>

      {/* SOS Requester Target Pin with Animated Radar Waves */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none"
        style={{ left: `${(p3.x / 380) * 100}%`, top: `${(p3.y / 240) * 100}%` }}
      >
        <div className="relative flex flex-col items-center">
          {/* Animated Multi-Ring Radar Wave */}
          <motion.div
            className="absolute bottom-2 w-10 h-10 rounded-full bg-red-600/30"
            animate={{ scale: [1, 2.4], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute bottom-2 w-6 h-6 rounded-full bg-red-600/40"
            animate={{ scale: [1, 1.8], opacity: [0.9, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />

          {/* Floating Badge */}
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-2 py-0.5 mb-1 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-md whitespace-nowrap flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            SOS Location
          </motion.div>

          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 ring-3 ring-white">
            <MapPin className="w-5 h-5 fill-white text-red-600" />
          </div>
        </div>
      </div>

      {/* Moving Volunteer Beacon with Smooth Spring Motion */}
      {volunteer && (
        <motion.div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          animate={{
            left: `${(vx / 380) * 100}%`,
            top: `${(vy / 240) * 100}%`,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 60 }}
        >
          <div className="relative flex flex-col items-center">
            {/* Volunteer Tag */}
            <div className="px-2 py-0.5 mb-1 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 ring-1 ring-white">
              <Navigation
                className="w-3 h-3 transition-transform duration-300"
                style={{ transform: `rotate(${headingAngle}deg)` }}
              />
              <span>{volunteer.name.split(' ')[0]} (En Route)</span>
            </div>

            <div className="relative">
              <motion.span
                className="absolute inset-0 rounded-full bg-blue-500/50"
                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 ring-2 ring-white">
                <Shield className="w-4 h-4 fill-white text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Map Controls */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
        <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold shadow-sm border border-slate-200/80 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Real-time GPS Tracking</span>
        </span>
      </div>

      <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
        <button
          onClick={() => setMapStyle(mapStyle === 'street' ? 'satellite' : 'street')}
          className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 transition-colors"
          title="Toggle Satellite view"
          aria-label="Toggle Satellite View"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Bottom Status Pill */}
      <div className="absolute bottom-2 left-2 right-2 z-20">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-between gap-2 text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {userLocationName || 'Detected Location'}
            </span>
          </div>
          {volunteer && (
            <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0 border border-blue-200/60">
              {volunteer.distanceKm} km · {volunteer.etaMinutes} min ETA
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
};
