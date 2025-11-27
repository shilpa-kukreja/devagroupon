"use client";
import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Password requirements
  const passwordRequirements = [
    { id: 1, text: "At least 6 characters", met: password.length >= 6 },
    { id: 2, text: "Passwords match", met: password === confirmPassword && confirmPassword !== "" },
  ];

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenValid(false);
      setMessage("Invalid or missing reset token.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate passwords
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token, 
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage("Password reset successfully! Redirecting to login...");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Failed to reset password. The link may have expired.");
        if (data.message?.includes("expired") || data.message?.includes("invalid")) {
          setTokenValid(false);
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setIsSuccess(false);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
        
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl  p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
          <p className="text-gray-600">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-lime-500 hover:bg-lime-600 transition-colors"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl mt-24 p-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="text-2xl font-bold text-gray-900">
              <span className="font-serif">Beagley</span>{" "}
              <span className="font-serif text-lime-600">Copperman</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create New Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && message && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-800">{message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {!isSuccess && message && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">{message}</p>
          </div>
        )}

        {/* Password Requirements */}
        {!isSuccess && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h3>
            <ul className="space-y-1">
              {passwordRequirements.map((req) => (
                <li key={req.id} className="flex items-center text-sm">
                  {req.met ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300 mr-2" />
                  )}
                  <span className={req.met ? "text-green-600" : "text-gray-500"}>
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || password.length < 6 || password !== confirmPassword}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-lime-600 hover:text-lime-700 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}