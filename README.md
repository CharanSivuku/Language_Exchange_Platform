<p align="center">
  <img src="frontend/public/verba-logo.svg" width="96" height="96" alt="Verba Logo" />
</p>

<h1 align="center">Verba — Real Conversations. Real Fluency.</h1>

<p align="center">
  <strong>The Next-Generation Real-Time Peer-to-Peer Language Immersion & Video Social Platform</strong>
</p>

<p align="center">
  <a href="https://verba-eeyc.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-verba--eeyc.onrender.com-6D5DFB?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://verba-eeyc.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Status-Online_%26_Deployed-22C55E?style=for-the-badge" alt="Status" />
  </a>
</p>

<p align="center">
  🌐 <strong>Live Application:</strong> <a href="https://verba-eeyc.onrender.com/" target="_blank"><strong>https://verba-eeyc.onrender.com/</strong></a>
</p>

<p align="center">
  <a href="#-key-features"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/DaisyUI-4.12-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white" alt="DaisyUI" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Stream_Video-WebRTC-005FFF?style=for-the-badge&logo=getstream&logoColor=white" alt="Stream Video" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" /></a>
</p>

---

## 📖 Overview

**Verba** is a fullstack language-exchange social platform designed to take language learners beyond textbooks and rote vocabulary apps into **genuine, real-time fluency**.

By pairing native speakers across the globe for structured 1-on-1 video calls, real-time chats, and icebreaker-driven conversations, Verba recreates natural immersion anywhere, anytime.

Designed with an aesthetic inspired by **Linear, Raycast, and modern design systems**, Verba combines minimal visual clutter with fluid micro-interactions, robust state management, and real-time WebRTC communications.

---

## 🚀 Live Deployment

The platform is deployed live and fully functional on Render with real-time WebSockets, WebRTC video calling, Stream Chat, and MongoDB Atlas:

