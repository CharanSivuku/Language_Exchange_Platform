import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  CompassIcon,
  GlobeIcon,
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { useSidebarStore } from "../store/useSidebarStore";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isCollapsed, mobileOpen, setMobileOpen } = useSidebarStore();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 8000,
    staleTime: 5000,
    enabled: Boolean(authUser),
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;

  // Streamlined Discover Navigation (Partners removed as requested)
  const discoverNav = [
    { label: "Home", path: "/", icon: HomeIcon },
    { label: "Find a Partner", path: "/match", icon: CompassIcon },
    { label: "Messages", path: "/messages", icon: MessageSquareIcon },
  ];

  // Community Navigation
  const communityNav = [
    {
      label: "Global Explore",
      path: "/explore",
      icon: GlobeIcon,
      subtitle: "Add anyone",
      highlight: true,
    },
    {
      label: "Requests",
      path: "/notifications",
      icon: BellIcon,
      badge: incomingCount > 0 ? incomingCount : null,
    },
  ];

  return (
    <>
      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE: FULLY THEME-AWARE */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 w-60 bg-base-200 border-r border-base-300 text-base-content flex flex-col transition-all duration-200 ease-out shadow-xs ${
          isCollapsed ? "-translate-x-full pointer-events-none" : "translate-x-0"
        } ${
          mobileOpen
            ? "!translate-x-0 !pointer-events-auto shadow-2xl"
            : ""
        }`}
      >
        {/* MOBILE HEADER */}
        <div className="lg:hidden p-3.5 border-b border-base-300 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-base-content/60">
            Navigation
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-base-content/60 hover:text-base-content p-1 rounded-lg"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="flex-1 p-3 space-y-5 overflow-y-auto scrollbar-none pb-24">
          {/* DISCOVER SECTION */}
          <div className="space-y-1">
            <p className="px-2.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
              Discover
            </p>
            {discoverNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path === "/match" && currentPath === "/random") ||
                (item.path === "/messages" && currentPath === "/friends");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? "bg-primary/15 text-primary font-bold border-l-4 border-primary shadow-xs"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-300 hover:translate-x-0.5"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-primary" : "text-base-content/60 group-hover:text-primary"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* COMMUNITY SECTION */}
          <div className="space-y-1">
            <p className="px-2.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
              Community
            </p>
            {communityNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? "bg-primary/15 text-primary font-bold border-l-4 border-primary shadow-xs"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-300 hover:translate-x-0.5"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-primary" : "text-base-content/60 group-hover:text-primary"
                    }`}
                  />
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.subtitle && !item.badge && (
                      <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                        {item.subtitle}
                      </span>
                    )}
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-content shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="h-[1px] bg-base-300 mx-2" />

          {/* SETTINGS LINK */}
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
              currentPath === "/profile"
                ? "bg-primary/15 text-primary font-bold border-l-4 border-primary shadow-xs"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300 hover:translate-x-0.5"
            }`}
          >
            <SettingsIcon className="size-4 shrink-0 text-base-content/60 group-hover:text-primary transition-transform group-hover:scale-110" />
            <span className="truncate">Profile & Customizer</span>
          </Link>
        </div>

        {/* LOCKED USER MINI-CARD AT BOTTOM */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-base-300/60 border-t border-base-300">
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-300 border border-transparent hover:border-base-content/10 transition-all group"
            title="Edit Profile & Avatar"
          >
            <div className="relative shrink-0">
              <div className="size-9 rounded-full overflow-hidden border border-base-content/20 bg-base-200 shadow-xs">
                <img
                  src={authUser?.profilePic}
                  alt={authUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#22C55E] ring-2 ring-base-200" />
            </div>

            <div className="flex-1 overflow-hidden text-left leading-tight">
              <p className="font-semibold text-xs text-base-content truncate group-hover:text-primary transition-colors">
                {authUser?.fullName || "User"}
              </p>
              <p className="text-[11px] text-base-content/60 truncate mt-0.5">
                {capitialize(authUser?.nativeLanguage || "Native")} → {capitialize(authUser?.learningLanguage || "Learn")}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
