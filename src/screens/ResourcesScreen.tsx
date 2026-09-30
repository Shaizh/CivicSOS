import React, { useState } from 'react';
import { 
  PhoneCall, 
  BookOpen, 
  ShieldAlert, 
  Search, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EMERGENCY_SERVICES, FIRST_AID_GUIDES } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface ResourcesScreenProps {
  onOpenCall: (name: string, subtitle: string, number: string) => void;
}

export const ResourcesScreen: React.FC<ResourcesScreenProps> = ({ onOpenCall }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuide, setExpandedGuide] = useState<number | null>(0);

  const filteredServices = EMERGENCY_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.includes(searchQuery) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <PhoneCall className="w-5 h-5 text-red-600" />
          Emergency Directory &amp; First Aid
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Official emergency hotlines and verified clinical protocols
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search emergency services, hospitals, helplines..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Emergency Hotlines Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verified Hotlines (1-Tap Dial)
          </h3>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            24/7 Available
          </span>
        </div>

        <div className="space-y-2">
          {filteredServices.map((srv) => (
            <motion.div
              key={srv.id}
              whileHover={{ scale: 1.01 }}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{srv.name}</h4>
                  <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                    {srv.number}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {srv.description}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {srv.available}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onOpenCall(srv.name, srv.description, srv.number)}
                className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/30 transition-all"
                title={`Call ${srv.name}`}
                aria-label={`Call ${srv.name}`}
              >
                <PhoneCall className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* First Aid & Protocol Cards */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Verified Emergency Protocols
        </h3>

        <div className="space-y-2">
          {FIRST_AID_GUIDES.map((guide, idx) => {
            const isExpanded = expandedGuide === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedGuide(isExpanded ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{guide.title}</h4>
                    <span className="text-[10px] font-semibold text-blue-600 mt-0.5 block">
                      {guide.action}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed space-y-2 overflow-hidden"
                    >
                      <p>{guide.summary}</p>
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Always notify emergency services (112 / 108 / 911) during severe incidents.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
