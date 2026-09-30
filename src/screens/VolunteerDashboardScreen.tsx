import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Navigation, 
  Phone, 
  MessageSquare, 
  EyeOff, 
  ShieldCheck, 
  Award, 
  Stethoscope,
  Car,
  Utensils,
  Bus,
  Search,
  LifeBuoy
} from 'lucide-react';
import { HelpCategory, HelpRequest, Volunteer, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface VolunteerDashboardScreenProps {
  requests: HelpRequest[];
  onAcceptRequest: (request: HelpRequest) => void;
  onTrackRequest: (request: HelpRequest) => void;
  currentVolunteer: Volunteer;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  onToggleDuty?: () => void;
}

type TabType = 'nearby' | 'accepted' | 'completed';

export const VolunteerDashboardScreen: React.FC<VolunteerDashboardScreenProps> = ({
  requests,
  onAcceptRequest,
  onTrackRequest,
  currentVolunteer,
  currentUser,
  onOpenLogin,
  onToggleDuty,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('nearby');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const nearbyRequests = requests.filter((r) => r.status === 'pending');
  const acceptedRequests = requests.filter(
    (r) => r.status === 'assigned' || r.status === 'en_route'
  );
  const completedRequests = requests.filter((r) => r.status === 'completed');

  const isVolunteerLoggedIn = currentUser?.role === 'volunteer';

  const getFilteredList = () => {
    let list: HelpRequest[] = [];
    if (activeTab === 'nearby') list = nearbyRequests;
    else if (activeTab === 'accepted') list = acceptedRequests;
    else list = completedRequests;

    if (urgencyFilter !== 'all') {
      list = list.filter((r) => r.urgency === urgencyFilter);
    }
    return list;
  };

  const getCategoryIcon = (category: HelpCategory) => {
    switch (category) {
      case 'medical': return <Stethoscope className="w-4 h-4 text-rose-600" />;
      case 'accident': return <Car className="w-4 h-4 text-red-600" />;
      case 'food_water': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'transport': return <Bus className="w-4 h-4 text-blue-600" />;
      case 'lost_person': return <Search className="w-4 h-4 text-purple-600" />;
      default: return <LifeBuoy className="w-4 h-4 text-slate-600" />;
    }
  };

  const displayedList = getFilteredList();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 pb-24 pt-1"
    >
      {/* If current user is NOT logged in as a volunteer, show helpful switcher banner */}
      {!isVolunteerLoggedIn && onOpenLogin && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-amber-900 font-medium">
              Want to respond to alerts? Sign in as a Certified Volunteer.
            </span>
          </div>
          <button
            onClick={onOpenLogin}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors shadow-2xs"
          >
            Volunteer Sign In
          </button>
        </div>
      )}

      {/* Volunteer Profile Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-4 text-white shadow-xl border border-blue-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser?.avatar || currentVolunteer.avatar}
                alt={currentUser?.name || currentVolunteer.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/80 shadow-md"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-blue-900 ${
                  currentUser?.isOnDuty !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-tight">
                  {currentUser?.role === 'volunteer' ? currentUser.name : currentVolunteer.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-blue-200" />
              </div>
              <p className="text-[11px] text-blue-200 font-medium">
                {currentUser?.role === 'volunteer' && currentUser.volunteerBadge
                  ? currentUser.volunteerBadge
                  : currentVolunteer.badge}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-amber-300 text-xs font-bold font-mono">
              <span>★ {currentUser?.rating || currentVolunteer.rating}</span>
            </div>
            <span className="text-[10px] text-blue-200 block">
              {currentUser?.missionsCompleted || currentVolunteer.completedCount} Missions
            </span>
          </div>
        </div>

        {/* Rapid Readiness Indicators & Duty Toggle */}
        <div className="mt-3 pt-3 border-t border-blue-600/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-blue-100">
            <Navigation className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ready · {currentUser?.volunteerVehicle || currentVolunteer.vehicle}</span>
          </div>

          {onToggleDuty && currentUser?.role === 'volunteer' ? (
            <button
              onClick={onToggleDuty}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 ${
                currentUser.isOnDuty
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                  : 'bg-slate-700/60 text-slate-300 border border-slate-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentUser.isOnDuty ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span>{currentUser.isOnDuty ? 'On Duty' : 'Off Duty'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-blue-100">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Active Responder</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-between">
          <span>Volunteer Dashboard</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {nearbyRequests.length} Open SOS
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review community emergency broadcasts and dispatch yourself
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'nearby'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Nearby ({nearbyRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('accepted')}
          className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'accepted'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Accepted ({acceptedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({completedRequests.length})
        </button>
      </div>

      {/* Urgency Pill Sub-filter */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-slate-400 font-medium">Filter Priority:</span>
        <div className="flex items-center gap-1">
          {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setUrgencyFilter(lvl)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase transition-colors ${
                urgencyFilter === lvl
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Feed List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No requests in this view</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                All community alerts in this category are currently handled. Stay on standby!
              </p>
            </motion.div>
          ) : (
            displayedList.map((req) => {
              const isAccepted = req.status === 'assigned' || req.status === 'en_route';
              const isCompleted = req.status === 'completed';

              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-2xl bg-white border transition-all space-y-3 shadow-sm ${
                    req.urgency === 'high' && !isCompleted
                      ? 'border-red-200 ring-1 ring-red-100'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {/* Card Header: Category + Urgency Badge + Time */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                        {getCategoryIcon(req.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 capitalize">
                          {req.category.replace('_', ' ')}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">
                          {req.requesterName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.urgency === 'high'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : req.urgency === 'medium'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {req.urgency}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {req.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {req.description}
                  </p>

                  {/* Location & Distance & Contact Preference */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 truncate max-w-[210px]">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{req.location}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                        Nearby
                      </span>
                      <span className="text-slate-400">
                        {req.contactPreference === 'call' ? (
                          <Phone className="w-3 h-3 text-emerald-600 inline" />
                        ) : req.contactPreference === 'message' ? (
                          <MessageSquare className="w-3 h-3 text-blue-600 inline" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-slate-500 inline" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Action Button */}
                  <div className="pt-1">
                    {req.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onAcceptRequest(req)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                      >
                        <HeartHandshake className="w-4 h-4 text-white" />
                        <span>Accept Request &amp; Respond</span>
                      </motion.button>
                    )}

                    {isAccepted && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onTrackRequest(req)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                      >
                        <Navigation className="w-4 h-4 text-white" />
                        <span>Volunteer En Route · Open Live Tracker</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </motion.button>
                    )}

                    {isCompleted && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-700">Resolved Successfully</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">
                          {req.resolvedDuration || 'Completed'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
