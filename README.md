# 🏛️ The Quad: Campus Intelligence Platform

![The Quad Hero](file:///home/hemanth/.gemini/antigravity/brain/be49035d-0109-4828-be84-3c335e9aa3af/the_quad_hero_1776619198064.png)

> **The unified ecosystem for events, clubs, and collaborative projects. Engineered for Student Excellence.**

The Quad is a high-end, real-time campus community platform designed to bridge the gap between students, organizations, and administrative leadership. It provides a central hub for social engagement, event discovery, and professional growth.

---

## 🚀 Key Features

### 🌟 Community & Social
- **Social Pulse:** A real-time feed for campus news, project updates, and social interactions.
- **Real-time Chat:** Seamless communication with peers and club members via Socket.io.
- **Omni-Search (Cmd+K):** A lightning-fast, global search interface to find anything on campus instantly.

### 📅 Events & Logistics
- **Event Discovery:** Browse and filter upcoming campus events with an interactive map view.
- **Smart RSVPs:** Track attendance and get automated reminders for your favorite events.
- **QR Check-in:** Streamlined event entry with secure QR code generation and scanning.

### 🛡️ Governance & Clubs
- **Club Management:** Tools for club heads to manage memberships, roles, and approvals.
- **Admin Dashboard:** High-level analytics for campus engagement, event success, and demographics.
- **Telemetry & Insights:** Built-in tracking for engagement metrics (Privacy-first).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling:** Vanilla CSS + Tailwind CSS (Hybrid)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Maps:** [Mapbox GL](https://www.mapbox.com/mapbox-gl-js)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Cache/Queue:** [Redis](https://redis.io/) + [BullMQ](https://docs.bullmq.io/)
- **Authentication:** [Passport.js](https://www.passportjs.org/) (Local, Google, Microsoft)
- **Real-time:** [Socket.io](https://socket.io/)
- **Storage:** [Cloudinary](https://cloudinary.com/)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis

### 1. Clone the Repository
```bash
git clone https://github.com/Hemanth509h/hack.git
cd hack
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_secret
SESSION_SECRET=your_session_secret
CLOUDINARY_URL=your_cloudinary_url
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_GA_ID=your_ga4_id
VITE_MAPBOX_TOKEN=your_mapbox_token
```
Start the frontend:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
hack/
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── services/   # Internal logic/integrations
│   └── index.js        # Entry point
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # View layouts
│   │   ├── lib/        # Utilities (telemetry, API)
│   │   └── store/      # Redux state
│   └── index.html      # SPA entry
└── README.md           # This file!
```

---

## 📈 Roadmap & Contributions
- [ ] Mobile App (React Native)
- [ ] AI-driven Event Recommendations
- [ ] Integration with Campus LMS
- [ ] Blockchain-based Digital Badges

Built with ❤️ by the Quad Engineering Team.
