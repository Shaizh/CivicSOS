import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactSubtitle: string;
  phoneNumber?: string;
  avatar?: string;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  contactName,
  contactSubtitle,
  phoneNumber,
  avatar,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callStatus, setCallStatus] = useState<'Connecting...' | 'Ringing...' | 'Connected'>('Connecting...');

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('Connecting...');
      return;
    }

    const t1 = setTimeout(() => setCallStatus('Ringing...'), 800);
    const t2 = setTimeout(() => setCallStatus('Connected'), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (isOpen && callStatus === 'Connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, callStatus]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white text-center shadow-2xl flex flex-col items-center relative overflow-hidden"
          >
            {/* Top Trust Marker */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-emerald-400 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Emergency Link</span>
            </div>

            {/* Avatar with pulse ring */}
            <div className="relative mb-4">
              {callStatus === 'Connected' && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-emerald-500/40"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-500/40 p-1 bg-slate-800 shadow-xl">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={contactName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              {callStatus === 'Connected' && (
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
              )}
            </div>

            {/* Contact Info */}
            <h3 className="text-xl font-bold text-white mb-1">{contactName}</h3>
            <p className="text-xs text-slate-400 mb-2">{contactSubtitle}</p>
            {phoneNumber && (
              <p className="text-xs font-mono text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/40 mb-3">
                {phoneNumber}
              </p>
            )}

            {/* Audio Waveform Equalizer when Connected */}
            <div className="h-8 mb-6 flex items-center justify-center gap-1.5">
              {callStatus === 'Connected' ? (
                <div className="flex items-center gap-1.5">
                  {[0.6, 1.2, 0.8, 1.4, 0.9, 0.5].map((multiplier, idx) => (
                    <motion.span
                      key={idx}
                      className="w-1.5 bg-emerald-400 rounded-full"
                      animate={{ height: [6, 24 * multiplier, 8, 20 * multiplier, 6] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: idx * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                  <span className="ml-2 font-mono text-sm font-semibold text-emerald-400">
                    {formatTime(callDuration)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-slate-400 animate-pulse">
                  {callStatus}
                </span>
              )}
            </div>

            {/* Call Controls */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-[200px] mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  isSpeaker
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="text-[11px] font-medium">{isSpeaker ? 'Speaker On' : 'Speaker'}</span>
              </motion.button>
            </div>

            {/* End Call Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
