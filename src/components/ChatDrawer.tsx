import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, CheckCheck } from 'lucide-react';
import { Volunteer } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'user' | 'volunteer';
  text: string;
  time: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Volunteer;
  emergencyCategory: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  volunteer,
  emergencyCategory,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'volunteer',
      text: `Hello! I received your alert for ${emergencyCategory}. I am currently navigating toward your location. Please stay calm, help is on the way.`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    'I am by the main roadside entrance.',
    'First aid kit needed.',
    'Patient is conscious and resting.',
    'Drive safely, standing by.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate volunteer response
    setIsTyping(true);
    setTimeout(() => {
      let reply = `Copy that. My ETA is under 4 minutes. Stay right where you are and keep a visual lookout.`;
      if (text.toLowerCase().includes('kit') || text.toLowerCase().includes('aid')) {
        reply = `Understood! I have a full Level-2 trauma and first-aid kit ready.`;
      } else if (text.toLowerCase().includes('entrance') || text.toLowerCase().includes('road')) {
        reply = `Noted. I will pull up near the entrance with hazards flashing.`;
      }

      const volMsg: Message = {
        id: `v-${Date.now()}`,
        sender: 'volunteer',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, volMsg]);
      setIsTyping(false);
    }, 1300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-w-md mx-auto h-[82vh] bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={volunteer.avatar}
                    alt={volunteer.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900">{volunteer.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    En Route · {volunteer.etaMinutes} min away
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Close message chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-full">
                  Direct Responder Channel
                </span>
              </div>

              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <div
                        className={`flex items-center gap-1 justify-end mt-1 text-[9px] ${
                          isUser ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        <span>{m.time}</span>
                        {isUser && <CheckCheck className="w-3 h-3 text-blue-200" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl px-3 py-2 w-20 text-slate-400 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-white/80 border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qr)}
                  className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors shrink-0"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Type message to responder..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-blue-600 disabled:opacity-40 hover:bg-blue-700 text-white flex items-center justify-center transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
