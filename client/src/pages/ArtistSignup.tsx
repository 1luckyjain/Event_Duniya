// src/pages/ArtistSignup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  Tag,
  Video,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Music,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { STATUS } from "../utils/utils";

interface ArtistSignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  tag: string;
  bio: string;
  videoLink1: string;
  videoLink2?: string;
  videoLink3?: string;
  instagram: string;
  twitter: string;
  youtube: string;
  facebook: string;
  tiktok: string;
}

const ArtistSignup: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<ArtistSignupFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phoneNumber: "",
      tag: "",
      bio: "",
      videoLink1: "",
      videoLink2: "",
      videoLink3: "",
      instagram: "",
      twitter: "",
      youtube: "",
      facebook: "",
      tiktok: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { login, setAuthenticationStatus } = useAuth();

  // States for the three image uploads
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [image1Url, setImage1Url] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to upload a file using your presigned URL endpoint
  const uploadFile = async (
    file: File,
    field: "avatar" | "image" | "image1"
  ) => {
    const API_URL = import.meta.env.VITE_API_URL || "https://eventduniya-server.onrender.com";
    try {
      setIsLoading(true);
      // Request a presigned URL from the backend
      const res = await fetch(`${API_URL}/api/image/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: file.name,
          imageType: file.type,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to get upload URL. Status: ${res.status}. Response: ${text}`
        );
      }

      const data = await res.json();
      if (!data.uploadUrl) {
        throw new Error("Could not get upload URL");
      }

      // Upload file directly to S3 using the presigned URL
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to S3");
      }

      // Update the corresponding state with the returned image URL
      if (field === "avatar") {
        setAvatarUrl(data.imageUrl);
      } else if (field === "image") {
        setImageUrl(data.imageUrl);
      } else if (field === "image1") {
        setImage1Url(data.imageUrl);
      }
      
      setUploadError(null);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setUploadError(err.message || "Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for file input changes
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "image" | "image1"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file, field);
    }
  };

  const onSubmit = async (values: ArtistSignupFormValues) => {
    // Ensure passwords match
    if (values.password !== values.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Check if at least one image is uploaded
    if (!avatarUrl && !imageUrl && !image1Url) {
      setErrorMessage("Please upload at least one profile image");
      return;
    }

    // Collect all uploaded image URLs into an array
    const avatars = [avatarUrl, imageUrl, image1Url].filter((url) => url);

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setAuthenticationStatus(STATUS.PENDING);
      
      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      
      // Use the dedicated artist signup endpoint
      const response = await axios.post(
        `${API_URL}/api/artist/signup`,
        {
          username: values.username,
          email: values.email,
          password: values.password,
          avatars,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode,
          phoneNumber: values.phoneNumber,
          tag: values.tag,
          bio: values.bio,
          videoLink1: values.videoLink1,
          videoLink2: values.videoLink2 || "",
          videoLink3: values.videoLink3 || "",
          instagram: values.instagram,
          twitter: values.twitter || "",
          youtube: values.youtube || "",
          facebook: values.facebook || "",
          tiktok: values.tiktok || "",
        },
        {withCredentials: true}
      );
      
      setAuthenticationStatus(STATUS.SUCCEEDED);
      const { user, token, expiresAt } = response.data;
      login(user, token, expiresAt);
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthenticationStatus(STATUS.FAILED);
      
      // Extract detailed error message from response if available
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden text-white">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Join Our EventDuniya
            </h1>
            <p className="text-purple-100 text-lg">
              Showcase your talent to the world
            </p>
          </div>

          {/* Error message display */}
          {errorMessage && (
            <div className="bg-red-900/30 border-l-4 border-red-500 p-4 m-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                <p className="text-red-400">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-white">
                      Personal Information
                    </h2>
                  </div>

                  <InputField
                    icon={<User size={18} className="text-gray-400" />}
                    label="Username"
                    id="username"
                    register={register}
                    error={errors.username}
                    validation={{ required: "Username is required" }}
                    placeholder="ArtistName123"
                  />

                  <InputField
                    icon={<Mail size={18} className="text-gray-400" />}
                    label="Email"
                    id="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address"
                      }
                    }}
                    placeholder="artist@example.com"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-white">Security</h2>
                  </div>

                  <InputField
                    icon={<Lock size={18} className="text-gray-400" />}
                    label="Password"
                    id="password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    }}
                    placeholder="••••••••"
                  />

                  <InputField
                    icon={<Lock size={18} className="text-gray-400" />}
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    register={register}
                    error={errors.confirmPassword}
                    validation={{
                      required: "Please confirm your password",
                      validate: (value: string) =>
                        value === getValues("password") || "Passwords do not match"
                    }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Location Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-white">Location Details</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      id="city"
                      register={register}
                      error={errors.city}
                      validation={{ required: "City is required" }}
                      placeholder="e.g. New York"
                    />

                    <InputField
                      label="State"
                      id="state"
                      register={register}
                      error={errors.state}
                      validation={{ required: "State is required" }}
                      placeholder="e.g. New York"
                    />
                  </div>

                  <InputField
                    label="Country"
                    id="country"
                    register={register}
                    error={errors.country}
                    validation={{ required: "Country is required" }}
                    placeholder="e.g. United States"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Pincode"
                      id="pincode"
                      register={register}
                      error={errors.pincode}
                      validation={{ required: "Pincode is required" }}
                      placeholder="e.g. 10001"
                    />

                    <InputField
                      icon={<Phone size={18} className="text-gray-400" />}
                      label="Phone Number"
                      id="phoneNumber"
                      register={register}
                      error={errors.phoneNumber}
                      validation={{ required: "Phone number is required" }}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                {/* Artist Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Music className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-white">Artist Profile</h2>
                  </div>

                  <InputField
                    icon={<Tag size={18} className="text-gray-400" />}
                    label="Tagline"
                    id="tag"
                    register={register}
                    error={errors.tag}
                    validation={{ required: "Tagline is required" }}
                    placeholder="e.g. Contemporary Painter"
                  />

                  <div className="relative">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      {...register("bio", { 
                        required: "Bio is required",
                        maxLength: {
                          value: 1000,
                          message: "Bio cannot exceed 1000 characters"
                        }
                      })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe your artistic journey..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Images Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Music className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-white">Profile Images</h2>
                  <p className="text-sm text-gray-400">(Upload at least one image)</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Avatar Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Avatar Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "avatar")}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-600 file:text-white
                        hover:file:bg-purple-700"
                      disabled={isLoading}
                    />
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Avatar Preview"
                        className="mt-2 h-20 object-contain rounded"
                      />
                    )}
                  </div>
                  {/* Second Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Second Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-600 file:text-white
                        hover:file:bg-purple-700"
                      disabled={isLoading}
                    />
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Second Image Preview"
                        className="mt-2 h-20 object-contain rounded"
                      />
                    )}
                  </div>
                  {/* Third Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Third Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image1")}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-600 file:text-white
                        hover:file:bg-purple-700"
                      disabled={isLoading}
                    />
                    {image1Url && (
                      <img
                        src={image1Url}
                        alt="Third Image Preview"
                        className="mt-2 h-20 object-contain rounded"
                      />
                    )}
                  </div>
                </div>
                {uploadError && (
                  <p className="text-red-500 text-sm">{uploadError}</p>
                )}
              </div>

              {/* Video Links Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-700 pb-2">
                  <Video className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-white">Portfolio Videos</h2>
                </div>

                <InputField
                  label="Video Link 1 (Required)"
                  id="videoLink1"
                  register={register}
                  error={errors.videoLink1}
                  validation={{ required: "At least one video link is required" }}
                  placeholder="YouTube/Vimeo link"
                />

                <InputField
                  label="Video Link 2 (Optional)"
                  id="videoLink2"
                  register={register}
                  placeholder="YouTube/Vimeo link"
                />

                <InputField
                  label="Video Link 3 (Optional)"
                  id="videoLink3"
                  register={register}
                  placeholder="YouTube/Vimeo link"
                />
              </div>

              {/* Social Media Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-700 pb-2">
                  <Instagram className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-white">Social Profiles</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    icon={<Instagram size={18} className="text-gray-400" />}
                    label="Instagram"
                    id="instagram"
                    register={register}
                    error={errors.instagram}
                    validation={{ required: "Instagram handle is required" }}
                    placeholder="@yourhandle"
                  />

                  <InputField
                    icon={<Twitter size={18} className="text-gray-400" />}
                    label="Twitter (Optional)"
                    id="twitter"
                    register={register}
                    placeholder="@yourhandle"
                  />

                  <InputField
                    icon={<Youtube size={18} className="text-gray-400" />}
                    label="YouTube (Optional)"
                    id="youtube"
                    register={register}
                    placeholder="Channel URL"
                  />

                  <InputField
                    icon={<Facebook size={18} className="text-gray-400" />}
                    label="Facebook (Optional)"
                    id="facebook"
                    register={register}
                    placeholder="Profile URL"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                  {isLoading ? "Processing..." : "Complete Artist Registration"}
                </button>

                <p className="text-center text-gray-400 mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-500 font-semibold hover:underline hover:text-purple-400"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
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
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        id={id}
        type={type}
        {...register(id, validation)}
        placeholder={placeholder}
        className={`w-full px-4 ${icon ? "pl-10" : "pl-4"} py-3 bg-gray-800 border ${
          error ? "border-red-500" : "border-gray-700"
        } rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
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

export default ArtistSignup;
