import { Link } from "react-router";
import {
  CheckCircle2Icon,
  CompassIcon,
  GlobeIcon,
  LightbulbIcon,
  MessageSquareIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import VerbaLogo from "../components/VerbaLogo";
import ThemeSelector from "../components/ThemeSelector";
import usePageTitle from "../hooks/usePageTitle";

const LandingPage = () => {
  usePageTitle("Real Conversations. Real Fluency.");

  const LANGUAGES_LIST = [
    { name: "Telugu", flag: "🇮🇳", native: "తెలుగు", learners: "Hyderabad, Visakhapatnam, Vijayawada" },
    { name: "Spanish", flag: "🇪🇸", native: "Español", learners: "Madrid, Mexico City, Bogota" },
    { name: "French", flag: "🇫🇷", native: "Français", learners: "Paris, Montreal, Dakar" },
    { name: "Japanese", flag: "🇯🇵", native: "日本語", learners: "Tokyo, Osaka, Kyoto" },
    { name: "German", flag: "🇩🇪", native: "Deutsch", learners: "Berlin, Vienna, Zurich" },
    { name: "Hindi", flag: "🇮🇳", native: "हिन्दी", learners: "New Delhi, Mumbai, Varanasi" },
    { name: "Korean", flag: "🇰🇷", native: "한국어", learners: "Seoul, Busan, Incheon" },
    { name: "Tamil", flag: "🇮🇳", native: "தமிழ்", learners: "Chennai, Coimbatore, Madurai" },
    { name: "Italian", flag: "🇮🇹", native: "Italiano", learners: "Rome, Florence, Milan" },
    { name: "Portuguese", flag: "🇧🇷", native: "Português", learners: "São Paulo, Lisbon, Rio" },
    { name: "Arabic", flag: "🇸🇦", native: "العربية", learners: "Dubai, Cairo, Riyadh" },
    { name: "Bengali", flag: "🇧🇩", native: "বাংলা", learners: "Dhaka, Kolkata, Chittagong" },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content select-none overflow-x-hidden transition-colors duration-200">
      {/* 1. TOP STICKY NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-base-200/90 backdrop-blur-md border-b border-base-300">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center group transition-transform hover:scale-102">
            <VerbaLogo size={38} showText={true} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-base-content/70">
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#languages" className="hover:text-primary transition-colors">
              Languages
            </a>
            <a href="#community" className="hover:text-primary transition-colors">
              Community
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <ThemeSelector />
            <Link
              to="/login"
              className="btn btn-sm btn-ghost text-xs font-bold rounded-xl"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="btn btn-sm btn-primary text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8">
        {/* Subtle Ambient Background Highlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold shadow-xs">
          <SparklesIcon className="size-3.5" />
          <span>The Next-Generation Language Exchange Social Platform</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-base-content leading-tight">
            Speak beyond the textbook with{" "}
            <span className="text-primary underline decoration-primary/40 underline-offset-8">
              native speakers
            </span>{" "}
            worldwide.
          </h1>
          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Ditch robotic vocabulary apps. Practice real fluency through instant 1-on-1 video calls, curated icebreakers, and a worldwide community of friendly peers.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/signup"
            className="btn btn-primary btn-md rounded-2xl text-sm font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 px-8"
          >
            <CompassIcon className="size-4" />
            <span>Join Free & Find a Partner →</span>
          </Link>
          <Link
            to="/login"
            className="btn btn-ghost border border-base-300 btn-md rounded-2xl text-sm font-bold hover:bg-base-200 px-6"
          >
            <span>Sign In to Your Account</span>
          </Link>
        </div>

        {/* Real Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-base-200 border border-base-300 shadow-sm">
            <p className="text-2xl font-black text-primary">100% Free</p>
            <p className="text-xs text-base-content/60 font-semibold mt-0.5">Peer-to-Peer Exchange</p>
          </div>
          <div className="p-4 rounded-2xl bg-base-200 border border-base-300 shadow-sm">
            <p className="text-2xl font-black text-base-content">50+ Global</p>
            <p className="text-xs text-base-content/60 font-semibold mt-0.5">Languages Represented</p>
          </div>
          <div className="p-4 rounded-2xl bg-base-200 border border-base-300 shadow-sm">
            <p className="text-2xl font-black text-primary">1-on-1</p>
            <p className="text-xs text-base-content/60 font-semibold mt-0.5">Instant Match Roulette</p>
          </div>
          <div className="p-4 rounded-2xl bg-base-200 border border-base-300 shadow-sm">
            <p className="text-2xl font-black text-base-content">HD Video</p>
            <p className="text-xs text-base-content/60 font-semibold mt-0.5">Stream SDK Calling</p>
          </div>
        </div>

        {/* INTERACTIVE MOCKUP SHOWCASE */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-base-200 border border-base-300 p-4 sm:p-6 shadow-2xl overflow-hidden text-left">
            {/* Background Atmosphere */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop')`,
              }}
            />

            {/* Mockup Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-error" />
                  <span className="size-3 rounded-full bg-warning" />
                  <span className="size-3 rounded-full bg-success" />
                </div>
                <span className="text-xs font-mono font-bold text-base-content/60">
                  Verba Live Immersion Lounge
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-xl">
                <span>08:45</span>
                <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
              </div>
            </div>

            {/* Split Video Call Simulation */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="relative rounded-2xl bg-base-300 h-52 overflow-hidden flex flex-col justify-between p-3 border border-base-content/10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                  alt="Elena from Madrid"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <span className="relative z-10 self-start text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span>🇪🇸</span> Elena (Madrid, Spain)
                </span>
                <span className="relative z-10 self-end text-[10px] font-bold text-primary bg-base-100/90 px-2 py-0.5 rounded-md">
                  Native Speaker
                </span>
              </div>

              <div className="relative rounded-2xl bg-base-300 h-52 overflow-hidden flex flex-col justify-between p-3 border border-base-content/10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
                  alt="Marcus from London"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <span className="relative z-10 self-start text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span>🇬🇧</span> Marcus (London, UK)
                </span>
                <span className="relative z-10 self-end text-[10px] font-bold text-[#22C55E] bg-base-100/90 px-2 py-0.5 rounded-md">
                  Learning Spanish
                </span>
              </div>
            </div>

            {/* Built-in Icebreaker Simulation */}
            <div className="relative z-10 p-3.5 rounded-xl bg-base-100/90 border border-base-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <LightbulbIcon className="size-4 text-primary shrink-0" />
                <span className="font-medium text-base-content">
                  Today's Icebreaker: "What's the best street food dish in your hometown?"
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                50/50 Split
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Simple 3-Step Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-base-content">
            How Verba Works
          </h2>
          <p className="text-sm text-base-content/60 max-w-md mx-auto">
            Achieve genuine spoken fluency faster than traditional classroom memorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-base-200 border border-base-300 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-base-content">Set Your Languages</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Select what you speak natively and the language you dream of mastering. Customize your persona with our 6-style avatar studio.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-base-200 border border-base-300 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-base-content">Smart Mutual Match</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Our matchmaking engine pairs you with a partner where each person is a native speaker of what the other wants to learn.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-base-200 border border-base-300 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-base-content">Converse in Real Time</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Jump into live WebRTC video & audio. Curated icebreaker cards eliminate awkward silences, while built-in timers balance speaking time.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LANGUAGES SECTION */}
      <section id="languages" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Global Exchange Network
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-base-content">
            Languages You Can Practice Today
          </h2>
          <p className="text-sm text-base-content/60 max-w-md mx-auto">
            Find conversation partners across every continent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LANGUAGES_LIST.map((lang) => (
            <div
              key={lang.name}
              className="p-5 rounded-2xl bg-base-200 border border-base-300 hover:border-primary/40 hover:-translate-y-1 transition-all shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <p className="font-bold text-sm text-base-content">{lang.name}</p>
                </div>
                <p className="text-[11px] text-base-content/50">{lang.learners}</p>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMMUNITY TESTIMONIALS */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Loved by Polyglots
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-base-content">
            Real Stories From Real Learners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-base-200 border border-base-300 space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-warning">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-base-content/80 leading-relaxed italic">
              "I studied Spanish on apps for 2 years without being able to speak a sentence. On Verba, I had my first 20-minute conversation with Sofia in Madrid on my very first day!"
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="size-8 rounded-full overflow-hidden bg-base-300">
                <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Liam" alt="Liam" />
              </div>
              <div>
                <p className="font-bold text-xs text-base-content">Liam R.</p>
                <p className="text-[10px] text-base-content/50">Learning Spanish</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-base-200 border border-base-300 space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-warning">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-base-content/80 leading-relaxed italic">
              "The 50/50 speech split and random roulette make it feel like an adventure. Kenji helped me understand Japanese conversational cadence so naturally."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="size-8 rounded-full overflow-hidden bg-base-300">
                <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Aaliyah" alt="Aaliyah" />
              </div>
              <div>
                <p className="font-bold text-xs text-base-content">Aaliyah K.</p>
                <p className="text-[10px] text-base-content/50">Learning Japanese</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-base-200 border border-base-300 space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-warning">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-base-content/80 leading-relaxed italic">
              "I love that there are zero black bars or broken themes. The UI looks as clean as Raycast and Linear, making daily practice something I actually look forward to."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="size-8 rounded-full overflow-hidden bg-base-300">
                <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Marcus" alt="Marcus" />
              </div>
              <div>
                <p className="font-bold text-xs text-base-content">Marcus D.</p>
                <p className="text-[10px] text-base-content/50">Learning French</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL HIGH-CONVERTING CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-base-200 to-base-200 border border-primary/30 p-8 sm:p-14 space-y-6 shadow-2xl">
          <div className="size-16 rounded-3xl bg-primary text-primary-content flex items-center justify-center mx-auto shadow-xl shadow-primary/30">
            <GlobeIcon className="size-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
              Ready to speak fluently?
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Join language learners worldwide and have your first real conversation in minutes. 100% free peer exchange.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/signup"
              className="btn btn-primary btn-md rounded-2xl text-sm font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 px-8 w-full sm:w-auto"
            >
              <span>Create Your Free Account →</span>
            </Link>
            <Link
              to="/login"
              className="btn btn-ghost border border-base-300 btn-md rounded-2xl text-sm font-bold hover:bg-base-300 px-6 w-full sm:w-auto"
            >
              <span>Already have an account? Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-base-300 py-10 bg-base-200 text-base-content/60 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <VerbaLogo size={32} showText={true} />
          </div>
          <p>© {new Date().getFullYear()} Verba. Real conversations. Real fluency.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
