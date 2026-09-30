import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Navigation, 
  Check, 
  ArrowLeft
} from 'lucide-react';
import { HelpRequest, Volunteer } from '../types';
import { MockMap } from '../components/MockMap';
import { motion } from 'motion/react';

interface RequestTrackingScreenProps {
  request: HelpRequest;
  onMarkCompleted: (request: HelpRequest) => void;
  onCallVolunteer: (volunteer: Volunteer) => void;
  onMessageVolunteer: (volunteer: Volunteer) => void;
  onBackToDashboard: () => void;
}

export const RequestTrackingScreen: React.FC<RequestTrackingScreenProps> = ({
  request,
  onMarkCompleted,
  onCallVolunteer,
  onMessageVolunteer,
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [etaMinutes, setEtaMinutes] = useState<number>(
    request.assignedVolunteer?.etaMinutes || 5
  );
  const [etaSeconds, setEtaSeconds] = useState<number>(30);

  // Live ETA countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        setEtaMinutes((prevMin) => {
          if (prevMin > 1) return prevMin - 1;
          setCurrentStep(4);
          return 0;
        });
        return 59;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const volunteer = request.assignedVolunteer || {
    id: 'vol-default',
    name: 'Rahul Sharma',
    badge: 'Certified First Aid Responder',
    rating: 4.9,
    completedCount: 24,
    phone: 'Direct via CivicSOS',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    etaMinutes: 5,
    distanceKm: 0.6,
    skills: ['CPR & AED Certified', 'Bleeding Control'],
    vehicle: 'Motorbike (Rapid Response)',
    currentCoords: { lat: 12.9716, lng: 77.5946 },
  };

  const steps = [
    { num: 1, title: 'Request Sent', subtitle: 'Broadcast to network', done: true },
    { num: 2, title: 'Volunteer Assigned', subtitle: volunteer.name, done: currentStep >= 2 },
    { num: 3, title: 'En Route', subtitle: etaMinutes > 0 ? `Arriving in ~${etaMinutes}m` : 'Approaching scene', done: currentStep >= 3 },
    { num: 4, title: 'Help Arrived', subtitle: 'Mutual aid on site', done: currentStep >= 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 pb-24 pt-1"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Active Mission
        </span>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Live Request Tracking
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Emergency ID #{request.id} · {request.category.replace('_', ' ')}
        </p>
      </div>

      {/* Mock Map Container */}
      <MockMap
        volunteer={volunteer}
        userLocationName={request.location}
        status={request.status}
      />

      {/* Assigned Volunteer Profile Card */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={volunteer.avatar}
                alt={volunteer.name}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-full object-cover ring-2 ring-blue-600 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900">{volunteer.name}</h3>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{volunteer.badge}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-600">
                <span className="font-bold text-amber-600">★ {volunteer.rating}</span>
                <span>·</span>
                <span>{volunteer.completedCount} Missions</span>
                <span>·</span>
                <span className="text-blue-600 font-semibold">{volunteer.vehicle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live ETA Box */}
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                Estimated Arrival
              </span>
              <span className="text-sm font-extrabold text-blue-950 font-mono">
                {currentStep >= 4 ? 'Arrived on Scene' : `Arriving in ${etaMinutes}m ${etaSeconds}s`}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-blue-800 bg-white px-2 py-1 rounded-md border border-blue-200 shadow-xs">
            {volunteer.distanceKm} km away
          </span>
        </div>

        {/* Action Buttons: Call & Message */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCallVolunteer(volunteer)}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Volunteer</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMessageVolunteer(volunteer)}
            className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Message Volunteer</span>
          </motion.button>
        </div>
      </div>

      {/* Animated 4-Step Progress Tracker */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Incident Response Timeline
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {steps.map((st) => {
            const isDone = st.done;
            const isCurrent = currentStep === st.num;

            return (
              <div key={st.num} className="relative group">
                {/* Node icon */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.15, 1] : 1,
                  }}
                  transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : st.num}
                </motion.div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-blue-700'
                          : isDone
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </h5>
                    <p className="text-[10px] text-slate-500">{st.subtitle}</p>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Fast-Forward simulation buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Simulation stage:</span>
          <div className="flex gap-1">
            {[2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-colors ${
                  currentStep === stepNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Step {stepNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary CTA: Mark as Completed */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onMarkCompleted(request)}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Mark as Completed &amp; Rate Help</span>
        </motion.button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Only complete after responder has safely rendered mutual aid
        </p>
      </div>
    </motion.div>
  );
};
