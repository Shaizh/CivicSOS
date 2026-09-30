import React, { useState } from 'react';
import { 
  Users2, 
  Award, 
  ShieldCheck, 
  Bell, 
  Star,
  Plus,
  Send,
  X
} from 'lucide-react';
import { INITIAL_VOLUNTEERS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityScreenProps {
  stats: {
    activeRequests: number;
    nearbyVolunteers: number;
    completedToday: number;
  };
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({ stats }) => {
  const [bulletins, setBulletins] = useState([
    {
      id: 'b-1',
      title: 'Emergency Aid Station Open',
      tag: 'Community Notice',
      time: 'Today',
      description: 'Clean drinking water and primary first aid kits available at community hall. Certified volunteers on site.',
    },
    {
      id: 'b-2',
      title: 'Pedestrian Crossing Safety Caution',
      tag: 'Local Advisory',
      time: 'Active',
      description: 'Street lighting maintenance along main avenue junction. Responders carrying high-visibility flashlights.',
    },
  ]);

  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handlePostNotice = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;

    setBulletins([
      {
        id: `b-${Date.now()}`,
        title: newTitle.trim(),
        tag: 'Citizen Alert',
        time: 'Just now',
        description: newDesc.trim(),
      },
      ...bulletins,
    ]);

    setNewTitle('');
    setNewDesc('');
    setIsAddingNotice(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 pb-24 pt-1"
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users2 className="w-5 h-5 text-blue-600" />
          Community Network
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Local neighborhood volunteers and real-time mutual aid safety alerts
        </p>
      </div>

      {/* Real Live Community Activity Milestone Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 p-4 text-white shadow-md border border-blue-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300">
            Network Status
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Operational
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-white">
            {stats.nearbyVolunteers}
          </span>
          <span className="text-xs text-blue-200">Active Verified Responders</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-800/80 text-center">
          <div>
            <span className="text-lg font-extrabold font-mono text-emerald-400">
              {stats.completedToday}
            </span>
            <p className="text-[10px] text-blue-200">Completed Today</p>
          </div>
          <div>
            <span className="text-lg font-extrabold font-mono text-amber-400">
              {stats.activeRequests}
            </span>
            <p className="text-[10px] text-blue-200">Current Open Alerts</p>
          </div>
        </div>
      </div>

      {/* Top Volunteer Responders */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Active Responders
          </h3>
          <span className="text-[11px] text-blue-600 font-semibold">Verified Citizens</span>
        </div>

        <div className="space-y-2">
          {INITIAL_VOLUNTEERS.map((vol, idx) => (
            <motion.div
              key={vol.id}
              whileHover={{ scale: 1.01 }}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 text-center font-bold text-xs font-mono text-slate-400">
                  #{idx + 1}
                </span>
                <div className="relative">
                  <img
                    src={vol.avatar}
                    alt={vol.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  {idx === 0 && (
                    <span className="absolute -top-1 -right-1 text-xs">👑</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{vol.name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {vol.badge}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end text-amber-500 text-xs font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{vol.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {vol.completedCount} Missions
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neighborhood Safety Bulletins with Add Notice Action */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-blue-600" />
            Safety Bulletins
          </h3>
          <button
            onClick={() => setIsAddingNotice(!isAddingNotice)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {isAddingNotice ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Post Notice</span>
              </>
            )}
          </button>
        </div>

        {/* Post notice modal/accordion */}
        <AnimatePresence>
          {isAddingNotice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3.5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-2 overflow-hidden"
            >
              <h4 className="text-xs font-bold text-slate-800">New Community Safety Advisory</h4>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Notice title (e.g., Road hazard on 4th cross)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                placeholder="Details of the hazard or advisory..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePostNotice}
                  disabled={!newTitle.trim() || !newDesc.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Publish Alert</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {bulletins.map((b) => (
            <motion.div
              key={b.id}
              layout
              className="p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{b.title}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                    {b.tag}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{b.time}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
