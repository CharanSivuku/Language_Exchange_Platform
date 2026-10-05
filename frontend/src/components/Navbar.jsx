import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  CompassIcon,
  GlobeIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquareIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
} from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useSidebarStore } from "../store/useSidebarStore";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import ThemeSelector from "./ThemeSelector";
import VerbaLogo from "./VerbaLogo";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { logoutMutation } = useLogout();
  const { isCollapsed, toggleSidebar, toggleMobileOpen } = useSidebarStore();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 8000,
    staleTime: 5000,
    enabled: Boolean(authUser),
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;

  // Dedicated navigation items (Partners removed as requested)
  const topNavItems = [
    { label: "Home", path: "/", icon: HomeIcon },
    { label: "Find a Partner", path: "/match", icon: CompassIcon },
    { label: "Messages", path: "/messages", icon: MessageSquareIcon },
    { label: "Global Explore", path: "/explore", icon: GlobeIcon },
    {
      label: "Requests",
      path: "/notifications",
      icon: BellIcon,
      badge: incomingCount > 0 ? incomingCount : null,
    },
  ];

  const getPageTitle = () => {
    if (currentPath === "/") return "Home";
    if (currentPath === "/match" || currentPath === "/random") return "Find a Partner";
    if (currentPath === "/messages" || currentPath === "/friends") return "Messages & Friends";
    if (currentPath === "/notifications") return "Partner Requests";
    if (currentPath === "/explore") return "Global Explore";
    if (currentPath === "/profile") return "Profile Settings";
    if (currentPath.startsWith("/chat")) return "Direct Chat";
    if (currentPath.startsWith("/call")) return "Live Video Call";
    return "";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-base-200/95 backdrop-blur-md border-b border-base-300 text-base-content select-none shadow-sm transition-colors duration-200">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* LEFT: BRAND & SIDEBAR TOGGLE */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex text-base-content/70 hover:text-base-content p-2 rounded-xl hover:bg-base-300 transition-all duration-200 border border-transparent hover:border-base-content/10 shadow-xs"
            title={isCollapsed ? "Expand sidebar panel" : "Collapse sidebar"}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <PanelLeftIcon className="size-4 text-primary" />
            ) : (
              <PanelLeftCloseIcon className="size-4" />
            )}
          </button>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMobileOpen}
            className="lg:hidden text-base-content/70 hover:text-base-content p-2 rounded-xl hover:bg-base-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <MenuIcon className="size-5" />
          </button>

          {/* Single prominent Verba Logo (NO DUPLICATE TEXT) */}
          <Link to="/" className="flex items-center group transition-transform hover:scale-102">
            <VerbaLogo size={38} showText={true} />
          </Link>

          {/* Breadcrumb (shown when sidebar is open) */}
          {!isCollapsed && getPageTitle() && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-base-content/50 border-l border-base-300 pl-3 ml-1">
              <span>/</span>
              <span className="text-base-content/80 font-medium">{getPageTitle()}</span>
            </div>
          )}
        </div>

        {/* CENTER: FLOATING TOP NAVBAR (REVEALED WHEN SIDEBAR IS COLLAPSED) */}
        {isCollapsed && (
          <div className="hidden md:flex items-center gap-1.5 bg-base-300/80 p-1.5 rounded-2xl border border-base-content/10 shadow-lg animate-fadeIn">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path === "/match" && currentPath === "/random") ||
                (item.path === "/messages" && currentPath === "/friends");

              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all duration-200 relative ${
                    isActive
                      ? "bg-primary text-primary-content font-bold shadow-md shadow-primary/25 -translate-y-0.5"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-content/10 hover:-translate-y-0.5"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-primary-content text-primary"
                          : "bg-primary text-primary-content"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* RIGHT: ACTIONS (CTA + THEME + NOTIFS + PROFILE + LOGOUT) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* PRIMARY CTA: Find a partner → */}
          <Link
            to="/match"
            className="hidden sm:inline-flex btn btn-sm btn-primary gap-1.5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 font-semibold text-xs rounded-xl"
          >
            <CompassIcon className="size-3.5" />
            <span>Find a partner →</span>
          </Link>

          {/* THEME SELECTOR */}
          <ThemeSelector />

          {/* NOTIFICATIONS BELL */}
          <Link
            to="/notifications"
            className="relative p-2 text-base-content/70 hover:text-base-content hover:bg-base-300 rounded-xl transition-all duration-200 border border-transparent hover:border-base-content/10"
            title="Partner Requests"
          >
            <BellIcon className="size-4" />
            {incomingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary animate-pulse" />
            )}
          </Link>

          {/* AVATAR MINI-PILL */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-primary/50 transition-all"
            title="Account & Profile Settings"
          >
            <div className="size-8 rounded-full overflow-hidden border border-base-content/20 bg-base-300 shadow-xs">
              <img
                src={authUser?.profilePic}
                alt={authUser?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* LOGOUT */}
          <button
            onClick={logoutMutation}
            className="p-2 text-base-content/60 hover:text-error hover:bg-error/10 rounded-xl transition-all duration-200 border border-transparent hover:border-error/20"
            title="Sign Out"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
