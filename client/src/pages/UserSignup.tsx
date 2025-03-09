import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Mail, Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { STATUS } from "../utils/utils";
import { GoogleLogin } from "@react-oauth/google";

interface UserSignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const UserSignup: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<UserSignupFormValues>();

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: UserSignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setAuthenticationStatus(STATUS.PENDING);
      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          username: values.username,
          email: values.email,
          password: values.password,
          role: "user"
        },
        { withCredentials: true }
      );

      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      setAuthenticationStatus(STATUS.FAILED);
      setErrorMessage(error.response?.data?.error || "Signup failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setAuthenticationStatus(STATUS.PENDING);
      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential
        },
        { withCredentials: true }
      );

      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      setAuthenticationStatus(STATUS.FAILED);
      setErrorMessage(error.response?.data?.error || "Google signup failed");
    }
  };

  const handleGoogleError = () => {
    setErrorMessage("Google sign in was unsuccessful. Please try again.");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-purple-100">Join EventDuniya today</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <InputField
                icon={<User className="text-gray-400" />}
                label="Username"
                id="username"
                register={register}
                error={errors.username}
                validation={{ required: "Username is required" }}
                placeholder="johndoe123"
              />

              <InputField
                icon={<Mail className="text-gray-400" />}
                label="Email"
                id="email"
                type="email"
                register={register}
                error={errors.email}
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                placeholder="john@example.com"
              />

              <InputField
                icon={<Lock className="text-gray-400" />}
                label="Password"
                id="password"
                type="password"
                register={register}
                error={errors.password}
                validation={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                placeholder="••••••••"
              />

              <InputField
                icon={<Lock className="text-gray-400" />}
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                register={register}
                error={errors.confirmPassword}
                validation={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                }}
                placeholder="••••••••"
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Create Account
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                text="signup_with"
                size="large"
                logo_alignment="center"
                useOneTap
              />
            </div>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-500 hover:text-purple-400 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  id,
  type = "text",
  register,
  error,
  validation,
  placeholder,
}: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
        {icon}
      </div>
      <input
        {...register(id, validation)}
        type={type}
        className={`w-full pl-10 pr-4 py-2 bg-gray-800 border ${
          error ? "border-red-500" : "border-gray-700"
        } rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error.message}
      </p>
    )}
  </div>
);

export default UserSignup;
