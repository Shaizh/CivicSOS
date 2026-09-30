# 🚨 CivicSOS

### Community Rapid Response & Mutual Aid Platform

CivicSOS is a mobile-first community support platform designed to connect residents who need urgent assistance with nearby volunteers who can respond.

The platform helps users create structured SOS requests, identify the likely type and urgency of an incident, share their location, connect with volunteers, and track the response from request creation to completion.

> **Code for Community Project**

---

## ✨ Features

### 🆘 SOS Help Requests

Residents can create an SOS request by describing their situation and selecting the type of assistance required.

Supported categories include:

* 🏥 Medical Emergency
* 🚗 Accident
* 💧 Food / Water
* 🚌 Transportation
* 🔎 Lost Person
* 🛟 Other Urgent Need

### 🤖 Incident Triage

CivicSOS includes an explainable rule-based incident classifier.

It analyzes the user's description and provides:

* Incident category
* Urgency level
* Confidence score
* Matched keywords
* Emergency-call suggestion for high-urgency situations

### 📍 Location Awareness

The application can use the browser's Geolocation API to detect the user's coordinates.

It also uses OpenStreetMap Nominatim reverse geocoding to convert coordinates into a readable location.

### 👥 Volunteer Dashboard

Volunteers can:

* View nearby SOS requests
* Filter requests by urgency
* View request details
* Accept requests
* Track active missions
* Toggle their availability
* View completed requests
* Communicate with residents

### 🚗 Request Tracking

Each accepted request follows:

**Request Sent → Volunteer Assigned → En Route → Help Arrived**

### 💬 Communication

The application includes:

* In-app chat
* Call interface
* Volunteer contact information
* Contact preference selection
* Anonymous request option

### 🏘️ Community Safety

CivicSOS provides:

* Safety advisories
* Community announcements
* Emergency aid information
* Verified responder information

### 📚 Emergency Resources

The resources section provides first-aid guidance and emergency contact information.

For life-threatening emergencies, users should contact official emergency services.

---

## 🛠️ Technology Stack

| Technology              | Purpose               |
| ----------------------- | --------------------- |
| React 19                | Frontend              |
| TypeScript              | Type-safe development |
| Vite                    | Build tooling         |
| Tailwind CSS            | Styling               |
| Motion                  | Animations            |
| Lucide React            | Icons                 |
| Browser Geolocation API | Location detection    |
| OpenStreetMap Nominatim | Reverse geocoding     |
| LocalStorage            | Prototype persistence |

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm

### Clone the repository

```bash
git clone https://github.com/Shaizh/CivicSOS.git
```

### Enter the project

```bash
cd CivicSOS
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open the local URL shown in your terminal.

---

## 💾 Data Persistence

The current prototype uses browser `localStorage` to
