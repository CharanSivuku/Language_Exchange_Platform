import { useEffect } from "react";
import { useLocation } from "react-router";

export default function usePageTitle(customTitle = null) {
  const location = useLocation();

  useEffect(() => {
    if (customTitle) {
      document.title = `${customTitle} | Verba`;
      return;
    }

    const path = location.pathname;

    if (path === "/") {
      document.title = "Verba | Practice Languages with Native Speakers";
    } else if (path === "/match" || path === "/random") {
      document.title = "Find a Partner | Verba";
    } else if (path === "/friends" || path === "/messages") {
      document.title = "Partners & Messages | Verba";
    } else if (path === "/notifications") {
      document.title = "Partner Requests | Verba";
    } else if (path === "/profile") {
      document.title = "Profile & Settings | Verba";
    } else if (path.startsWith("/chat")) {
      document.title = "Live Chat | Verba";
    } else if (path.startsWith("/call")) {
      document.title = "Video Call | Verba";
    } else if (path === "/login") {
      document.title = "Sign In | Verba";
    } else if (path === "/signup") {
      document.title = "Join Verba — Speak Beyond the Textbook";
    } else if (path === "/onboarding") {
      document.title = "Setup Your Profile | Verba";
    } else {
      document.title = "Verba — Real conversations. Real fluency.";
    }
  }, [location.pathname, customTitle]);
}
