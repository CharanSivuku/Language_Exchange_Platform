import { useState } from "react";
import {
  CompassIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  LockIcon,
  MailIcon,
  MessageSquareIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import VerbaLogo from "../components/VerbaLogo";
import usePageTitle from "../hooks/usePageTitle";

const LoginPage = () => {
  usePageTitle("Sign In");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
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

      {/* MAIN CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-base-300 bg-base-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-200">
        {/* LEFT SIDE: LOGIN FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* BRAND LOGO (LARGE, PROMINENT, NO DUPLICATE TEXT) */}
            <div className="mb-8">
              <VerbaLogo size={42} showText={true} />
            </div>

            {/* HEADLINE */}
            <div className="space-y-1.5 mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-base-content/60">
                Continue your language journey and converse with native speakers.
              </p>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/25 text-xs text-error font-medium mb-6 animate-shake">
                {error.response?.data?.message || error.message || "Invalid email or password"}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <MailIcon className="size-3.5 text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="charansivuku@gmail.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="input input-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <LockIcon className="size-3.5 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="input input-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-xl px-4 py-3 pr-10 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
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
                  {isPending ? "Signing in..." : "Sign in to Verba →"}
                </button>
              </div>
            </form>
          </div>

          {/* SIGNUP LINK */}
          <div className="text-center pt-6 mt-6 border-t border-base-300">
            <p className="text-xs text-base-content/60">
              Don't have an account yet?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline ml-1">
                Create free account →
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: RICH AESTHETIC VISUAL SHOWCASE WITH BACKGROUND IMAGE */}
        <div className="hidden lg:flex w-1/2 relative p-10 flex-col justify-between border-l border-base-300 overflow-hidden">
          {/* Aesthetic High-Res Photo Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/85 to-base-200/50 pointer-events-none" />

          {/* CONTENT OVERLAY */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold shadow-xs">
              <SparklesIcon className="size-3.5" />
              <span>Real-Time Language Immersion</span>
            </div>

            <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-base-content">
              Speak beyond the textbook with native speakers around the world.
            </h2>

            {/* Language badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { lang: "Spanish", flag: "🇪🇸", native: "Español" },
                { lang: "Japanese", flag: "🇯🇵", native: "日本語" },
                { lang: "French", flag: "🇫🇷", native: "Français" },
                { lang: "German", flag: "🇩🇪", native: "Deutsch" },
                { lang: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
                { lang: "Korean", flag: "🇰🇷", native: "한국어" },
              ].map((item) => (
                <div
                  key={item.lang}
                  className="px-3 py-1.5 rounded-xl bg-base-100/80 backdrop-blur-xs border border-base-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span>{item.flag}</span>
                  <span className="text-base-content">{item.lang}</span>
                  <span className="text-base-content/50 text-[10px]">({item.native})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Feature Cards */}
          <div className="relative z-10 space-y-2.5 my-6">
            <div className="p-3.5 rounded-2xl bg-base-100/90 backdrop-blur-xs border border-base-300 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <CompassIcon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-base-content">Smart Mutual Match</p>
                  <p className="text-[11px] text-base-content/60">Paired with complementary native speakers</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-md border border-[#22C55E]/20">
                Live
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-100/90 backdrop-blur-xs border border-base-300 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <VideoIcon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-base-content">HD Video & Audio</p>
                  <p className="text-[11px] text-base-content/60">WebRTC calling with collaborative screen sharing</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-base-content/70 bg-base-200 px-2 py-0.5 rounded-md">
                Stream SDK
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-base-100/90 backdrop-blur-xs border border-base-300 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <MessageSquareIcon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-base-content">Conversation Starters</p>
                  <p className="text-[11px] text-base-content/60">Curated icebreakers and 50/50 exchange timer</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                50/50 Split
              </span>
            </div>
          </div>

          {/* USER STATS BADGE */}
          <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-base-300">
            <div className="flex -space-x-2">
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Liam&backgroundColor=b6e3f4"
                className="size-7 rounded-full border border-base-100"
                alt="Learner"
              />
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=ffd5dc"
                className="size-7 rounded-full border border-base-100"
                alt="Learner"
              />
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Kenji&backgroundColor=c0aede"
                className="size-7 rounded-full border border-base-100"
                alt="Learner"
              />
            </div>
            <div className="text-xs">
              <p className="font-bold text-base-content flex items-center gap-1">
                <UsersIcon className="size-3 text-primary" /> Active Multilingual Network
              </p>
              <p className="text-[11px] text-base-content/60">Practice anytime with real learners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
