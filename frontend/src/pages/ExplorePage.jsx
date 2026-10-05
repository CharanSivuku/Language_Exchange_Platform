import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
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
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import { LANGUAGES } from "../constants";
import useAuthUser from "../hooks/useAuthUser";
import usePageTitle from "../hooks/usePageTitle";
import toast from "react-hot-toast";

const ExplorePage = () => {
  usePageTitle("Global Explore — Discover Learners Worldwide");

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    staleTime: 5000,
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5000,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    staleTime: 5000,
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

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Friend ID set for quick lookup
  const friendIds = new Set(friends.map((f) => f._id));

  // Robust filtering of real learners by search and language
  const filteredUsers = recommendedUsers.filter((user) => {
    const q = searchQuery.trim().toLowerCase();
    const uName = (user.fullName || "").toLowerCase();
    const uBio = (user.bio || "").toLowerCase();
    const uLoc = (user.location || "").toLowerCase();
    const uNative = (user.nativeLanguage || "").toLowerCase();
    const uLearning = (user.learningLanguage || "").toLowerCase();

    const matchesSearch =
      !q ||
      uName.includes(q) ||
      uBio.includes(q) ||
      uLoc.includes(q) ||
      uNative.includes(q) ||
      uLearning.includes(q);

    const matchesLang =
      selectedLanguage === "all" ||
      uNative === selectedLanguage.toLowerCase() ||
      uLearning === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* AESTHETIC BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-base-200 border border-base-300 p-6 sm:p-8 shadow-sm">
        {/* Subtle photo background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop')`,
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30 shadow-xs">
                <GlobeIcon className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
                  <span>Global Explore</span>
                </h1>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Browse real learners from the database and connect with anyone across the world
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-base-300 font-mono text-xs font-bold text-base-content border border-base-content/10 shadow-xs">
              {recommendedUsers.length} Active in Database
            </span>

            <Link
              to="/match"
              className="btn btn-sm btn-primary gap-1.5 shadow-sm text-xs rounded-xl"
            >
              <CompassIcon className="size-3.5" />
              <span>Instant Match Roulette →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search anyone by name, language, city, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-base-200 text-base-content text-sm pl-10 pr-10 py-3 rounded-2xl border border-base-300 focus:outline-hidden focus:border-primary shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-1"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* LANGUAGE FILTER CHIPS */}
        <div className="flex flex-wrap gap-1.5 pt-1 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedLanguage("all")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
              selectedLanguage === "all"
                ? "bg-primary text-primary-content border-primary shadow-sm"
                : "bg-base-200 text-base-content/70 border-base-300 hover:bg-base-300 hover:text-base-content"
            }`}
          >
            All Languages
          </button>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang.toLowerCase())}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
                selectedLanguage === lang.toLowerCase()
                  ? "bg-primary text-primary-content border-primary shadow-sm"
                  : "bg-base-200 text-base-content/70 border-base-300 hover:bg-base-300 hover:text-base-content"
              }`}
            >
              {getLanguageFlag(lang)}
              <span>{lang}</span>
            </button>
          ))}
        </div>
      </div>

      {/* REAL LEARNERS GRID */}
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
            <GlobeIcon className="size-6" />
          </div>
          <h3 className="font-bold text-sm text-base-content">No learners found</h3>
          <p className="text-xs text-base-content/60 leading-relaxed">
            {searchQuery
              ? `No learners found matching "${searchQuery}". Try a different language or clear the search.`
              : "Check back soon for new members joining the community."}
          </p>
          {searchQuery && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage("all");
                }}
                className="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
            const isAlreadyFriend = friendIds.has(user._id);

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
                        {user.location || "Earth"}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      Global
                    </span>
                  </div>

                  {/* LANGUAGE CARD */}
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
                    <p className="text-xs text-base-content/40 italic">
                      Ready to practice and connect worldwide.
                    </p>
                  )}
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-3 mt-1">
                  {isAlreadyFriend ? (
                    <Link
                      to={`/chat/${user._id}`}
                      className="btn btn-sm btn-primary w-full gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <MessageSquareIcon className="size-3.5" />
                      <span>Message Partner</span>
                    </Link>
                  ) : (
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
                          <span>Invitation Sent</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-3.5" />
                          <span>Add to Partners</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
