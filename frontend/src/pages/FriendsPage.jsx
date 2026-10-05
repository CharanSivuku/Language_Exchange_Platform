import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import {
  CompassIcon,
  MapPinIcon,
  MessageSquareIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import usePageTitle from "../hooks/usePageTitle";

const FriendsPage = () => {
  usePageTitle("Partners & Messages");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLangFilter, setSelectedLangFilter] = useState("all");

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5000,
  });

  // Filter friends based on search query and language chip
  const filteredFriends = friends.filter((friend) => {
    const matchesSearch =
      friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.nativeLanguage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.learningLanguage?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang =
      selectedLangFilter === "all" ||
      friend.nativeLanguage?.toLowerCase() === selectedLangFilter.toLowerCase() ||
      friend.learningLanguage?.toLowerCase() === selectedLangFilter.toLowerCase();

    return matchesSearch && matchesLang;
  });

  // Unique languages among friends
  const availableLanguages = Array.from(
    new Set(
      friends
        .flatMap((f) => [f.nativeLanguage, f.learningLanguage])
        .filter(Boolean)
        .map((l) => l.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* HEADER WITH STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">
              Partners & Messages
            </h1>
            <span className="text-xs font-mono font-bold text-[#A59BFB] bg-[#6D5DFB]/15 px-2.5 py-0.5 rounded-full border border-[#6D5DFB]/25">
              {friends.length} Connected
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1">
            Revisit past conversation partners and start real-time chat or video sessions
          </p>
        </div>

        <Link to="/match" className="verba-btn-primary text-xs !py-2 !px-4 self-start sm:self-auto">
          <CompassIcon className="size-3.5" />
          <span>Find new partner →</span>
        </Link>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="verba-card p-4">
          <p className="text-xs text-[#71717A] uppercase font-semibold tracking-wider">
            Total Partners
          </p>
          <p className="text-xl font-bold text-[#FAFAFA] mt-1">{friends.length}</p>
        </div>

        <div className="verba-card p-4">
          <p className="text-xs text-[#71717A] uppercase font-semibold tracking-wider">
            Available Online
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="size-2 rounded-full bg-[#22C55E]" />
            <p className="text-xl font-bold text-[#22C55E]">
              {friends.length > 0 ? friends.length : 0}
            </p>
          </div>
        </div>

        <div className="verba-card p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-[#71717A] uppercase font-semibold tracking-wider">
            Languages Represented
          </p>
          <p className="text-xl font-bold text-[#6D5DFB] mt-1">
            {availableLanguages.length || 1}
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search partner by name or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181B] text-[#FAFAFA] text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#27272A] focus:outline-hidden focus:border-[#6D5DFB] transition-colors"
            />
          </div>
        </div>

        {/* LANGUAGE FILTER CHIPS */}
        {availableLanguages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setSelectedLangFilter("all")}
              className={`text-xs font-medium px-3 py-1 rounded-lg border transition-colors ${
                selectedLangFilter === "all"
                  ? "bg-[#6D5DFB] text-white border-[#6D5DFB]"
                  : "bg-[#18181B] text-[#71717A] border-[#27272A] hover:text-[#FAFAFA]"
              }`}
            >
              All Languages
            </button>
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLangFilter(lang)}
                className={`text-xs font-medium px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  selectedLangFilter === lang
                    ? "bg-[#6D5DFB] text-white border-[#6D5DFB]"
                    : "bg-[#18181B] text-[#71717A] border-[#27272A] hover:text-[#FAFAFA]"
                }`}
              >
                {getLanguageFlag(lang)}
                <span>{capitialize(lang)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PARTNERS GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="verba-card p-5 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-[#18181B]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-[#18181B] rounded w-28" />
                  <div className="h-3 bg-[#18181B] rounded w-20" />
                </div>
              </div>
              <div className="h-16 bg-[#18181B] rounded-xl" />
              <div className="h-8 bg-[#18181B] rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="verba-card p-10 text-center space-y-3 max-w-md mx-auto">
          <div className="size-10 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center mx-auto text-[#71717A]">
            <UsersIcon className="size-5" />
          </div>
          <h3 className="font-semibold text-sm text-[#FAFAFA]">
            {searchQuery ? "No partners match your search" : "No conversation partners yet"}
          </h3>
          <p className="text-xs text-[#71717A]">
            {searchQuery
              ? "Try searching with a different language or partner name."
              : "Discover native speakers and start building your exchange network."}
          </p>
          {!searchQuery && (
            <div className="pt-2">
              <Link to="/match" className="verba-btn-primary text-xs">
                Find a partner now →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend) => (
            <div
              key={friend._id}
              className="verba-card p-5 flex flex-col justify-between hover:border-[#3F3F46] transition-all duration-150"
            >
              <div>
                {/* AVATAR + NAME + STATUS */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative shrink-0">
                    <div className="size-12 rounded-full overflow-hidden border border-[#27272A] bg-[#18181B]">
                      <img
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#111113]" />
                  </div>

                  <div className="overflow-hidden flex-1">
                    <h3 className="font-semibold text-sm text-[#FAFAFA] truncate">
                      {friend.fullName}
                    </h3>
                    <p className="text-[11px] text-[#71717A] flex items-center gap-1 mt-0.5 truncate">
                      <MapPinIcon className="size-3 text-[#A1A1AA]" />
                      {friend.location || "Online Learner"}
                    </p>
                  </div>
                </div>

                {/* LANGUAGE EXCHANGE BLOCK */}
                <div className="bg-[#18181B] rounded-xl p-2.5 border border-[#27272A] space-y-1.5 my-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[#FAFAFA]">
                      {getLanguageFlag(friend.nativeLanguage)}
                      {capitialize(friend.nativeLanguage || "English")}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA] bg-[#27272A] px-1.5 py-0.5 rounded">
                      Native
                    </span>
                  </div>

                  <div className="flex items-center justify-center text-[#71717A] text-[11px] leading-none">
                    ↓
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[#FAFAFA]">
                      {getLanguageFlag(friend.learningLanguage)}
                      {capitialize(friend.learningLanguage || "Spanish")}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6D5DFB] bg-[#6D5DFB]/15 px-1.5 py-0.5 rounded">
                      Learning
                    </span>
                  </div>
                </div>

                {/* BIO */}
                {friend.bio && (
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 italic mb-3">
                    "{friend.bio}"
                  </p>
                )}
              </div>

              {/* ACTIONS: CHAT & CALL */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272A]/70">
                <Link
                  to={`/chat/${friend._id}`}
                  className="verba-btn-primary text-xs !py-1.5 justify-center"
                >
                  <MessageSquareIcon className="size-3.5" />
                  <span>Chat</span>
                </Link>

                <Link
                  to={`/call/${friend._id}`}
                  className="verba-btn-secondary text-xs !py-1.5 justify-center"
                >
                  <VideoIcon className="size-3.5 text-[#6D5DFB]" />
                  <span>Call</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
