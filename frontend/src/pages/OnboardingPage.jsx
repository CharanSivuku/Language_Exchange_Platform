import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  CheckIcon,
  GlobeIcon,
  LinkIcon,
  MapPinIcon,
  RefreshCwIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import VerbaLogo from "../components/VerbaLogo";
import usePageTitle from "../hooks/usePageTitle";

const AVATAR_COLLECTIONS = [
  { name: "Avataaars", style: "avataaars" },
  { name: "Adventurer", style: "adventurer" },
  { name: "Bottts", style: "bottts" },
  { name: "Lorelei", style: "lorelei" },
  { name: "Notionists", style: "notionists" },
  { name: "Fun Emoji", style: "fun-emoji" },
];

const PRESETS_BY_STYLE = {
  avataaars: [
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Liam&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Kenji&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Maria&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Amara&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Lucas&backgroundColor=b6e3f4",
  ],
  adventurer: [
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Elena&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Marcus&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Chloe&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Diego&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Zara&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix&backgroundColor=ffdfbf",
  ],
  bottts: [
    "https://api.dicebear.com/9.x/bottts/svg?seed=CyberEcho&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/bottts/svg?seed=NeoSpark&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/bottts/svg?seed=PixelBot&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/bottts/svg?seed=RoboFlow&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/bottts/svg?seed=Voxel&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/bottts/svg?seed=NanoByte&backgroundColor=b6e3f4",
  ],
  lorelei: [
    "https://api.dicebear.com/9.x/lorelei/svg?seed=Aaliyah&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/lorelei/svg?seed=Julian&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/lorelei/svg?seed=Seraphina&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/lorelei/svg?seed=Dante&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/lorelei/svg?seed=Mei&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/lorelei/svg?seed=Leo&backgroundColor=b6e3f4",
  ],
  notionists: [
    "https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Freya&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Kai&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Sora&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Maya&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Theo&backgroundColor=c0aede",
  ],
  "fun-emoji": [
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=StarEyes&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=CoolKid&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=PartyVibe&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Smiley&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=HappyWink&backgroundColor=d1d4f9",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=SunnyDay&backgroundColor=b6e3f4",
  ],
};

