import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="standard-window flex flex-col items-center justify-center chat-window-bg rounded-2xl shadow-2xl">
      <div className="w-full max-w-md p-8 mx-4">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#EEEEEE' }}>
          Login to
          <span style={{ color: '#00ADB5' }} className="ml-2">JustChatting</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#00ADB5' }}>
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input h-12"
              style={{ 
                backgroundColor: '#393E46', 
                borderColor: '#00ADB5', 
                color: '#EEEEEE'
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#00ADB5' }}>
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full input h-12 pr-12"
                style={{ 
                  backgroundColor: '#393E46', 
                  borderColor: '#00ADB5', 
                  color: '#EEEEEE'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          <Link
            to="/signup"
            className="text-sm hover:underline mt-4 inline-block"
            style={{ color: '#00ADB5' }}
          >
            Don't have an account?
          </Link>
          <div>
            <button className="btn w-full font-semibold border-none h-12 btn-animated" style={{ backgroundColor: '#00ADB5', color: '#222831' }} disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
