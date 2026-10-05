import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageSquareIcon } from "lucide-react";
import { capitialize } from "../lib/utils";

const FriendCard = ({ friend }) => {
  return (
    <div className="verba-card p-5 flex flex-col justify-between hover:border-[#3F3F46] transition-all duration-150">
      <div>
        {/* AVATAR & NAME */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative shrink-0">
            <div className="size-11 rounded-full overflow-hidden border border-[#27272A] bg-[#18181B]">
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
            <p className="text-[11px] text-[#22C55E] flex items-center gap-1 mt-0.5 font-medium">
              <span className="size-1.5 rounded-full bg-[#22C55E]" />
              Online
            </p>
          </div>
        </div>

        {/* LANGUAGE RELATIONSHIP BLOCK */}
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
      </div>

      {/* ACTION: START CONVERSATION */}
      <Link
        to={`/chat/${friend._id}`}
        className="verba-btn-secondary w-full text-xs font-semibold justify-center py-2 mt-2"
      >
        <MessageSquareIcon className="size-3.5 text-[#6D5DFB]" />
        Start conversation →
      </Link>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block rounded-xs shadow-xs"
      />
    );
  }
  return null;
}
