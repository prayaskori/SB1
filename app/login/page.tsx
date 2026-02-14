"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Bookmark, Shield, Zap, Globe, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your bookmarks are protected with row-level security.",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Changes appear instantly across all your open tabs.",
  },
  {
    icon: Globe,
    title: "Access Anywhere",
    description: "Your bookmarks live in the cloud, available on any device.",
  },
];

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const googleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes("provider is not enabled")) {
        setError(
          "Google login is disabled for this Supabase project. Use email login below or enable Google in Supabase Auth > Providers."
        );
      } else {
        setError(error.message);
      }
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);
    setEmailSent(false);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setEmailLoading(false);
      return;
    }

    setEmailSent(true);
    setEmailLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Bookmarks
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white xl:text-5xl">
            Your bookmarks,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              always in sync.
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
            A beautifully simple bookmark manager that keeps your links
            organized and synchronized in real-time across all your devices.
          </p>

          <div className="mt-12 space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - login */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl shadow-gray-200/50 dark:shadow-none dark:border dark:border-gray-800">
            <CardContent className="p-8">
              {/* Mobile branding */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                  <Bookmark className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Smart Bookmarks
                </h1>
              </div>

              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Welcome back
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Sign in to access your bookmarks
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {googleEnabled && (
                <Button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || emailLoading}
                  variant="outline"
                  className="w-full h-12 text-base gap-3 border-gray-300 dark:border-gray-700"
                >
                  {googleLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {googleLoading ? "Redirecting..." : "Continue with Google"}
                </Button>
              )}

              <form onSubmit={handleEmailLogin} className="mt-4 space-y-3">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  disabled={emailLoading || googleLoading}
                  className="w-full h-12 text-base gap-2"
                >
                  {emailLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  {emailLoading ? "Sending link..." : "Continue with Email"}
                </Button>
              </form>

              {emailSent && (
                <p className="mt-3 text-sm text-green-700 dark:text-green-400">
                  Check your email for the sign-in link.
                </p>
              )}

              <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
