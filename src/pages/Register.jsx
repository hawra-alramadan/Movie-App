import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import GoogleIcon from "../assets/GoogleIcon";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signUpProvider } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError("Password must contain at least one special character (!@#$%^&*)");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.displayName.length < 3) {
      setError("Display name must be at least 3 characters long");
      return false;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.displayName);
      toastSuccessNotify("Registration successful! Please verify your email.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      toastErrorNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderRegister = async () => {
    try {
      await signUpProvider();
      toastSuccessNotify("Signed in with Google!");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toastErrorNotify(err.message);
    }
  };

  return (
    <div className="overflow-hidden flex-1 h-screen justify-center items-center bg-white dark:bg-gray-dark-main transition-colors duration-300">
      <div className="form-container mt-[5vh] w-[380px] h-[580px]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-red-main text-2xl font-[500] text-center tracking-[0.1em] mb-3">
            Sign Up
          </h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="mb-4">
            <input
              type="text"
              name="displayName"
              placeholder="Display Name"
              value={formData.displayName}
              onChange={handleChange}
              className="peer"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="peer"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="peer"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="peer"
            />
          </div>

          <div className="mb-4">
            <input
              type="checkbox"
              name="termsAccepted"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-600 dark:text-gray-300">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-danger"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={handleProviderRegister}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <GoogleIcon color="currentColor" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
