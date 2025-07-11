import "./App.css";
import Login from './pages/login/Login';
import SignUp from "./pages/signup/SignUp";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import SnowdropAnimation from "./components/SnowdropAnimation";
import { Navigate,Route,Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const {authUser} = useAuthContext();
  return (
    <div className="p-4 min-h-screen flex items-center justify-center sm:p-6 md:p-8 lg:p-10 relative" style={{ zIndex: 1 }}>
      <SnowdropAnimation />
      <div className="relative z-20">
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Toaster 
        toastOptions={{
          className: '',
          style: {
            zIndex: 100,
          },
        }}
      />
    </div>
  );
}

export default App;
