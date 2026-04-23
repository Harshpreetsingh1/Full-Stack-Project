# Smart Complaint & Support System (Multilingual)

A production-ready MERN-based multilingual complaint management platform with JWT authentication, voice input, auto-categorization, Hindi↔English translation, and an admin dashboard.

## Features

- **JWT Authentication** — Register, login, role-based access (user/admin)
- **Complaint Submission** — Text + voice input via Web Speech API
- **Auto Categorization** — Rule-based keyword classification (billing/technical/general)
- **Real-time Translation** — Hindi↔English via MyMemory API (no API key needed)
- **Status Tracking** — Open → In Progress → Resolved with colored badges
- **Admin Dashboard** — View all complaints, filter, update status
- **Responsive UI** — Dark glassmorphism design with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Translation | MyMemory API |
| Voice | Web Speech API |

## Project Structure

```
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── complaintController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── complaintRoutes.js
│   ├── utils/
│   │   ├── categorize.js
│   │   └── translate.js
│   └── server.js
├── client/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── StatusBadge.jsx
│       │   └── VoiceInput.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ComplaintForm.jsx
│       │   └── AdminPanel.jsx
│       ├── services/api.js
│       ├── context/AuthContext.jsx
│       └── utils/helpers.js
```

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas URI

## Run Locally

### 1. Clone and configure

```bash
git clone <repo-url>
cd FullStack_Projectt
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-complaint-db
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev   # development (nodemon)
npm start     # production
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm start
```

The app runs at **http://localhost:3000**.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login user |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/complaints` | JWT | Create complaint |
| GET | `/api/complaints` | JWT | Get user's complaints |
| GET | `/api/complaints/all` | Admin | Get all complaints |
| PATCH | `/api/complaints/:id` | Admin | Update complaint status |

## Deployment

### Backend → Render / Railway

1. Push code to GitHub
2. Create new Web Service on Render
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`

### Frontend → Vercel / Netlify

1. Create new project pointing to `client` directory
2. Build command: `npm run build`
3. Publish directory: `build`
4. Environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

## License

MIT
