import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUserProfile } from "../lib/api";
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  GlobeIcon,
  LinkIcon,
  LoaderIcon,
  MapPinIcon,
  PencilIcon,
  RefreshCwIcon,
  SaveIcon,
  SparklesIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { LANGUAGES } from "../constants";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import usePageTitle from "../hooks/usePageTitle";

const AVATAR_COLLECTIONS = [
  { name: "Avataaars", style: "avataaars" },
  { name: "Adventurer", style: "adventurer" },
  { name: "Bottts", style: "bottts" },
  { name: "Lorelei", style: "lorelei" },
  { name: "Notionists", style: "notionists" },
  { name: "Fun Emoji", style: "fun-emoji" },
];

const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Liam&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Kenji&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Elena&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Marcus&backgroundColor=d1d4f9",
  "https://api.dicebear.com/9.x/bottts/svg?seed=CyberEcho&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Aaliyah&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=c0aede",
];

const TOPIC_PRESETS = [
  "Travel & Culture",
  "Technology & AI",
  "Movies & Cinema",
  "Music & Arts",
  "Food & Cooking",
  "Books & Literature",
  "Fitness & Sports",
  "Philosophy",
];

const ProfilePage = () => {
  usePageTitle("Profile & Settings — Edit Persona");

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
  });

  const [activeStyle, setActiveStyle] = useState("avataaars");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showCustomUrl, setShowCustomUrl] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([
    "Travel & Culture",
    "Technology & AI",
  ]);

  useEffect(() => {
    if (authUser) {
      setForm({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || PRESET_AVATARS[0],
      });
      setCustomUrlInput(authUser.profilePic || "");
    }
  }, [authUser]);

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile saved successfully!", { icon: "✓" });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || "Failed to update profile"
      );
    },
  });

  const handleShuffleAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);
    const bgColors = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const newAvatar = `https://api.dicebear.com/9.x/${activeStyle}/svg?seed=${randomSeed}&backgroundColor=${randomBg}`;
    setForm((prev) => ({ ...prev, profilePic: newAvatar }));
    setCustomUrlInput(newAvatar);
  };

  const handleSelectPreset = (url) => {
    setForm((prev) => ({ ...prev, profilePic: url }));
    setCustomUrlInput(url);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setForm((prev) => ({ ...prev, profilePic: customUrlInput.trim() }));
    toast.success("Custom avatar URL applied!");
  };

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    if (!form.nativeLanguage || !form.learningLanguage) {
      toast.error("Please select both your native and learning language");
      return;
    }

    if (form.nativeLanguage === form.learningLanguage) {
      toast.error("Native and learning languages cannot be identical");
      return;
    }

    updateMutation(form);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto bg-base-100 text-base-content select-none transition-colors duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 text-base-content/70 hover:text-base-content rounded-xl hover:bg-base-200 transition-colors border border-transparent hover:border-base-300"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-base-content flex items-center gap-2">
              Profile & Persona Settings
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                Public Card
              </span>
            </h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Customize your persona, avatar, languages, and conversation interests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-ghost rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="btn btn-sm btn-primary rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all"
          >
            {isPending ? (
              <>
                <LoaderIcon className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="size-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN EDITING GRID (FULLY THEME-ADAPTIVE) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: AVATAR CUSTOMIZER STUDIO (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-base-200 border border-base-300 shadow-md space-y-5 text-base-content">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2 text-base-content">
                <SparklesIcon className="size-4 text-primary" />
                <span>Avatar Studio</span>
              </h2>
              <span className="text-[10px] text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded">
                DiceBear 9.x
              </span>
            </div>

            {/* CURRENT AVATAR PREVIEW */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-base-100 border border-base-300 relative overflow-hidden shadow-xs">
              <div className="relative">
                <div className="size-24 rounded-full overflow-hidden border-2 border-primary shadow-xl bg-base-200">
                  <img
                    src={form.profilePic || PRESET_AVATARS[0]}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-[#22C55E] ring-2 ring-base-100" />
              </div>

              <p className="font-bold text-sm text-base-content mt-3">
                {form.fullName || "Your Name"}
              </p>
              <p className="text-[11px] text-base-content/60 flex items-center gap-1 mt-0.5">
                <MapPinIcon className="size-3 text-primary" />
                {form.location || "Online"}
              </p>

              {/* SHUFFLE BUTTON */}
              <button
                type="button"
                onClick={handleShuffleAvatar}
                className="btn btn-xs btn-primary gap-1.5 rounded-xl font-bold mt-3.5 shadow-xs"
              >
                <RefreshCwIcon className="size-3" />
                <span>🎲 Shuffle {activeStyle}</span>
              </button>
            </div>

            {/* STYLE FAMILY TABS */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
                Avatar Styles
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {AVATAR_COLLECTIONS.map((c) => (
                  <button
                    key={c.style}
                    type="button"
                    onClick={() => {
                      setActiveStyle(c.style);
                      const seed = Math.random().toString(36).substring(2, 9);
                      const newUrl = `https://api.dicebear.com/9.x/${c.style}/svg?seed=${seed}&backgroundColor=b6e3f4`;
                      setForm((prev) => ({ ...prev, profilePic: newUrl }));
                      setCustomUrlInput(newUrl);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      activeStyle === c.style
                        ? "bg-primary text-primary-content border-primary shadow-xs"
                        : "bg-base-100 text-base-content/75 border-base-300 hover:text-base-content hover:bg-base-300"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PRESET SAMPLES */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
                Quick Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((url, i) => {
                  const isSelected = form.profilePic === url;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(url)}
                      className={`relative size-12 rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/40 scale-105"
                          : "border-base-300 opacity-75 hover:opacity-100 hover:border-primary/50 bg-base-100"
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover rounded-xl" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                          <CheckIcon className="size-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOM IMAGE URL */}
            <div className="pt-2 border-t border-base-300">
              <button
                type="button"
                onClick={() => setShowCustomUrl(!showCustomUrl)}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-bold"
              >
                <PencilIcon className="size-3" />
                <span>{showCustomUrl ? "Hide custom URL input" : "Or paste custom image link"}</span>
              </button>

              {showCustomUrl && (
                <div className="mt-2.5 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="input input-bordered input-sm w-full bg-base-100 text-base-content text-xs border-base-300 rounded-xl px-3 py-2 focus:outline-hidden focus:border-primary shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="btn btn-xs btn-primary rounded-xl font-bold px-3 shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFILE DETAILS (7 COLS - FULLY THEMED EDIT BOXES) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-base-200 border border-base-300 shadow-md space-y-5 text-base-content">
            <h2 className="text-sm font-bold flex items-center gap-2 text-base-content border-b border-base-300 pb-3">
              <UserCheckIcon className="size-4 text-primary" />
              <span>Personal Details & Language Exchange Goals</span>
            </h2>

            {/* FULL NAME EDIT BOX */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-base-content/75 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="size-3.5 text-primary" />
                <span>Full Name</span> <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="input input-bordered w-full bg-base-100 text-base-content text-sm font-semibold border-base-300 rounded-2xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
                placeholder="e.g. Alex Morgan"
              />
            </div>

            {/* LANGUAGES ROW (THEMED DROPDOWNS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NATIVE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/75 uppercase tracking-wider flex items-center gap-1">
                  <GlobeIcon className="size-3.5 text-primary" />
                  <span>Native Language (You Speak)</span>
                </label>
                <select
                  required
                  value={form.nativeLanguage}
                  onChange={(e) => setForm({ ...form, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full bg-base-100 text-base-content text-sm font-semibold border-base-300 rounded-2xl px-4 py-3.5 focus:outline-hidden focus:border-primary shadow-xs transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-base-100 text-base-content">Select native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()} className="bg-base-100 text-base-content">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* TARGET */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/75 uppercase tracking-wider flex items-center gap-1">
                  <SparklesIcon className="size-3.5 text-primary" />
                  <span>Target Language (You Practice)</span>
                </label>
                <select
                  required
                  value={form.learningLanguage}
                  onChange={(e) => setForm({ ...form, learningLanguage: e.target.value })}
                  className="select select-bordered w-full bg-base-100 text-base-content text-sm font-semibold border-base-300 rounded-2xl px-4 py-3.5 focus:outline-hidden focus:border-primary shadow-xs transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-base-100 text-base-content">Select target language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()} className="bg-base-100 text-base-content">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION EDIT BOX */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-base-content/75 uppercase tracking-wider flex items-center gap-1.5">
                <MapPinIcon className="size-3.5 text-primary" />
                <span>City & Country</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input input-bordered w-full bg-base-100 text-base-content text-sm font-semibold border-base-300 rounded-2xl px-4 py-3 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
                placeholder="e.g. Madrid, Spain"
              />
            </div>

            {/* BIO & GOALS TEXTAREA (THEMED) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-base-content/75 uppercase tracking-wider">
                  Bio & Conversation Goals
                </label>
                <span className="text-[11px] font-mono text-base-content/50 font-bold">
                  {form.bio?.length || 0}/200
                </span>
              </div>
              <textarea
                maxLength={200}
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="textarea textarea-bordered w-full bg-base-100 text-base-content text-sm border-base-300 rounded-2xl p-4 focus:outline-hidden focus:border-primary shadow-xs transition-colors leading-relaxed"
                placeholder="Tell potential language partners about your hobbies, topics you love discussing, and when you are free to practice..."
              />
            </div>

            {/* CONVERSATION TOPICS (THEMED PILLS) */}
            <div className="space-y-2 pt-2 border-t border-base-300">
              <label className="text-xs font-bold text-base-content/75 uppercase tracking-wider">
                Conversation Topics You Enjoy
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPIC_PRESETS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-content border-primary shadow-sm"
                          : "bg-base-100 text-base-content/75 border-base-300 hover:bg-base-300 hover:text-base-content"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary rounded-2xl text-sm font-bold px-8 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
