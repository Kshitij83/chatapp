import React from "react";
import GenderCheckbox from "./GenderCheckbox";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
  const [inputs,setInputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading,signup } = useSignup();

  const handleCheckboxChange = (gender) => {
    setInputs({...inputs,gender})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  }

  return (
    <div className="standard-window flex flex-col items-center justify-center chat-window-bg rounded-2xl shadow-2xl">
      <div className="w-full max-w-md p-8 mx-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#EEEEEE' }}>
          Sign Up for
          <span style={{ color: '#00ADB5' }} className="ml-2">JustChatting</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#00ADB5' }}>
              Full Name
            </label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full input h-12"
              style={{ 
                backgroundColor: '#393E46', 
                borderColor: '#00ADB5', 
                color: '#EEEEEE'
              }}
              value={inputs.fullName} 
              onChange={(e) => setInputs({...inputs, fullName: e.target.value})}
            />
          </div>

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
              value={inputs.username} 
              onChange={(e) => setInputs({...inputs, username: e.target.value})}
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
                value={inputs.password} 
                onChange={(e) => setInputs({...inputs, password: e.target.value})}
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

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#00ADB5' }}>
              Confirm Password
            </label>
            <div className="password-input-container">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password" 
                className="w-full input h-12 pr-12"
                style={{ 
                  backgroundColor: '#393E46', 
                  borderColor: '#00ADB5', 
                  color: '#EEEEEE'
                }}
                value={inputs.confirmPassword} 
                onChange={(e) => setInputs({...inputs, confirmPassword: e.target.value})}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender}/>

          <Link 
            to="/login" 
            className="text-sm hover:underline mt-4 inline-block"
            style={{ color: '#00ADB5' }}
          >
            Already have an account?
          </Link>

          <div>
            <button 
              className="btn w-full font-semibold border-none h-12 btn-animated" 
              style={{ backgroundColor: '#00ADB5', color: '#222831' }}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;








