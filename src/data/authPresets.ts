import { UserProfile } from '../types';

export const DEMO_RESIDENT: UserProfile = {
  id: 'usr-res-1',
  name: 'Anita Sen',
  role: 'resident',
  phone: '+91 98451 90812',
  email: 'anita.sen@civicsos.org',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  location: 'Indiranagar 100ft Road',
  bloodGroup: 'O+',
  emergencyContact: 'Rohan Sen (Brother)',
  emergencyPhone: '+91 98450 11223',
  medicalNotes: 'Carries inhaler for mild dust asthma',
};

export const DEMO_VOLUNTEER_RAHUL: UserProfile = {
  id: 'usr-vol-1',
  name: 'Rahul Sharma',
  role: 'volunteer',
  phone: '+91 98450 12389',
  email: 'rahul.sharma@civic-responders.org',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  location: 'MG Road Sector 2',
  volunteerBadge: 'Certified First Aid Responder · Level 3',
  volunteerSkills: ['CPR & AED Certified', 'Bleeding Control', 'Trauma Triage'],
  volunteerVehicle: 'Motorbike (Rapid Response)',
  isOnDuty: true,
  missionsCompleted: 24,
  rating: 4.9,
};

export const DEMO_VOLUNTEER_PRIYA: UserProfile = {
  id: 'usr-vol-2',
  name: 'Dr. Priya Nair',
  role: 'volunteer',
  phone: '+91 98221 44590',
  email: 'dr.priya.nair@healthaid.org',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  location: 'Koramangala 4th Block',
  volunteerBadge: 'Clinical Emergency Volunteer · MD',
  volunteerSkills: ['Triage', 'Emergency Cardiac Support', 'Pediatric First Aid'],
  volunteerVehicle: 'Sedan with Trauma Kit',
  isOnDuty: true,
  missionsCompleted: 48,
  rating: 5.0,
};
