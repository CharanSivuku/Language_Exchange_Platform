import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, removeFriend } from "../lib/api";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  CompassIcon,
  MapPinIcon,
  MessageSquareIcon,
  SearchIcon,
  UsersIcon,
  VideoIcon,
  UserMinusIcon,
  XIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import usePageTitle from "../hooks/usePageTitle";

const MessagesPage = () => {
  usePageTitle("Messages & Connected Friends");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLangFilter, setSelectedLangFilter] = useState("all");
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const queryClient = useQueryClient();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5000,
  });

  const handleConfirmRemove = async () => {
    if (!friendToRemove) return;
    try {
      setIsRemoving(true);
      await removeFriend(friendToRemove._id);
      await queryClient.invalidateQueries({ queryKey: ["friends"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["platformStats"] });
      toast.success(`${friendToRemove.fullName} removed from friends`);
      setFriendToRemove(null);
    } catch (err) {
      console.error("Error removing friend:", err);
      toast.error(err.response?.data?.message || "Failed to remove friend");
    } finally {
      setIsRemoving(false);
    }
  };

  // Filter only connected friends by search and language
  const filteredFriends = friends.filter((friend) => {
    const q = searchQuery.trim().toLowerCase();
    const fNative = (friend.nativeLanguage || "").toLowerCase();
    const fLearning = (friend.learningLanguage || "").toLowerCase();
    const fName = (friend.fullName || "").toLowerCase();
    const fLocation = (friend.location || "").toLowerCase();

    const matchesSearch =
      !q ||
      fName.includes(q) ||
      fNative.includes(q) ||
      fLearning.includes(q) ||
      fLocation.includes(q);

    const matchesLang =
      selectedLangFilter === "all" ||
      fNative === selectedLangFilter.toLowerCase() ||
      fLearning === selectedLangFilter.toLowerCase();

    return matchesSearch && matchesLang;
  });

  // Extract unique languages among connected friends
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
      {/* AESTHETIC BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-base-200 border border-base-300 p-6 sm:p-8 shadow-sm">
        {/* Subtle background image overlay with gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop')`,
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30 shadow-xs">
                <MessageSquareIcon className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
                  Direct Messages
                </h1>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Private conversations, instant video calls, and connection management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-base-300 font-mono text-xs font-bold text-base-content flex items-center gap-2 border border-base-content/10">
              <span className="size-2 rounded-full bg-[#22C55E]" />
              <span>{friends.length} Connected</span>
            </span>

            <Link
              to="/match"
              className="btn btn-sm btn-primary gap-1.5 shadow-sm text-xs rounded-xl"
            >
              <CompassIcon className="size-3.5" />
              <span>Meet New Partner →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SEARCH AND LANGUAGE FILTER */}
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search connected friends by name, language, or location..."
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
        {availableLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedLangFilter("all")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                selectedLangFilter === "all"
                  ? "bg-primary text-primary-content border-primary shadow-sm"
                  : "bg-base-200 text-base-content/70 border-base-300 hover:bg-base-300 hover:text-base-content"
              }`}
            >
              All Languages
            </button>
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLangFilter(lang)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  selectedLangFilter === lang
                    ? "bg-primary text-primary-content border-primary shadow-sm"
                    : "bg-base-200 text-base-content/70 border-base-300 hover:bg-base-300 hover:text-base-content"
                }`}
              >
                {getLanguageFlag(lang)}
                <span>{capitialize(lang)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONNECTED FRIENDS LIST */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-base-200 border border-base-300 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-base-300" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-base-300 rounded w-28" />
                  <div className="h-3 bg-base-300 rounded w-20" />
                </div>
              </div>
              <div className="h-16 bg-base-300 rounded-xl" />
              <div className="h-9 bg-base-300 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="p-10 text-center space-y-4 max-w-md mx-auto rounded-3xl bg-base-200 border border-base-300 shadow-sm">
          <div className="size-14 rounded-2xl bg-base-300 flex items-center justify-center mx-auto text-base-content/50">
            <UsersIcon className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-base-content">
              {searchQuery ? "No matching friends found" : "No connected friends yet"}
            </h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              {searchQuery
                ? `No connected friends match "${searchQuery}". Try clearing the search.`
                : "Once you connect with conversation partners, their direct messages, calls, and connection options will appear here."}
            </p>
          </div>
          <div className="pt-2">
            <Link to="/match" className="btn btn-primary btn-sm rounded-xl text-xs">
              <CompassIcon className="size-3.5" />
              <span>Find a partner now →</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend) => (
            <div
              key={friend._id}
              className="p-5 rounded-2xl bg-base-200 border border-base-300 hover:border-primary/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* FRIEND HEADER */}
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="size-12 rounded-full overflow-hidden border border-base-content/20 bg-base-300 shadow-xs">
                      <img
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#22C55E] ring-2 ring-base-200" />
                  </div>

                  <div className="overflow-hidden flex-1">
                    <h3 className="font-bold text-sm text-base-content truncate">
                      {friend.fullName}
                    </h3>
                    <p className="text-[11px] text-base-content/60 flex items-center gap-1 mt-0.5 truncate">
                      <MapPinIcon className="size-3 text-primary" />
                      {friend.location || "Online"}
                    </p>
                  </div>
                </div>

                {/* LANGUAGE EXCHANGE FLOW */}
                <div className="bg-base-300/70 rounded-xl p-3 border border-base-content/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-base-content">
                      {getLanguageFlag(friend.nativeLanguage)}
                      {capitialize(friend.nativeLanguage || "English")}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-base-100 text-base-content/70 px-2 py-0.5 rounded">
                      Native
                    </span>
                  </div>

                  <div className="flex items-center justify-center text-base-content/40 text-[10px] leading-none">
                    ↓
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-base-content">
                      {getLanguageFlag(friend.learningLanguage)}
                      {capitialize(friend.learningLanguage || "Spanish")}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded">
                      Learning
                    </span>
                  </div>
                </div>

                {/* BIO */}
                {friend.bio ? (
                  <p className="text-xs text-base-content/70 line-clamp-2 italic">
                    "{friend.bio}"
                  </p>
                ) : (
                  <p className="text-xs text-base-content/40 italic">Connected conversation partner.</p>
                )}
              </div>

              {/* ACTION BUTTONS: DIRECT CHAT + VIDEO CALL + REMOVE FRIEND */}
              <div className="flex items-center gap-2 pt-4 mt-2 border-t border-base-300">
                <Link
                  to={`/chat/${friend._id}`}
                  className="btn btn-sm btn-primary flex-1 gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
                >
                  <MessageSquareIcon className="size-3.5" />
                  <span>Chat</span>
                </Link>

                <Link
                  to={`/call/${friend._id}`}
                  className="btn btn-sm btn-outline gap-1.5 rounded-xl text-xs font-semibold hover:btn-primary transition-colors"
                  title="Start Video Call"
                >
                  <VideoIcon className="size-3.5" />
                  <span>Call</span>
                </Link>

                <button
                  onClick={() => setFriendToRemove(friend)}
                  className="btn btn-sm btn-ghost text-error/80 hover:text-error hover:bg-error/10 border border-error/20 hover:border-error/40 rounded-xl px-2.5 transition-all"
                  title={`Remove ${friend.fullName} from friends`}
                >
                  <UserMinusIcon className="size-3.5" />
                  <span className="hidden sm:inline text-xs">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL TO REMOVE FRIEND FROM DATABASE */}
      {friendToRemove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-base-200 border border-base-300 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="size-12 rounded-2xl bg-error/15 text-error flex items-center justify-center mx-auto">
              <UserMinusIcon className="size-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-base-content">
                Remove {friendToRemove.fullName}?
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed">
                Are you sure you want to remove <strong className="text-base-content">{friendToRemove.fullName}</strong> from your connected friends? This will delete the connection from the database immediately.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setFriendToRemove(null)}
                disabled={isRemoving}
                className="btn btn-sm btn-ghost rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={isRemoving}
                className="btn btn-sm btn-error rounded-xl text-xs gap-1.5 font-bold shadow-md shadow-error/25"
              >
                {isRemoving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <UserMinusIcon className="size-3.5" />
                )}
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
