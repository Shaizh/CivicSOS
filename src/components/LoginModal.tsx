import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HeartHandshake, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Zap, 
  Phone, 
  Mail, 
  Award, 
  Car, 
  Droplet, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_RESIDENT, DEMO_VOLUNTEER_RAHUL, DEMO_VOLUNTEER_PRIYA } from '../data/authPresets';
import { motion, AnimatePresence } from 'motion/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'resident',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'quick' | 'custom'>('quick');

  // Custom form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [volunteerBadge, setVolunteerBadge] = useState('Verified Citizen Responder');
  const [volunteerVehicle, setVolunteerVehicle] = useState('Motorbike / Scooter');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      role: selectedRole,
      phone: phone.trim() || '+91 98450 00000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@civicsos.org`,
      avatar: selectedRole === 'volunteer'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      location: 'Central Neighborhood',
      bloodGroup: selectedRole === 'resident' ? bloodGroup : undefined,
      emergencyContact: selectedRole === 'resident' ? emergencyContact : undefined,
      volunteerBadge: selectedRole === 'volunteer' ? volunteerBadge : undefined,
      volunteerVehicle: selectedRole === 'volunteer' ? volunteerVehicle : undefined,
      volunteerSkills: selectedRole === 'volunteer' ? ['First Aid Certified', 'Community Support'] : undefined,
      isOnDuty: selectedRole === 'volunteer',
      missionsCompleted: selectedRole === 'volunteer' ? 12 : undefined,
      rating: selectedRole === 'volunteer' ? 4.9 : undefined,
    };

    onLoginSuccess(user);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.92, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight">CivicSOS Account</span>
            </div>

            <h3 className="text-lg font-bold">Sign In to Your Portal</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Choose your role to get help or respond to nearby emergencies
            </p>

            {/* Role Selector Tabs (Resident vs Volunteer) */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setSelectedRole('resident')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'resident'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Resident / User</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('volunteer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'volunteer'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Volunteer Medic</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher: 1-Click Fast Login vs Custom Form */}
          <div className="px-5 pt-3 flex items-center justify-between text-xs border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-700">
              {selectedRole === 'resident' ? 'Resident Access' : 'Responder Portal'}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setAuthMode('quick')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  authMode === 'quick'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                1-Tap Quick
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('custom')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  authMode === 'custom'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Custom Info
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4">
            {authMode === 'quick' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select a verified profile to jump straight into the application without typing:
                </p>

                {selectedRole === 'resident' ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onLoginSuccess(DEMO_RESIDENT);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl border-2 border-blue-500/40 bg-blue-50/60 hover:bg-blue-50 hover:border-blue-500 cursor-pointer shadow-sm transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={DEMO_RESIDENT.avatar}
                          alt={DEMO_RESIDENT.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-900">{DEMO_RESIDENT.name}</h4>
                            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                              Citizen
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">{DEMO_RESIDENT.phone}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-600 pt-1 border-t border-blue-100">
                      <span className="font-semibold text-rose-600">Blood: {DEMO_RESIDENT.bloodGroup}</span>
                      <span>·</span>
                      <span className="truncate">{DEMO_RESIDENT.medicalNotes}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Volunteer 1: Rahul Sharma */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onLoginSuccess(DEMO_VOLUNTEER_RAHUL);
                        onClose();
                      }}
                      className="p-3 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer shadow-sm transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={DEMO_VOLUNTEER_RAHUL.avatar}
                            alt={DEMO_VOLUNTEER_RAHUL.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-900">{DEMO_VOLUNTEER_RAHUL.name}</h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {DEMO_VOLUNTEER_RAHUL.volunteerBadge}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 font-medium pt-1 border-t border-emerald-100">
                        <span>★ {DEMO_VOLUNTEER_RAHUL.rating} · {DEMO_VOLUNTEER_RAHUL.missionsCompleted} Missions</span>
                        <span>{DEMO_VOLUNTEER_RAHUL.volunteerVehicle}</span>
                      </div>
                    </motion.div>

                    {/* Volunteer 2: Dr. Priya Nair */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onLoginSuccess(DEMO_VOLUNTEER_PRIYA);
                        onClose();
                      }}
                      className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer shadow-sm transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={DEMO_VOLUNTEER_PRIYA.avatar}
                            alt={DEMO_VOLUNTEER_PRIYA.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-900">{DEMO_VOLUNTEER_PRIYA.name}</h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {DEMO_VOLUNTEER_PRIYA.volunteerBadge}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium pt-1 border-t border-slate-100">
                        <span>★ {DEMO_VOLUNTEER_PRIYA.rating} · Clinical Medic</span>
                        <span>{DEMO_VOLUNTEER_PRIYA.volunteerVehicle}</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Form */
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'volunteer' ? 'e.g. Rahul Sharma, RN' : 'e.g. Anita Sen'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {selectedRole === 'resident' ? (
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        value={volunteerVehicle}
                        onChange={(e) => setVolunteerVehicle(e.target.value)}
                        placeholder="Motorbike, Car, Bicycle..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {selectedRole === 'resident' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Emergency Contact (Name &amp; Phone)
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. Rohan Sen (Brother) - +91 9845..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Certification / Badge
                    </label>
                    <input
                      type="text"
                      value={volunteerBadge}
                      onChange={(e) => setVolunteerBadge(e.target.value)}
                      placeholder="e.g. Certified First Aid Responder · Level 2"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    selectedRole === 'resident'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save &amp; Continue as {selectedRole === 'resident' ? 'Resident' : 'Volunteer'}</span>
                </motion.button>
              </form>
            )}

            {/* Emergency Guest Bypass ("make the app easy to use") */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-semibold text-slate-500 hover:text-red-600 transition-colors inline-flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 text-red-500" />
                <span>Urgent Emergency? Continue as Guest without sign-in</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
