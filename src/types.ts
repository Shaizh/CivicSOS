export type UserRole = 'resident' | 'volunteer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  avatar: string;
  location?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  volunteerBadge?: string;
  volunteerSkills?: string[];
  volunteerVehicle?: string;
  isOnDuty?: boolean;
  missionsCompleted?: number;
  rating?: number;
}

export type HelpCategory = 
  | 'medical'
  | 'accident'
  | 'food_water'
  | 'transport'
  | 'lost_person'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type ContactPreference = 'call' | 'message' | 'anonymous';

export type RequestStatus = 'pending' | 'assigned' | 'en_route' | 'completed' | 'cancelled';

export interface Volunteer {
  id: string;
  name: string;
  badge: string;
  rating: number;
  completedCount: number;
  phone: string;
  avatar: string;
  etaMinutes: number;
  distanceKm: number;
  skills: string[];
  vehicle?: string;
  currentCoords: {
    lat: number;
    lng: number;
  };
}

export interface HelpRequest {
  id: string;
  category: HelpCategory;
  urgency: UrgencyLevel;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPreference: ContactPreference;
  timestamp: string;
  status: RequestStatus;
  requesterName: string;
  requesterPhone: string;
  assignedVolunteer?: Volunteer;
  rating?: number;
  feedback?: string;
  resolvedDuration?: string;
  isUserCreated?: boolean;
}

export interface EmergencyService {
  id: string;
  name: string;
  number: string;
  type: 'hospital' | 'police' | 'fire' | 'ambulance';
  description: string;
  available: string;
}

export interface ClassificationResult {
  category: HelpCategory;
  urgency: UrgencyLevel;
  confidence: number;
  matchedKeywords: string[];
  suggestEmergencyDial: boolean;
}
