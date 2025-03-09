import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { STATUS } from "../utils/utils";
import { useAuth } from "../context/auth-context";
import { GoogleLogin } from "@react-oauth/google";

interface LoginFormValues {
  username: string;
  password: string;
  role: string;
}

const Login: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      setAuthenticationStatus(STATUS.PENDING);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          username: values.username,
          password: values.password,
          role: values.role,
        },
        { withCredentials: true }
      );

      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user: userObj, token, expiresAt } = response.data;
      login(userObj, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      setAuthenticationStatus(STATUS.FAILED);
      setErrorMessage(error.response?.data?.error || "Login failed");
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
      setErrorMessage(error.response?.data?.error || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    setErrorMessage("Google sign in was unsuccessful. Please try again.");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-purple-100">Sign in to continue</p>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("username", { required: "This field is required" })}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.username ? "border-red-500" : "border-gray-700"
                    } rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-700"
                    } rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <div className="relative">
                  <select
                    {...register("role", { required: "Role is required" })}
                    className={`w-full pl-3 pr-4 py-3 border ${
                      errors.role ? "border-red-500" : "border-gray-700"
                    } rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  >
                    <option value="">Select role</option>
                    <option value="user">User</option>
                    <option value="artist">Artist</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Sign In
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
                text="signin_with"
                size="large"
                logo_alignment="center"
                useOneTap
              />
            </div>
          </div>

          <div className="text-center space-y-4 mt-6">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Forgot password?
            </Link>
            
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:underline hover:text-purple-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;