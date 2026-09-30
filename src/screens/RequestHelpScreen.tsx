import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Car, 
  Utensils, 
  Bus, 
  Search, 
  LifeBuoy, 
  MapPin, 
  Phone, 
  MessageSquare, 
  EyeOff, 
  Sparkles, 
  AlertOctagon, 
  ShieldAlert, 
  Check, 
  RefreshCw, 
  Edit2, 
  PhoneCall, 
  Loader2
} from 'lucide-react';
import { ContactPreference, HelpCategory, HelpRequest, UrgencyLevel, UserProfile } from '../types';
import { classifyHelpText } from '../utils/classifier';
import { EMERGENCY_SERVICES } from '../data/mockData';
import { getCurrentUserLocation } from '../utils/geolocation';
import { motion, AnimatePresence } from 'motion/react';

interface RequestHelpScreenProps {
  onSubmitSOS: (newRequest: Omit<HelpRequest, 'id' | 'timestamp' | 'status'>) => void;
  onOpenCall: (name: string, subtitle: string, number: string) => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
}

const CATEGORIES: { id: HelpCategory; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'medical', label: 'Medical Emergency', icon: Stethoscope, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'accident', label: 'Accident', icon: Car, color: 'text-red-600 bg-red-50 border-red-200' },
  { id: 'food_water', label: 'Food / Water', icon: Utensils, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'transport', label: 'Transportation', icon: Bus, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'lost_person', label: 'Lost Person', icon: Search, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'other', label: 'Other', icon: LifeBuoy, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

export const RequestHelpScreen: React.FC<RequestHelpScreenProps> = ({
  onSubmitSOS,
  onOpenCall,
  currentUser,
  onOpenLogin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory>('medical');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Current Detected Location');
  const [coordinates, setCoordinates] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [contactPreference, setContactPreference] = useState<ContactPreference>('call');
  const [urgency, setUrgency] = useState<UrgencyLevel>('high');
  const [confidence, setConfidence] = useState<number>(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [aiDetected, setAiDetected] = useState(false);
  const [requesterName, setRequesterName] = useState(currentUser?.name || 'Local Resident');
  const [requesterPhone, setRequesterPhone] = useState(currentUser?.phone || 'Registered Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with currentUser when changed
  useEffect(() => {
    if (currentUser) {
      setRequesterName(currentUser.name);
      setRequesterPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Attempt real browser geolocation on initial mount
  useEffect(() => {
    getCurrentUserLocation()
      .then((geo) => {
        setLocation(geo.displayName);
        setCoordinates({ lat: geo.latitude, lng: geo.longitude });
      })
      .catch(() => {
        setLocation('Central Emergency Zone');
      });
  }, []);

  // Live AI Assistant keyword evaluation on description change
  useEffect(() => {
    if (!description.trim()) {
      setConfidence(0);
      setMatchedKeywords([]);
      setAiDetected(false);
      return;
    }

    const result = classifyHelpText(description);
    if (result) {
      setSelectedCategory(result.category);
      setUrgency(result.urgency);
      setConfidence(result.confidence);
      setMatchedKeywords(result.matchedKeywords);
      setAiDetected(true);
    }
  }, [description]);

  const handleUseCurrentLocation = async () => {
    setIsDetectingGps(true);
    try {
      const geo = await getCurrentUserLocation();
      setLocation(geo.displayName);
      setCoordinates({ lat: geo.latitude, lng: geo.longitude });
      setIsEditingLocation(false);
    } catch {
      setLocation('Current GPS Pin (Active)');
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleSendSOS = () => {
    if (!description.trim()) {
      alert('Please describe your emergency need so volunteers can prepare appropriate aid.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitSOS({
        category: selectedCategory,
        urgency,
        description,
        location,
        coordinates,
        contactPreference,
        requesterName: contactPreference === 'anonymous' ? 'Anonymous Requester' : requesterName,
        requesterPhone: contactPreference === 'anonymous' ? 'Hidden' : requesterPhone,
        isUserCreated: true,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 pb-24 pt-1"
    >
      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            Request Help
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast emergency alert to verified nearby volunteers
          </p>
        </div>
      </div>

      {/* Logged In User Identity Pill */}
      <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 truncate">
          {currentUser ? (
            <>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
              />
              <div className="truncate">
                <span className="font-bold text-slate-900 block truncate">
                  Broadcasting as {currentUser.name}
                </span>
                <span className="text-[10px] text-blue-700 block truncate font-medium">
                  {currentUser.phone} {currentUser.bloodGroup ? `· Blood ${currentUser.bloodGroup}` : ''}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 font-bold">
                ?
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Broadcasting as Guest</span>
                <span className="text-[10px] text-slate-500 block">Fast emergency dispatch mode</span>
              </div>
            </>
          )}
        </div>

        {onOpenLogin && (
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 shrink-0 ml-2 px-2.5 py-1 rounded-lg bg-white border border-blue-200 shadow-2xs transition-colors"
          >
            {currentUser ? 'Switch' : 'Sign In'}
          </button>
        )}
      </div>

      {/* 2-Column Category Grid */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 min-h-[52px] ${
                  isSelected
                    ? 'border-red-600 bg-red-50/80 ring-2 ring-red-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-xs font-bold truncate ${
                      isSelected ? 'text-red-700' : 'text-slate-800'
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {isSelected ? 'Selected' : 'Tap to choose'}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Describe the Situation
          </label>
          <span className="text-[11px] text-slate-400">
            {description.length} chars
          </span>
        </div>

        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what happened and what help you need... (e.g., 'Two-wheeler crash on road, bleeding knee' or 'elderly chest pain')"
            className="w-full rounded-2xl bg-white border border-slate-200 p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
          />
        </div>

        {/* Quick prompt examples */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] text-slate-400 font-medium shrink-0">Try typing:</span>
          {[
            'Severe bleeding from accident',
            'Stranded with flat tire in dark',
            'Missing 70yo grandfather',
            'Need emergency water & food rations',
          ].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setDescription(sample)}
              className="text-[10px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 shrink-0 transition-colors"
            >
              &ldquo;{sample}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Live AI Assistance Panel with Animated Meter */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-4 text-white shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live AI Incident Triaging
            </h4>
          </div>
          {aiDetected ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/40">
              Active Analysis
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">Listening to input...</span>
          )}
        </div>

        {/* Analysis Status Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-medium block">
              Auto-Classified Category
            </span>
            <span className="font-bold text-white capitalize mt-0.5 block truncate">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-medium block">
              Assessed Urgency Level
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  urgency === 'high'
                    ? 'bg-red-500 animate-pulse'
                    : urgency === 'medium'
                    ? 'bg-amber-400'
                    : 'bg-blue-400'
                }`}
              />
              <span
                className={`font-bold uppercase text-[11px] ${
                  urgency === 'high'
                    ? 'text-red-400'
                    : urgency === 'medium'
                    ? 'text-amber-400'
                    : 'text-blue-300'
                }`}
              >
                {urgency} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Animated Confidence Meter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium">Confidence Score</span>
            <span className="font-mono font-bold text-blue-300">
              {confidence > 0 ? `${confidence}%` : 'Awaiting keywords'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <motion.div
              className={`h-full rounded-full ${
                confidence > 80
                  ? 'bg-emerald-500'
                  : confidence > 50
                  ? 'bg-blue-500'
                  : 'bg-slate-600'
              }`}
              animate={{ width: `${Math.max(5, confidence)}%` }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            />
          </div>
        </div>

        {/* Matched Keywords chips with animated entrance */}
        {matchedKeywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
            <span className="text-slate-400">Trigger Keywords:</span>
            {matchedKeywords.map((kw, idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-200 border border-blue-700/50 font-mono"
              >
                #{kw}
              </motion.span>
            ))}
          </div>
        )}

        {/* High Urgency Quick-Dial Alert Cards */}
        {urgency === 'high' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-2 border-t border-slate-800 space-y-2 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
              <span>High Urgency: Direct Emergency Hotlines</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_SERVICES.slice(0, 2).map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => onOpenCall(srv.name, srv.description, srv.number)}
                  className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-700/60 text-left transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 pr-1">
                    <span className="text-[10px] text-red-200 block truncate font-medium">
                      {srv.name}
                    </span>
                    <span className="text-sm font-extrabold text-white font-mono">
                      {srv.number}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Real Location Selector with GPS Autodetect */}
      <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-sm space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>3. Incident Location</span>
          <button
            type="button"
            onClick={() => setIsEditingLocation(!isEditingLocation)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] normal-case font-semibold"
          >
            <Edit2 className="w-3 h-3" />
            {isEditingLocation ? 'Done' : 'Change Manually'}
          </button>
        </label>

        {isEditingLocation ? (
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter street, landmark, or area..."
          />
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{location}</span>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetectingGps}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 shrink-0 flex items-center gap-1"
            >
              {isDetectingGps ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {isDetectingGps ? 'Locating...' : 'GPS Detect'}
            </button>
          </div>
        )}
      </div>

      {/* Contact Preference Selector */}
      <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-sm space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          4. Contact Preference
        </label>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'call', label: 'Direct Call', icon: Phone, desc: 'Fastest' },
            { id: 'message', label: 'Message', icon: MessageSquare, desc: 'In-app Chat' },
            { id: 'anonymous', label: 'Anonymous', icon: EyeOff, desc: 'Privacy Shield' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = contactPreference === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setContactPreference(item.id as ContactPreference)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 font-medium'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs block">{item.label}</span>
                <span className="text-[10px] text-slate-400 block">{item.desc}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Action: Pulsing SEND SOS Button with Motion Ripple */}
      <div className="pt-2 relative">
        <div className="relative flex justify-center">
          {/* Animated concentric pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-red-600/30"
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendSOS}
            disabled={isSubmitting}
            className="relative z-10 w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-600/40 flex items-center justify-center gap-3 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span>{isSubmitting ? 'DISPATCHING SOS...' : 'SEND SOS NOW'}</span>
          </motion.button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Your alert will notify active community responders immediately
        </p>
      </div>
    </motion.div>
  );
};
