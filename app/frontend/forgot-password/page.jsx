"use client";
import { useState } from "react";
import { Mail, ArrowLeft, Loader, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage("If the email exists, a password reset link has been sent. Please check your inbox.");
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setIsSuccess(false);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl pt-10 sm:p-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="text-2xl font-bold text-gray-900">
              <span className="font-serif">Beagley</span>{" "}
              <span className="font-serif text-lime-600">Copperman</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Back to Login */}
        {/* <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-lime-600 hover:text-lime-700 font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Login
          </Link>
        </div> */}

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

        {/* Form */}
        {!isSuccess && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                  placeholder="Enter your business email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="mailto:support@beagleycopperman.com"
              className="font-medium text-lime-600 hover:text-lime-500"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
      </div>
     <Footer />

    </div>
  );
}