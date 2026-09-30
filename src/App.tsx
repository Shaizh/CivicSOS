import React, { useState, useEffect } from 'react';
import { 
  HelpRequest, 
  Volunteer, 
  UserProfile,
  UserRole
} from './types';
import { 
  INITIAL_REQUESTS, 
  INITIAL_VOLUNTEERS 
} from './data/mockData';
import { 
  DEMO_RESIDENT, 
  DEMO_VOLUNTEER_RAHUL 
} from './data/authPresets';
import { TopAppBar } from './components/TopAppBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { CallModal } from './components/CallModal';
import { ChatDrawer } from './components/ChatDrawer';
import { LoginModal } from './components/LoginModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { HomeScreen } from './screens/HomeScreen';
import { RequestHelpScreen } from './screens/RequestHelpScreen';
import { VolunteerDashboardScreen } from './screens/VolunteerDashboardScreen';
import { RequestTrackingScreen } from './screens/RequestTrackingScreen';
import { RequestCompletionScreen } from './screens/RequestCompletionScreen';
import { ResourcesScreen } from './screens/ResourcesScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { getCurrentUserLocation } from './utils/geolocation';
import { CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_REQUESTS_KEY = 'civicsos_requests_data_v2';
const STORAGE_STATS_KEY = 'civicsos_stats_data_v2';
const STORAGE_USER_KEY = 'civicsos_user_profile_v2';

export default function App() {
  // Current Logged-in User Profile (defaults to DEMO_RESIDENT for instant usable state)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_RESIDENT;
  });

  // Navigation & Screen State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeTrackingRequest, setActiveTrackingRequest] = useState<HelpRequest | null>(null);
  const [justCompletedRequest, setJustCompletedRequest] = useState<HelpRequest | null>(null);
  const [detectedCity, setDetectedCity] = useState<string>('');

  // Role perspective: 'resident' or 'volunteer'
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'resident';
  });

  // Modal & Drawer States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Requests state with localStorage persistence
  const [requests, setRequests] = useState<HelpRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REQUESTS;
  });

  // Volunteers state
  const [volunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const currentVolunteer = volunteers[0];

  // Community metrics with localStorage persistence
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      activeRequests: 4,
      nearbyVolunteers: 18,
      completedToday: 12,
    };
  });

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Persist requests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // ignore
    }
  }, [requests]);

  // Persist stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Detect real city on load
  useEffect(() => {
    getCurrentUserLocation()
      .then((geo) => {
        if (geo.city || geo.neighborhood) {
          setDetectedCity(geo.city ? `${geo.city}` : (geo.neighborhood || 'Local Area'));
        }
      })
      .catch(() => {
        // Geolocation denied or unavailable
      });
  }, []);

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'alert'>('success');

  // Call modal state
  const [callModalInfo, setCallModalInfo] = useState<{
    isOpen: boolean;
    name: string;
    subtitle: string;
    phoneNumber?: string;
    avatar?: string;
  }>({
    isOpen: false,
    name: '',
    subtitle: '',
  });

  // Chat drawer state
  const [chatDrawerInfo, setChatDrawerInfo] = useState<{
    isOpen: boolean;
    volunteer: Volunteer | null;
    category: string;
  }>({
    isOpen: false,
    volunteer: null,
    category: '',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    if (user.role === 'volunteer') {
      setCurrentTab('volunteers');
    } else {
      setCurrentTab('home');
    }
    showToast(`Signed in as ${user.name} (${user.role === 'volunteer' ? 'Volunteer Medic' : 'Resident'})`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRole('resident');
    showToast('Signed out. Continuing in Guest mode.', 'info');
  };

  const handleToggleDuty = () => {
    if (!currentUser) return;
    const nextStatus = !currentUser.isOnDuty;
    const updatedUser: UserProfile = {
      ...currentUser,
      isOnDuty: nextStatus,
    };
    setCurrentUser(updatedUser);
    showToast(nextStatus ? 'Status: On Duty (Accepting SOS Alerts)' : 'Status: Off Duty (Standby)', nextStatus ? 'success' : 'info');
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (newRole === 'volunteer') {
      if (!currentUser || currentUser.role !== 'volunteer') {
        // Automatically switch to volunteer preset for seamless exploration
        setCurrentUser(DEMO_VOLUNTEER_RAHUL);
      }
      setCurrentTab('volunteers');
    } else {
      if (!currentUser || currentUser.role !== 'resident') {
        setCurrentUser(DEMO_RESIDENT);
      }
      setCurrentTab('home');
    }
  };

  // Flow Step 2 -> 3: Send SOS
  const handleSOSSubmit = (newReqData: Omit<HelpRequest, 'id' | 'timestamp' | 'status'>) => {
    const newId = `req-${Date.now().toString().slice(-4)}`;
    const newRequest: HelpRequest = {
      ...newReqData,
      id: newId,
      timestamp: 'Just now',
      status: 'pending',
      assignedVolunteer: currentVolunteer,
    };

    setRequests((prev) => [newRequest, ...prev]);

    setStats((prev: any) => ({
      ...prev,
      activeRequests: prev.activeRequests + 1,
    }));

    showToast('SOS sent to nearby volunteers.', 'success');

    setActiveTrackingRequest(newRequest);
    setJustCompletedRequest(null);
  };

  // Flow Step 3 -> 4: Volunteer accepts request
  const handleAcceptRequest = (request: HelpRequest) => {
    const updated: HelpRequest = {
      ...request,
      status: 'en_route',
      assignedVolunteer: currentVolunteer,
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? updated : r))
    );

    showToast(`You accepted ${request.category.replace('_', ' ')} alert. Tracking live...`, 'info');
    setActiveTrackingRequest(updated);
    setJustCompletedRequest(null);
  };

  // Flow Step 4 -> 5: Mark as Completed
  const handleMarkCompleted = (request: HelpRequest) => {
    const completedReq: HelpRequest = {
      ...request,
      status: 'completed',
      resolvedDuration: '4 min 18 sec',
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? completedReq : r))
    );

    setActiveTrackingRequest(null);
    setJustCompletedRequest(completedReq);
  };

  // Flow Step 5 -> 1: Return to Home & increment "Completed Today"
  const handleFinishCompletion = (rating: number, feedback: string) => {
    if (justCompletedRequest) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === justCompletedRequest.id
            ? { ...r, rating, feedback }
            : r
        )
      );
    }

    setStats((prev: any) => ({
      ...prev,
      completedToday: prev.completedToday + 1,
      activeRequests: Math.max(0, prev.activeRequests - 1),
    }));

    showToast('Mission completed! Mutual aid rendered safely.', 'success');
    setJustCompletedRequest(null);
    setActiveTrackingRequest(null);
    setCurrentTab('home');
  };

  // Open calling overlay
  const handleOpenCall = (name: string, subtitle: string, phoneNumber?: string, avatar?: string) => {
    setCallModalInfo({
      isOpen: true,
      name,
      subtitle,
      phoneNumber,
      avatar,
    });
  };

  // Open messaging drawer
  const handleOpenMessage = (volunteer: Volunteer) => {
    setChatDrawerInfo({
      isOpen: true,
      volunteer,
      category: activeTrackingRequest?.category || 'Emergency',
    });
  };

  // Render view
  const renderCurrentView = () => {
    if (justCompletedRequest) {
      return (
        <RequestCompletionScreen
          key="completion"
          request={justCompletedRequest}
          onFinishAndReturnHome={handleFinishCompletion}
        />
      );
    }

    if (activeTrackingRequest) {
      return (
        <RequestTrackingScreen
          key={`tracking-${activeTrackingRequest.id}`}
          request={activeTrackingRequest}
          onMarkCompleted={handleMarkCompleted}
          onCallVolunteer={(vol) =>
            handleOpenCall(vol.name, `${vol.badge} · Responder`, vol.phone, vol.avatar)
          }
          onMessageVolunteer={handleOpenMessage}
          onBackToDashboard={() => setActiveTrackingRequest(null)}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            key="home"
            stats={stats}
            onRequestHelp={() => {
              setActiveRole('resident');
              setCurrentTab('request');
            }}
            onBecomeVolunteer={() => {
              setActiveRole('volunteer');
              setCurrentTab('volunteers');
            }}
            onSelectRequest={(req) => {
              setActiveRole('volunteer');
              setCurrentTab('volunteers');
            }}
            activeRequests={requests.filter((r) => r.status === 'pending')}
            onOpenCall={handleOpenCall}
            detectedCity={detectedCity}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        );
      case 'request':
        return (
          <RequestHelpScreen
            key="request"
            onSubmitSOS={handleSOSSubmit}
            onOpenCall={handleOpenCall}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        );
      case 'volunteers':
        return (
          <VolunteerDashboardScreen
            key="volunteers"
            requests={requests}
            onAcceptRequest={handleAcceptRequest}
            onTrackRequest={(req) => setActiveTrackingRequest(req)}
            currentVolunteer={currentVolunteer}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onToggleDuty={handleToggleDuty}
          />
        );
      case 'resources':
        return <ResourcesScreen key="resources" onOpenCall={handleOpenCall} />;
      case 'community':
        return <CommunityScreen key="community" stats={stats} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-start sm:py-4">
      {/* Mobile-first viewport container (~430px max width) */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[920px] bg-slate-50 flex flex-col relative sm:rounded-[36px] sm:overflow-hidden sm:shadow-[0_0_50px_rgba(0,0,0,0.6)] sm:border sm:border-slate-800">
        
        {/* Sticky Top App Bar */}
        <TopAppBar
          activeRequest={activeTrackingRequest}
          currentUser={currentUser}
          activeRole={activeRole}
          onRoleSwitch={handleRoleSwitch}
          onNavigateToTracking={() => {
            if (activeTrackingRequest) {
              setJustCompletedRequest(null);
            }
          }}
          onOpenProfile={() => setIsProfileDrawerOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          nearbyVolunteersCount={stats.nearbyVolunteers}
        />

        {/* Animated Floating Toast Notification Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute top-16 left-3 right-3 z-50"
            >
              <div
                className={`p-3.5 rounded-2xl shadow-xl border flex items-center justify-between gap-2.5 text-xs font-semibold ${
                  toastType === 'success'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30'
                    : toastType === 'alert'
                    ? 'bg-red-600 text-white border-red-500 shadow-red-900/30'
                    : 'bg-blue-600 text-white border-blue-500 shadow-blue-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-white" />
                  <span>{toastMessage}</span>
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
                  aria-label="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Screen Content with Smooth Animated Page Transition */}
        <main className="flex-1 px-4 py-2 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderCurrentView()}
          </AnimatePresence>
        </main>

        {/* Persistent 5-Tab Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (activeTrackingRequest) {
              setActiveTrackingRequest(null);
            }
            if (justCompletedRequest) {
              setJustCompletedRequest(null);
            }
            setCurrentTab(tab);
          }}
          activeRequestsCount={requests.filter((r) => r.status === 'pending').length}
        />

        {/* Login Modal for User & Volunteer */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialRole={activeRole}
        />

        {/* Account & Profile Drawer */}
        <ProfileDrawer
          isOpen={isProfileDrawerOpen}
          onClose={() => setIsProfileDrawerOpen(false)}
          currentUser={currentUser}
          onSwitchRole={handleRoleSwitch}
          onToggleDuty={handleToggleDuty}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Interactive Simulated Phone Call Modal */}
        <CallModal
          isOpen={callModalInfo.isOpen}
          onClose={() => setCallModalInfo((prev) => ({ ...prev, isOpen: false }))}
          contactName={callModalInfo.name}
          contactSubtitle={callModalInfo.subtitle}
          phoneNumber={callModalInfo.phoneNumber}
          avatar={callModalInfo.avatar}
        />

        {/* Interactive Simulated Chat Drawer */}
        {chatDrawerInfo.volunteer && (
          <ChatDrawer
            isOpen={chatDrawerInfo.isOpen}
            onClose={() => setChatDrawerInfo((prev) => ({ ...prev, isOpen: false }))}
            volunteer={chatDrawerInfo.volunteer}
            emergencyCategory={chatDrawerInfo.category}
          />
        )}
      </div>
    </div>
  );
}
