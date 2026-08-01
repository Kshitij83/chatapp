import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
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
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md card-glass p-8 sm:p-10 animate-fade-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
            <BsChatDots className="text-3xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-ink text-center">
            Welcome back to{" "}
            <span className="text-primary">JustChatting</span>
          </h1>
          <p className="text-ink-muted text-sm mt-2">Log in to continue chatting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-ink-muted">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="input-modern w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-ink-muted">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="input-modern w-full pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
              </button>
            </div>
          </div>

          <Link
            to="/signup"
            className="text-sm text-primary hover:underline inline-block"
          >
            Don&apos;t have an account?
          </Link>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