const OnboardingPage = () => {
  usePageTitle("Profile Setup — Choose Your Persona");

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [activeStyle, setActiveStyle] = useState("avataaars");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || PRESETS_BY_STYLE.avataaars[0],
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile setup complete! Welcome to Verba.", { icon: "🎉" });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || "Failed to complete onboarding");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formState.nativeLanguage || !formState.learningLanguage) {
      toast.error("Please select both your native and target learning language");
      return;
    }
    if (formState.nativeLanguage === formState.learningLanguage) {
      toast.error("Your native and learning languages cannot be identical");
      return;
    }
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);
    const bgColors = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const generated = `https://api.dicebear.com/9.x/${activeStyle}/svg?seed=${randomSeed}&backgroundColor=${randomBg}`;

    setFormState({ ...formState, profilePic: generated });
    setCustomUrlInput(generated);
    toast.success("Generated new avatar!", { icon: "✨" });
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setFormState({ ...formState, profilePic: customUrlInput.trim() });
    toast.success("Custom avatar applied!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-base-100 text-base-content select-none transition-colors duration-200">
      <div className="w-full max-w-3xl p-6 sm:p-10 rounded-3xl bg-base-200 border border-base-300 shadow-2xl space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <VerbaLogo size={42} showText={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
            Setup Your Learner Profile
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-md mx-auto leading-relaxed">
            Choose your persona and languages so we can pair you with native speakers worldwide.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* COMPLETE 6-STYLE AVATAR STUDIO */}
          <div className="p-5 bg-base-300/60 rounded-3xl border border-base-content/10 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <CameraIcon className="size-4 text-primary" />
                <span>Avatar Customizer Studio</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomUrl(!showCustomUrl)}
                className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <LinkIcon className="size-3" />
                <span>{showCustomUrl ? "Show Presets" : "Paste Custom URL"}</span>
              </button>
            </div>

            {/* PREVIEW + CONTROLS ROW */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* CURRENT AVATAR LARGE PREVIEW */}
              <div className="relative size-24 rounded-3xl overflow-hidden border-2 border-primary/40 bg-base-200 shrink-0 shadow-md">
                <img
                  src={formState.profilePic}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* STYLE TABS & RANDOMIZER */}
              <div className="flex-1 space-y-3 w-full">
                {/* 6 STYLE TABS */}
                <div className="flex flex-wrap gap-1.5">
                  {AVATAR_COLLECTIONS.map((c) => (
                    <button
                      key={c.style}
                      type="button"
                      onClick={() => {
                        setActiveStyle(c.style);
                        const first = PRESETS_BY_STYLE[c.style][0];
                        setFormState({ ...formState, profilePic: first });
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        activeStyle === c.style
                          ? "bg-primary text-primary-content shadow-xs"
                          : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* PRESET AVATARS FOR SELECTED STYLE */}
                {!showCustomUrl ? (
                  <div className="flex flex-wrap gap-2 items-center">
                    {PRESETS_BY_STYLE[activeStyle]?.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormState({ ...formState, profilePic: avatar })}
                        className={`size-11 rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                          formState.profilePic === avatar
                            ? "border-primary ring-2 ring-primary/40 scale-105"
                            : "border-base-content/15 opacity-75 hover:opacity-100 hover:border-primary/40"
                        }`}
                      >
                        <img src={avatar} alt={`Preset ${idx}`} className="w-full h-full rounded-xl" />
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={handleRandomAvatar}
                      className="btn btn-xs btn-primary gap-1 rounded-xl px-2.5 shadow-xs font-bold"
                    >
                      <RefreshCwIcon className="size-3" />
                      <span>Shuffle</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste any SVG / image URL..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 input input-bordered input-sm bg-base-100 text-base-content text-xs px-3.5 py-2 rounded-xl border-base-300 focus:outline-hidden focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="btn btn-xs btn-primary rounded-xl font-bold"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
              <UserIcon className="size-3.5 text-primary" />
              Full Name
            </label>
            <input
              type="text"
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              className="input input-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-2xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
              placeholder="Your full name"
              required
            />
          </div>

          {/* BIO */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/75">
              About You & Conversation Goals
            </label>
            <textarea
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="textarea textarea-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-2xl p-3.5 focus:outline-hidden focus:border-primary shadow-xs transition-colors leading-relaxed h-20"
              placeholder="E.g., Architect in Madrid learning English for travel. Happy to practice conversational Spanish with anyone!"
              required
            />
          </div>

          {/* LANGUAGES ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NATIVE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1">
                <GlobeIcon className="size-3.5 text-primary" />
                <span>Native Language (You Speak)</span>
              </label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className="select select-bordered w-full bg-base-100 text-base-content text-sm font-semibold border-base-300 rounded-2xl px-4 py-3.5 focus:outline-hidden focus:border-primary shadow-xs cursor-pointer"
                required
              >
                <option value="" disabled className="bg-base-100 text-base-content">Select native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()} className="bg-base-100 text-base-content">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* LEARNING */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 flex items-center gap-1">
                <SparklesIcon className="size-3.5 text-primary" />
                <span>Target Language (You Learn)</span>
              </label>
              <select
                value={formState.learningLanguage}
                onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                className="select select-bordered w-full bg-base-100 text-base-content text-sm font-semibold border-base-300 rounded-2xl px-4 py-3.5 focus:outline-hidden focus:border-primary shadow-xs cursor-pointer"
                required
              >
                <option value="" disabled className="bg-base-100 text-base-content">Select language to practice</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()} className="bg-base-100 text-base-content">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 text-primary" />
              City & Country
            </label>
            <input
              type="text"
              value={formState.location}
              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
              className="w-full bg-base-300/70 text-base-content text-sm border border-base-300 rounded-2xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
              placeholder="e.g. Madrid, Spain"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full text-sm font-bold !py-3.5 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
            >
              {isPending ? "Setting up profile..." : "Start Practicing on Verba →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
