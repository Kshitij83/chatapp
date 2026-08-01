# ChatApp

A real-time chat application with authentication, text, image and audio sharing, along with profile management built with the MERN stack and Socket.io.

---

## 🚀 Features
- Real-time messaging (Socket.io)
- User authentication (JWT, cookies)
- Online users indicator 
- Image and audio message support (AWS S3)
- Responsive UI with React + Tailwind CSS
- Protected routes and user profiles
- Modern UI/UX

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, Zustand, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Real-time:** Socket.io
- **Authentication:** JWT, Cookies
- **File Storage:** AWS S3
- **Deployment:** Vercel

---

## 📁 Project Structure
```
chatapp/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── server.js
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── zustand/
│   │   └── ...
│   ├── index.html
│   └── ...
├── Dockerfile
├── README.md
└── ...
```

---

## 🧑‍💻 How to Run Locally

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/chatapp.git
cd chatapp
```

### 2. Setup Backend
```sh
cd backend
npm install
# Create a .env file (see .env.example for required variables)
npm run dev
```

### 3. Setup Frontend
```sh
cd ../frontend
npm install
# Create a .env file with VITE_API_URL (e.g., http://localhost:5000)
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🌐 Deployment (Vercel)

The app is deployed as a single Vercel project (static frontend + one Node.js
serverless function that runs the Express + Socket.io backend).

### 1. Configure environment variables (Production)
| Variable | Value |
| --- | --- |
| `MONGO_DB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `FRONTEND_URL` | Optional: frontend origin for CORS |

```
vercel env add MONGO_DB_URI production
vercel env add JWT_SECRET production
```

### 2. Deploy
```
vercel --prod --yes
```

- `vercel.json` sets the build command and rewrites `/api/*` (including
  `/api/socket.io` WebSocket upgrades) to the `api/server.js` function, with an
  SPA fallback for the React router.
- The Socket.io client connects with `transports: ["websocket"]` and the
  `/api/socket.io` path (required on serverless — long-polling needs sticky
  sessions).
- Note: online-user presence and typing state live in function memory, so they
  are per-instance in serverless deployments.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

