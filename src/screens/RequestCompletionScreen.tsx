import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Home
} from 'lucide-react';
import { HelpRequest } from '../types';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface RequestCompletionScreenProps {
  request: HelpRequest;
  onFinishAndReturnHome: (rating: number, feedback: string) => void;
}

export const RequestCompletionScreen: React.FC<RequestCompletionScreenProps> = ({
  request,
  onFinishAndReturnHome,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Rapid Arrival', 'Lifesaver']);

  // Trigger celebratory confetti on screen entry
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#2563EB', '#F59E0B', '#DC2626'],
      });
    } catch {
      // Graceful fallback if canvas is restricted
    }
  }, []);

  const volunteer = request.assignedVolunteer || {
    name: 'Rahul Sharma',
    badge: 'Certified First Aid Responder',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    completedCount: 25,
  };

  const complimentTags = [
    'Rapid Arrival',
    'Lifesaver',
    'Calm & Reassuring',
    'Well Equipped',
    'Courteous & Polite',
    'Followed Protocol',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReturnHome = () => {
    const finalFeedback = [
      ...selectedTags,
      feedback.trim() ? `"${feedback.trim()}"` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    onFinishAndReturnHome(rating, finalFeedback);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-24 pt-2"
    >
      {/* Success Celebration Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-50"
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </motion.div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md"
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Help Completed!
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            Emergency resolved safely. Thank you for being an active part of our community mutual aid network.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Incident Summary
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Resolved
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Category
            </span>
            <span className="font-bold text-slate-800 capitalize">
              {request.category.replace('_', ' ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Response Time
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-emerald-600">
              <Clock className="w-3.5 h-3.5" />
              <span>{request.resolvedDuration || '4 min 18 sec'}</span>
            </div>
          </div>

          <div className="col-span-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Location
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{request.location}</span>
            </div>
          </div>
        </div>

        {/* Responder Highlight */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={volunteer.avatar}
              alt={volunteer.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900">{volunteer.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                {volunteer.badge}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Responder
            </span>
          </div>
        </div>
      </div>

      {/* Thank You & Volunteer Feedback Card */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="text-center">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rate Responder {volunteer.name.split(' ')[0]}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Help maintain high trust &amp; safety standards in CivicSOS
          </p>

          {/* Interactive Animated Star Rating */}
          <div className="flex items-center justify-center gap-2 py-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="p-1"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                      : 'text-slate-300'
                  }`}
                />
              </motion.button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-700">
            {rating === 5 ? 'Exceptional Service!' : `${rating} out of 5 Stars`}
          </span>
        </div>

        {/* Quick Tag Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-600 block">
            What went well?
          </span>
          <div className="flex flex-wrap gap-1.5">
            {complimentTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note Textarea */}
        <div className="pt-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
            placeholder="Write a message of gratitude or feedback (optional)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Return Action Button */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleReturnHome}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4 text-white" />
          <span>Complete &amp; Return to Home</span>
        </motion.button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          This increments the community &ldquo;Completed Today&rdquo; metric
        </p>
      </div>
    </motion.div>
  );
};
