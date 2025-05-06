import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import GoogleIcon from "../assets/GoogleIcon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUpProvider, forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      await signIn(email, password);
      toastSuccessNotify("Logged in successfully");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError(err.message);
      }
      toastErrorNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async () => {
    try {
      await signUpProvider();
      toastSuccessNotify("Logged in successfully");
      navigate("/");
    } catch (err) {
      toastErrorNotify(err.message);
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toastErrorNotify("Please enter your email first");
      return;
    }

    try {
      await forgotPassword(email);
      toastSuccessNotify("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err.message);
      toastErrorNotify(err.message);
    }
  };

  return (
    <div className="overflow-hidden flex-1 h-screen justify-center items-center bg-white dark:bg-gray-dark-main transition-colors duration-300">
      <div className="form-container mt-[5vh] w-[380px] h-[580px]">
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h2 className="text-red-main text-2xl font-[500] text-center tracking-[0.1em] mb-3">
            Sign In
          </h2>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer"
            />
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer"
            />
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="py-3 font-[0.75em] cursor-pointer decoration-none text-gray-500 hover:text-[#FF4B45]"
            >
              Forgot Password?
            </button>
            <Link
              to="/register"
              className="py-3 font-[0.75em] cursor-pointer decoration-none text-gray-500 hover:text-[#FF4B45]"
            >
              Sign Up
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-main hover:bg-red-dark text-white py-2 rounded-md transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleProviderLogin}
            className="flex items-center justify-center gap-2 btn-danger mt-4"
          >
            <GoogleIcon color="currentColor" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
