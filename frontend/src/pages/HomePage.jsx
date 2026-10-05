import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  getOutgoingFriendReqs,
  getPlatformStats,
  getRecommendedUsers,
  getUserFriends,
  removeFriend,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckIcon,
  CompassIcon,
  GlobeIcon,
  MapPinIcon,
  MessageSquareIcon,
  SearchIcon,
  SparklesIcon,
  UserPlusIcon,
  UsersIcon,
  VideoIcon,
  UserMinusIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import useAuthUser from "../hooks/useAuthUser";
import usePageTitle from "../hooks/usePageTitle";
import toast from "react-hot-toast";

const HomePage = () => {
  usePageTitle("Home — Speak Beyond the Textbook");

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [activeFilterTab, setActiveFilterTab] = useState("all"); // 'all', 'mutual', 'native'
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Real Database Data Queries
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5000,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    staleTime: 5000,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    staleTime: 5000,
  });

  const { data: platformStats } = useQuery({
    queryKey: ["platformStats"],
    queryFn: getPlatformStats,
    staleTime: 10000,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Partner invitation sent!", { icon: "👋" });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    },
  });

  const { mutate: removeFriendMutation } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed from your network");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove friend");
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Greeting based on user's local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = authUser?.fullName?.split(" ")[0] || "there";
  const userLearningLang = (authUser?.learningLanguage || "").toLowerCase();
  const userNativeLang = (authUser?.nativeLanguage || "").toLowerCase();

  // Dynamic list of languages represented across all loaded learners & community
  const availableLanguages = useMemo(() => {
    const set = new Set();
    recommendedUsers.forEach((u) => {
      if (u.nativeLanguage) set.add(u.nativeLanguage.toLowerCase());
      if (u.learningLanguage) set.add(u.learningLanguage.toLowerCase());
    });
    if (authUser?.nativeLanguage) set.add(authUser.nativeLanguage.toLowerCase());
    if (authUser?.learningLanguage) set.add(authUser.learningLanguage.toLowerCase());
    return Array.from(set).sort();
  }, [recommendedUsers, authUser]);

  // Robust Search & Filter Logic
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return recommendedUsers.filter((user) => {
      const uNative = (user.nativeLanguage || "").toLowerCase();
      const uLearning = (user.learningLanguage || "").toLowerCase();
      const uName = (user.fullName || "").toLowerCase();
      const uLocation = (user.location || "").toLowerCase();
      const uBio = (user.bio || "").toLowerCase();

      // Text search match across name, languages, location, bio
      const matchesSearch =
        !q ||
        uName.includes(q) ||
        uNative.includes(q) ||
        uLearning.includes(q) ||
        uLocation.includes(q) ||
        uBio.includes(q);

      if (!matchesSearch) return false;

      // Language pill filter
      if (selectedLanguageFilter !== "all") {
        const lang = selectedLanguageFilter.toLowerCase();
        if (uNative !== lang && uLearning !== lang) {
          return false;
        }
      }

      // When a search query is typed, let search show all relevant matches
      if (q) return true;

      // Tab filters when not searching
      if (activeFilterTab === "mutual") {
        return uNative === userLearningLang && uLearning === userNativeLang;
      }
      if (activeFilterTab === "native") {
        return uNative === userLearningLang;
      }
      return true;
    });
  }, [
    recommendedUsers,
    activeFilterTab,
    selectedLanguageFilter,
    searchQuery,
    userLearningLang,
    userNativeLang,
  ]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. WELCOME GREETING & REAL DATABASE PLATFORM STATS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold text-base-content/60">
              Live Database Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-base-content/70">
            Ready to practice{" "}
            <span className="text-primary font-bold underline decoration-primary/40">
              {capitialize(authUser?.learningLanguage || "your target language")}
            </span>{" "}
            with native speakers?
          </p>
        </div>

        {/* REAL METRICS ROW FROM MONGODB */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
          <div className="px-3.5 py-2 rounded-2xl bg-base-200 border border-base-300 shadow-sm flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <UsersIcon className="size-4" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] text-base-content/60 uppercase font-bold tracking-wider">
                Learners in DB
              </p>
              <p className="text-sm font-extrabold text-base-content mt-1">
                {platformStats?.totalLearners ?? recommendedUsers.length + 1}
              </p>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-base-200 border border-base-300 shadow-sm flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
              <GlobeIcon className="size-4" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] text-base-content/60 uppercase font-bold tracking-wider">
                Languages
              </p>
              <p className="text-sm font-extrabold text-base-content mt-1">
                {availableLanguages.length} Represented
              </p>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-base-200 border border-base-300 shadow-sm flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <SparklesIcon className="size-4" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] text-base-content/60 uppercase font-bold tracking-wider">
                Your Partners
              </p>
              <p className="text-sm font-extrabold text-base-content mt-1">
                {friends.length} Connected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRACTICE CIRCLE & ONLINE PARTNERS: COMPACT AVATARS + VISIBLE CHAT BUTTON */}
      <section className="p-5 rounded-3xl bg-base-200 border border-base-300 shadow-sm space-y-3.5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-base-content">
              Practice Circle & Connected Friends
            </h2>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">
              {friends.length} Active
            </span>
          </div>

          <Link
            to="/messages"
            className="text-xs text-primary hover:underline font-semibold transition-colors"
          >
            All messages →
          </Link>
        </div>

        {/* HORIZONTAL SCROLL OF PARTNER CARDS */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-2">
          {/* Quick Match Action Card */}
          <Link
            to="/match"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary shrink-0 transition-all hover:scale-102 w-28 text-center"
            title="Instant Roulette Match"
          >
            <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <CompassIcon className="size-5" />
            </div>
            <span className="text-[11px] font-bold text-primary">
              + Find Partner
            </span>
          </Link>

          {/* Friends List with COMPACT AVATARS & VISIBLE CHAT BUTTON */}
          {loadingFriends ? (
            <div className="flex items-center gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-base-300/60 animate-pulse w-48">
                  <div className="size-10 rounded-full bg-base-300" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-base-300 rounded w-16" />
                    <div className="h-2 bg-base-300 rounded w-10" />
                  </div>
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="flex items-center gap-3 text-xs text-base-content/60 py-3 px-2">
              <span>No partners added yet. Connect with members below to start your circle!</span>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-base-100 border border-base-300 shadow-xs hover:shadow-md hover:border-primary/40 transition-all shrink-0"
              >
                {/* Compact Avatar (size-10) with Online Beacon & Flag */}
                <div className="relative shrink-0">
                  <div className="size-10 rounded-full overflow-hidden border border-base-content/20 bg-base-300">
                    <img
                      src={friend.profilePic}
                      alt={friend.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#22C55E] ring-2 ring-base-100" />
                  <span className="absolute -top-1 -right-1 text-xs drop-shadow">
                    {getLanguageFlag(friend.nativeLanguage)}
                  </span>
                </div>

                {/* Name & Language */}
                <div className="overflow-hidden leading-tight">
                  <p className="font-bold text-xs text-base-content truncate max-w-[90px]">
                    {friend.fullName?.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-base-content/60 truncate mt-0.5">
                    {capitialize(friend.nativeLanguage || "English")}
                  </p>
                </div>

                {/* DIRECTLY VISIBLE CHAT & CALL ACTIONS */}
                <div className="flex items-center gap-1 pl-1">
                  <Link
                    to={`/chat/${friend._id}`}
                    className="btn btn-xs btn-primary gap-1 px-2.5 rounded-lg shadow-xs font-semibold"
                    title="Direct Chat"
                  >
                    <MessageSquareIcon className="size-3" />
                    <span>Chat</span>
                  </Link>
                  <Link
                    to={`/call/${friend._id}`}
                    className="btn btn-xs btn-ghost btn-circle text-base-content/70 hover:text-primary hover:bg-base-300"
                    title="Video Call"
                  >
                    <VideoIcon className="size-3" />
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${friend.fullName} from your connected partners?`)) {
                        removeFriendMutation(friend._id);
                      }
                    }}
                    className="btn btn-xs btn-ghost btn-circle text-base-content/40 hover:text-error hover:bg-error/10 transition-colors"
                    title={`Remove ${friend.fullName} from friends`}
                  >
                    <UserMinusIcon className="size-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. CAPTIVATING HERO WITH AESTHETIC BACKGROUND IMAGE & THEME SHADING */}
      <div className="relative overflow-hidden rounded-3xl bg-base-200 border border-base-300 p-6 sm:p-10 shadow-md">
        {/* Aesthetic Background Image with Gradient Mask */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-base-200 via-base-200/90 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold shadow-xs">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>Instant Conversation Roulette</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight leading-snug">
            Speak beyond the textbook with native speakers
          </h2>

          <p className="text-sm text-base-content/70 leading-relaxed">
            Practice <span className="text-base-content font-bold">{capitialize(authUser?.learningLanguage || "languages")}</span> with a live partner right now. Built-in conversation prompts, speech timer, and real-time audio & video.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/match"
              className="btn btn-primary gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 font-bold text-sm rounded-xl px-6"
            >
              <CompassIcon className="size-4" />
              <span>Find a partner now →</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <span className="size-2 rounded-full bg-[#22C55E]" />
              <span className="font-medium">
                {recommendedUsers.length} potential partners ready in database
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DISCOVER PARTNERS WITH ROBUST SEARCH AND SUB-NAV FILTERS */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-base-300 pb-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">
              Discover conversation partners
            </h2>
            <p className="text-xs text-base-content/60 mt-0.5">
              Real learners from the database available for language exchange
            </p>
          </div>

          {/* SUB-NAV FILTER TABS */}
          <div className="flex items-center gap-1.5 bg-base-200 p-1.5 rounded-2xl border border-base-300 overflow-x-auto shadow-xs">
            <button
              onClick={() => setActiveFilterTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilterTab === "all"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-300"
              }`}
            >
              All Learners ({recommendedUsers.length})
            </button>
            <button
              onClick={() => setActiveFilterTab("mutual")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeFilterTab === "mutual"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-300"
              }`}
            >
              <SparklesIcon className="size-3" />
              <span>Mutual Matches</span>
            </button>
            <button
              onClick={() => setActiveFilterTab("native")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilterTab === "native"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-300"
              }`}
            >
              Native Speakers
            </button>
          </div>
        </div>

        {/* SEARCH BAR (WORKING FULLY & RESILIENT) */}
        <div className="relative">
          <SearchIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search partners by name, language, location, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-base-200 text-base-content text-sm pl-10 pr-10 py-3 rounded-2xl border border-base-300 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-1"
              title="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* INTERACTIVE LANGUAGE FILTER CHIPS (MATCHING STATS COUNT 100%) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-base-content/65">
            <span className="font-bold flex items-center gap-1.5">
              <GlobeIcon className="size-3.5 text-primary" />
              <span>Languages in Community ({availableLanguages.length}):</span>
            </span>
            {selectedLanguageFilter !== "all" && (
              <button
                onClick={() => setSelectedLanguageFilter("all")}
                className="text-[11px] text-primary hover:underline font-bold"
              >
                Clear filter (Show all {recommendedUsers.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <button
              onClick={() => setSelectedLanguageFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedLanguageFilter === "all"
                  ? "bg-primary text-primary-content border-primary shadow-xs"
                  : "bg-base-200 text-base-content/75 border-base-300 hover:bg-base-300 hover:text-base-content"
              }`}
            >
              All Languages ({recommendedUsers.length})
            </button>

            {availableLanguages.map((lang) => {
              const count = recommendedUsers.filter((u) => {
                const nat = (u.nativeLanguage || "").toLowerCase();
                const lrn = (u.learningLanguage || "").toLowerCase();
                return nat === lang || lrn === lang;
              }).length;

              const isSelected = selectedLanguageFilter === lang;

              return (
                <button
                  key={lang}
                  onClick={() =>
                    setSelectedLanguageFilter(isSelected ? "all" : lang)
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-primary text-primary-content border-primary font-bold shadow-xs"
                      : "bg-base-200 text-base-content/80 border-base-300 hover:bg-base-300 hover:text-base-content"
                  }`}
                >
                  <span>{getLanguageFlag(lang)}</span>
                  <span>{capitialize(lang)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected
                        ? "bg-primary-content/20 text-primary-content"
                        : "bg-base-300 text-base-content/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PARTNER CARDS GRID (THEME-ADAPTIVE WITH HOVER SHADING) */}
        {loadingUsers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-base-200 border border-base-300 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-base-300" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-base-300 rounded w-28" />
                    <div className="h-2.5 bg-base-300 rounded w-20" />
                  </div>
                </div>
                <div className="h-20 bg-base-300 rounded-xl" />
                <div className="h-8 bg-base-300 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center space-y-3 max-w-md mx-auto rounded-3xl bg-base-200 border border-base-300 shadow-sm">
            <div className="size-12 rounded-2xl bg-base-300 flex items-center justify-center mx-auto text-base-content/50">
              <UsersIcon className="size-6" />
            </div>
            <h3 className="font-bold text-sm text-base-content">No learners found</h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              {searchQuery
                ? `No learners found matching "${searchQuery}". Try a different keyword.`
                : "No matching learners in this category right now. Switch to 'All Learners' or visit Global Explore!"}
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilterTab("all");
                }}
                className="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs"
              >
                Reset filters
              </button>
              <Link to="/explore" className="btn btn-sm btn-primary rounded-xl text-xs">
                Global Explore →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

              return (
                <div
                  key={user._id}
                  className="p-5 rounded-2xl bg-base-200 border border-base-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* AVATAR + NAME + LOCATION */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <div className="size-12 rounded-full overflow-hidden border border-base-content/20 bg-base-300 shadow-xs">
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#22C55E] ring-2 ring-base-200" />
                      </div>

                      <div className="overflow-hidden flex-1">
                        <h3 className="font-bold text-sm text-base-content truncate">
                          {user.fullName}
                        </h3>
                        <p className="text-[11px] text-base-content/60 flex items-center gap-1 mt-0.5 truncate">
                          <MapPinIcon className="size-3 text-primary" />
                          {user.location || "Online"}
                        </p>
                      </div>

                      {/* COMPATIBILITY BADGE */}
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        Match
                      </span>
                    </div>

                    {/* LANGUAGE RELATIONSHIP CARD */}
                    <div className="bg-base-300/70 rounded-xl p-3 border border-base-content/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-base-content">
                          {getLanguageFlag(user.nativeLanguage)}
                          {capitialize(user.nativeLanguage || "English")}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/70 bg-base-100 px-1.5 py-0.5 rounded">
                          Native
                        </span>
                      </div>

                      <div className="flex items-center justify-center text-base-content/40 text-[10px] leading-none">
                        ↓
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-base-content">
                          {getLanguageFlag(user.learningLanguage)}
                          {capitialize(user.learningLanguage || "Spanish")}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                          Learning
                        </span>
                      </div>
                    </div>

                    {/* BIO */}
                    {user.bio ? (
                      <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                        "{user.bio}"
                      </p>
                    ) : (
                      <p className="text-xs text-base-content/40 italic">Looking to practice conversational skills.</p>
                    )}
                  </div>

                  {/* ACTION: CONNECT */}
                  <div className="pt-3 mt-1">
                    <button
                      className={`w-full text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                        hasRequestBeenSent
                          ? "bg-base-300 text-base-content/50 border border-base-content/10 cursor-not-allowed"
                          : "btn btn-sm btn-primary shadow-xs hover:shadow-md"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckIcon className="size-3.5" />
                          <span>Request sent</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-3.5" />
                          <span>Connect as partner</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
