import React from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  HeartHandshake, 
  Phone, 
  Mail, 
  MapPin, 
  Droplet, 
  Car, 
  Award, 
  LogOut, 
  RefreshCw,
  Power
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSwitchRole: (role: UserRole) => void;
  onToggleDuty: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchRole,
  onToggleDuty,
  onOpenLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md mx-auto max-h-[85vh] bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200"
        >
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Account &amp; Role Settings</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Close profile drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto">
            {currentUser ? (
              <>
                {/* User Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className={`w-13 h-13 rounded-full object-cover ring-2 ${
                          currentUser.role === 'volunteer' ? 'ring-emerald-500' : 'ring-blue-500'
                        }`}
                      />
                      {currentUser.role === 'volunteer' && (
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                            currentUser.isOnDuty ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">{currentUser.name}</h4>
                        {currentUser.role === 'volunteer' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                          currentUser.role === 'volunteer'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {currentUser.role === 'volunteer' ? 'Verified Volunteer' : 'Resident Citizen'}
                      </span>
                    </div>
                  </div>

                  {/* 1-Tap Switch Role Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const nextRole = currentUser.role === 'volunteer' ? 'resident' : 'volunteer';
                      onSwitchRole(nextRole);
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                    title="Switch Role"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Switch</span>
                  </motion.button>
                </div>

                {/* Volunteer On-Duty Toggle if Volunteer */}
                {currentUser.role === 'volunteer' && (
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Volunteer Dispatch Status</span>
                      <span className="text-[11px] text-slate-500">
                        {currentUser.isOnDuty ? 'Available & receiving nearby alerts' : 'Paused / Off duty'}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={onToggleDuty}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        currentUser.isOnDuty
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{currentUser.isOnDuty ? 'On Duty' : 'Off Duty'}</span>
                    </motion.button>
                  </div>
                )}

                {/* Profile Details List */}
                <div className="rounded-2xl bg-white border border-slate-200 p-3.5 space-y-2.5 text-xs shadow-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5" /> Phone:
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">{currentUser.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5" /> Email:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{currentUser.email}</span>
                  </div>

                  {currentUser.role === 'resident' && (
                    <>
                      {currentUser.bloodGroup && (
                        <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Droplet className="w-3.5 h-3.5 text-rose-500" /> Blood Group:
                          </span>
                          <span className="font-bold text-rose-600">{currentUser.bloodGroup}</span>
                        </div>
                      )}
                      {currentUser.emergencyContact && (
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400">Emergency Contact:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[190px]">
                            {currentUser.emergencyContact}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {currentUser.role === 'volunteer' && (
                    <>
                      {currentUser.volunteerBadge && (
                        <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Award className="w-3.5 h-3.5 text-amber-500" /> Certification:
                          </span>
                          <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                            {currentUser.volunteerBadge}
                          </span>
                        </div>
                      )}
                      {currentUser.volunteerVehicle && (
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Car className="w-3.5 h-3.5 text-blue-500" /> Vehicle:
                          </span>
                          <span className="font-semibold text-slate-800">{currentUser.volunteerVehicle}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Switch Account or Logout */}
                <div className="pt-2 flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onClose();
                      onOpenLogin();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Switch Profile</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Guest Mode</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Sign in to enable rapid 1-tap SOS broadcasting or become a community responder.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In as Resident or Volunteer</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