- 🔗 **Live Website:** [https://verba-eeyc.onrender.com/](https://verba-eeyc.onrender.com/)
- ⚡ **Hosting Platform:** Render Web Services (Node.js + React SPA)
- 🔒 **Security:** Full SSL/TLS encryption with secure `httpOnly` JWT cookies and secure WebSocket (WSS) protocol
- 🗄️ **Database:** MongoDB Atlas Cloud Database

---

## ✨ Key Features

### 📹 1. Instant 1-on-1 WebRTC Video Calls
- **Enterprise-Grade Video Infrastructure:** Integrated with **Stream Video SDK** for low-latency, crystal-clear audio and video streams.
- **In-Call Controls:** Real-time microphone muting, camera toggle, speaker/gallery layout switcher, live call duration timer, and clean teardown on call exit.
- **Integrated Icebreaker Drawer:** Keep conversation topics right in view during the video session to prevent awkward silences.

### 💬 2. Real-Time Chat & Direct Messaging
- **Full Chat Suite:** Powered by **Stream Chat React SDK** with typing indicators, emoji reactions, message read receipts, image/file attachments, and unread notification badges.
- **Dedicated Friend Conversations:** Filter chats directly by connected language exchange partners.

### 🎯 3. Practice Radar & Smart Matchmaking
- **Language Synergy Matching:** Algorithm scans the community database to find partners whose native language matches your learning target, and whose target language matches your native tongue.
- **Interactive Radar UI:** Animated scanning radar displaying prospective partner cards, shared hobbies, locations, and direct one-click invitation dispatch.
- **Instant Fallback Practice:** Never get stuck waiting; intelligent fallback options allow learners to practice conversation prompts even during off-peak hours.

### 💡 4. Curated Icebreaker Engine
- **40+ Structured Conversation Prompts:** Spanning 5 distinct genres:
  - 🌍 *Travel & Cultural Exchange*
  - 💻 *Tech, AI & Future Trends*
  - 🍜 *Food, Cooking & Lifestyle*
  - 🎬 *Cinema, Books & Pop Culture*
  - ⚡ *Quick Fire Dilemmas & Fun Debates*
- **One-Click Shuffle:** Dynamically pulls fresh, thought-provoking questions in both languages to keep the dialogue energetic.

### 🎨 5. Avatar Studio (DiceBear 9.x Integration)
- **6 Diverse Avatar Collections:**
  - `Avataaars` (Illustrated modern human avatars)
  - `Adventurer` (Fantasy RPG character sketches)
  - `Bottts` (Playful futuristic robots)
  - `Lorelei` (Elegant artistic portraits)
  - `Notionists` (Minimalist monochrome Notion-style sketches)
  - `Fun Emoji` (Vibrant emoji personas)
- **Seed Randomizer:** Single-click 🎲 Shuffle generating unique SVG combinations.
- **Custom Image Support:** Seamlessly input custom profile photo URLs with live instant preview.

### 🌈 6. 32 Dynamic DaisyUI Themes + Featured Aesthetic Vibes
- **Complete Visual Customization:** All 32 DaisyUI themes dynamically recolor the entire application without page reload.
- **Curated Aesthetic Vibe Section:**
  - 🧁 `Cupcake [Aesthetic Pastel]` — Soft pastels, playful pinks, and warm creams.
  - ☀️ `Light [Clean Minimal]` — Crisp, high-contrast modern light mode.
  - ✏️ `Wireframe [Pastel Sketch Font]` — **Custom hand-drawn sketch typography** (`Chalkboard / Comic`) paired with the sweet Cupcake pastel palette instead of dull monochrome grey!
  - 🌅 `Sunset [Warm Glow]` — Radiant evening gradient with warm accents.
  - 🌆 `Synthwave [Neon Cyber]` — 80s retro-futuristic neon violet.
  - 🧛 `Dracula [Vampire Dark]` — Classic developer high-contrast dark theme.
  - 🌲 `Forest [Nature Green]` — Organic earthy greens and dark tones.
  - 📻 `Retro [Vintage Warm]` — Warm paper texture nostalgia.
  - 🌙 `Night [Verba Dark]` — Slate/zinc Linear-inspired dark mode (default).

### 🌐 7. Global Multi-Language Support (28+ Languages)
- **Broad Regional & Global Coverage:**
  - 🇮🇳 **Telugu** (`తెలుగు`), **Hindi** (`हिन्दी`), **Tamil** (`தமிழ்`), **Bengali** (`বাংলা`), **Marathi** (`मराठी`), **Kannada** (`ಕನ್ನಡ`), **Malayalam** (`മലയാളം`), **Punjabi** (`ਪੰਜਾਬੀ`), **Urdu** (`اردو`)
  - 🇬🇧 **English**, 🇪🇸 **Spanish**, 🇫🇷 **French**, 🇩🇪 **German**, 🇨🇳 **Mandarin**, 🇯🇵 **Japanese**, 🇰🇷 **Korean**
  - 🇧🇷 **Portuguese**, 🇸🇦 **Arabic**, 🇮🇹 **Italian**, 🇷🇺 **Russian**, 🇹🇷 **Turkish**, 🇳🇱 **Dutch**, 🇻🇳 **Vietnamese**, 🇵🇱 **Polish**, 🇸🇪 **Swedish**, 🇬🇷 **Greek**, 🇮🇩 **Indonesian**, 🇹🇭 **Thai**
- **Flagcdn Integration:** Real-time country flag badges next to all language references.

### 👥 8. Community Social Graph & Real Learners
- **Friend Request Workflow:** Send, receive, accept, decline, and track pending language partner requests.
- **Live Online Presence:** Real-time status indicators powered by Socket.io.
- **Pre-Seeded Database:** Ships with a database seeder script populating real learner profiles across different languages (e.g., Arjun Varma for Telugu, Priya Sharma for Hindi, Kenji Takahashi for Japanese, Sofia Martinez for Spanish, Lucas Dubois for French).

### 🚀 9. High-Converting Landing Page
- Modern startup landing page featuring sticky glassmorphism header, live immersion mockup, 3-step onboarding guide, interactive language showcase, community learner reviews, and fast authentication gateways.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        VERBA CLIENT APPLICATION                        │
│             React 18  •  Vite  •  Tailwind CSS  •  DaisyUI             │
└───────────────┬────────────────────────┬───────────────────────┬───────┘
                │ HTTP / REST            │ WebSockets            │ WebRTC
                ▼                        ▼                       ▼
┌───────────────────────────────┐ ┌───────────────┐ ┌────────────────────┐
│      EXPRESS.JS SERVER        │ │   SOCKET.IO   │ │ STREAM VIDEO & CHAT│
│  Auth (JWT) • User • Friends  │ │ Real-Time Bus │ │   Global Edge Web  │
└───────────────┬───────────────┘ └───────┬───────┘ └────────────────────┘
                │ Mongoose                │
                ▼                         │ Notifications & Presence
┌───────────────────────────────┐         │
│     MONGODB ATLAS CLOUD       │◄────────┘
│ Users • FriendRequests • Sockets
└───────────────────────────────┘
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework:** React 18 (with React Router v7)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4 + DaisyUI 4.12
- **Data Fetching & Cache:** TanStack Query v5 (React Query)
- **State Management:** Zustand
- **Real-Time Video:** `@stream-io/video-react-sdk`
- **Real-Time Chat:** `stream-chat-react` & `stream-chat`
- **WebSocket Client:** `socket.io-client`
- **Icons & UI:** Lucide React, Canvas Confetti
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js (ES Modules with Node v26 compatibility polyfill)
- **Framework:** Express.js 4.21
- **Database & ODM:** MongoDB Atlas + Mongoose 8
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-Only, SameSite cookies + bcryptjs password hashing
- **Real-Time Gateway:** Socket.io 4.8
- **Video & Chat Backend:** Stream SDK (`stream-chat`)
- **Environment Management:** Dotenv

---

## 📁 Project Directory Structure

```text
streamify-video-calls-updated/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers (auth, user, friends, stream)
│   │   ├── lib/                 # Database, socket.io, and Stream SDK singletons
│   │   ├── middleware/          # JWT protectRoute & auth validation
│   │   ├── models/              # Mongoose schemas (User, FriendRequest)
│   │   ├── routes/              # Express API route declarations
│   │   ├── scripts/             # Database maintenance & seeding scripts
│   │   │   ├── clearDatabase.js # Wipes user/friend history for clean slate
│   │   │   └── seedLearners.js  # Seeds real multicultural learner profiles
│   │   ├── polyfill.js          # Node v26 SlowBuffer backwards-compatibility
│   │   └── server.js            # Express server entry point & socket listener
│   ├── .env                     # Backend environment configuration
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static assets & brand vectors (verba-logo.svg)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Responsive header with live notifications & menu
│   │   │   ├── Sidebar.jsx      # Collapsible navigation drawer
│   │   │   ├── ThemeSelector.jsx# 32 DaisyUI themes + Aesthetic Vibe Picks
│   │   │   ├── FriendCard.jsx   # Partner card with flags & video triggers
│   │   │   └── VerbaLogo.jsx    # SVG brand mark & typography
│   │   ├── constants/           # Themes metadata, languages, icebreakers
│   │   ├── hooks/               # Custom hooks (auth, sockets, page titles)
│   │   ├── lib/                 # Axios API client & Stream helpers
│   │   ├── pages/               # Application view routes
│   │   │   ├── LandingPage.jsx  # Public marketing showcase & intro
│   │   │   ├── HomePage.jsx     # Dashboard, community stats & practice circle
│   │   │   ├── RandomMatchPage.jsx # Practice radar & synergy matcher
│   │   │   ├── MessagesPage.jsx # Stream Chat channels & direct messages
│   │   │   ├── CallPage.jsx     # 1-on-1 Stream Video WebRTC room
│   │   │   ├── ProfilePage.jsx  # Persona editor, Avatar Studio & topics
│   │   │   ├── OnboardingPage.jsx # 3-step new user onboarding flow
│   │   │   ├── LoginPage.jsx    # Aesthetic login with credentials
│   │   │   └── SignUpPage.jsx   # Registration with instant avatar preview
│   │   ├── store/               # Zustand global stores (theme, sidebar)
│   │   ├── App.jsx              # Main router & theme provider
│   │   ├── index.css            # Custom CSS & wireframe typography overrides
│   │   └── main.jsx             # React DOM root entry
│   ├── index.html               # HTML5 entry with preconnected Inter fonts
│   ├── tailwind.config.js       # Tailwind CSS & custom DaisyUI theme configs
│   └── package.json
└── README.md
```

---

## ⚡ Quickstart & Local Setup

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **pnpm**
- A **MongoDB** database (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A free [GetStream.io](https://getstream.io/) account for Video & Chat API keys

---

### 2. Configure Environment Variables

#### Backend Configuration (`backend/.env`)
Create a `.env` file inside the `backend/` folder:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/verba?retryWrites=true&w=majority
JWT_SECRET_KEY=your_super_secret_jwt_key_here_change_in_production
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here
```

#### Frontend Configuration (`frontend/.env`)
Create a `.env` file inside the `frontend/` folder:

```env
VITE_STREAM_API_KEY=your_stream_api_key_here
```

---

### 3. Installation & Database Seeding

Open two terminal windows:

#### Terminal 1 — Backend
```bash
cd backend
npm install

# (Optional) Seed the database with 9+ real international learners (including Telugu native Arjun Varma):
npm run seed

# Start development server with auto-reload:
npm run dev
```
*Backend will be running on `http://localhost:5001`.*

#### Terminal 2 — Frontend
```bash
cd frontend
npm install

# Start Vite development server:
npm run dev
```
*Frontend will be running on `http://localhost:5173`.*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register new user account | No |
| `POST` | `/api/auth/login` | Sign in with email & password | No |
| `POST` | `/api/auth/logout` | Clear auth token cookie | Yes |
| `GET` | `/api/auth/me` | Return authenticated user record | Yes |

### User & Persona Management (`/api/users`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users` | List recommended language partners | Yes |
| `GET` | `/api/users/stats` | Platform statistics (total learners, active calls) | No |
| `POST` | `/api/users/profile` | Update profile (fullName, bio, languages, avatar) | Yes |
| `GET` | `/api/users/friends` | Retrieve accepted partner list | Yes |

### Friend Requests (`/api/friends`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/friends/request/:id` | Send connection request to a user | Yes |
| `POST` | `/api/friends/accept/:id` | Accept pending partner request | Yes |
| `POST` | `/api/friends/decline/:id` | Decline pending partner request | Yes |
| `GET` | `/api/friends/requests` | List incoming & outgoing requests | Yes |

### Stream Tokens (`/api/stream`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/stream/token` | Generate signed JWT for Stream Video & Chat SDK | Yes |

---

## 🔌 Socket.io Events

The Socket.io gateway coordinates real-time user presence and instant notifications:

- `connection`: Authenticates user socket and registers their online status.
- `newFriendRequest`: Broadcasts instant visual badge to recipient without requiring a page refresh.
- `friendRequestAccepted`: Emits confirmation to sender and recipient with instant mutual chat channel creation.
- `userConnected` / `userDisconnected`: Broadcasts real-time online status indicators across partner circles.

---

## 🔒 Security & Best Practices

- **Strict HTTP-Only Cookies:** Auth JWT tokens are stored in `httpOnly`, `sameSite: "strict"` cookies to guard against Cross-Site Scripting (XSS).
- **Salted Password Hashing:** User passwords are encrypted with `bcryptjs` using automatic 10-round salting.
- **Node v26 Compatibility:** Includes `src/polyfill.js` ensuring compatibility with modern Node.js versions lacking legacy `SlowBuffer` prototypes.
- **CSS Theme Isolation:** DaisyUI semantic variables (`bg-base-100`, `bg-base-200`, `text-base-content`, `border-base-300`) prevent hardcoded hex freeze and allow 100% color adaptability.

---

## 📄 License

This project is licensed under the **ISC License**. Free to use, adapt, and build upon.

<p align="center">
  Built with ❤️ for passionate language learners worldwide.
</p>
