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
- **Deployment:** Render.com

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

## 🌐 Deployment (Render)

### 1. Deploy Backend
- Create a new Web Service on Render
- Connect your repo, set root to `backend/`
- Add environment variables from your local `.env`
- Set build command: `npm install`
- Set start command: `node server.js`

### 2. Deploy Frontend
- Create a new Static Site on Render
- Set root to `frontend/`
- Set build command: `npm install && npm run build`
- Set publish directory: `frontend/dist`
- Set `VITE_API_URL` to your backend Render URL

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

