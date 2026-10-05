import { useState } from "react";
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  LockIcon,
  MailIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
import VerbaLogo from "../components/VerbaLogo";
import usePageTitle from "../hooks/usePageTitle";

const SignUpPage = () => {
  usePageTitle("Create Account");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="relative min-h-screen bg-base-100 text-base-content flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      {/* AESTHETIC GLOBAL NETWORK AMBIENT BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-base-300 bg-base-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-200">
        {/* LEFT SIDE: SIGNUP FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* BRAND LOGO (LARGE, PROMINENT, NO DUPLICATE TEXT) */}
            <div className="mb-6">
              <VerbaLogo size={42} showText={true} />
            </div>

            {/* HEADLINE */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-base-content/60">
                Join our worldwide language exchange community today.
              </p>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/25 text-xs text-error font-medium mb-5 animate-shake">
                {error.response?.data?.message || error.message || "Failed to create account"}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-3.5">
              {/* FULL NAME */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <UserIcon className="size-3.5 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  className="input input-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <MailIcon className="size-3.5 text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="input input-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <LockIcon className="size-3.5 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="input input-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-xl px-4 py-3 pr-10 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary w-full text-sm font-bold !py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
                >
                  {isPending ? "Creating account..." : "Create free account →"}
                </button>
              </div>
            </form>
          </div>

          {/* SIGN IN LINK */}
          <div className="text-center pt-5 mt-5 border-t border-base-300">
            <p className="text-xs text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline ml-1">
                Log in →
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: AESTHETIC VISUAL BACKGROUND & HERO FEATURES */}
        <div className="hidden lg:flex w-1/2 relative p-10 flex-col justify-between border-l border-base-300 overflow-hidden">
          {/* Aesthetic High-Res Photo Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/85 to-base-200/50 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold shadow-xs">
              <GlobeIcon className="size-3.5" />
              <span>Real Conversations. Real Fluency.</span>
            </div>

            <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-base-content">
              Start speaking from day one with verified native learners.
            </h2>

            {/* Feature list */}
            <div className="space-y-3 pt-2">
              {[
                {
                  title: "Smart Mutual Matchmaking",
                  desc: "Pair with someone whose native language matches your goals.",
                },
                {
                  title: "Crystal-Clear Video & Screen Share",
                  desc: "Practice together face-to-face with Stream SDK technology.",
                },
                {
                  title: "Live Real-Time Messaging",
                  desc: "Text, react, and share resources with persistent chat history.",
                },
                {
                  title: "Encouraging Community",
                  desc: "Safe, supportive environment dedicated to spoken fluency.",
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-100/90 backdrop-blur-xs border border-base-300 shadow-xs"
                >
                  <div className="size-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2Icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-base-content">{feat.title}</h3>
                    <p className="text-[11px] text-base-content/60 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER BADGE */}
          <div className="relative z-10 flex items-center justify-between text-xs text-base-content/60 pt-6 border-t border-base-300">
            <span>🌍 50+ Languages Supported</span>
            <span>⚡ Instant WebRTC Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
