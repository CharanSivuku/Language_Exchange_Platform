import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebarStore } from "../store/useSidebarStore";
import useNotificationSocket from "../hooks/useNotificationSocket";

const Layout = ({ children, showSidebar = false }) => {
  const { isCollapsed } = useSidebarStore();

  // Real-time socket event pump
  useNotificationSocket();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] verba-bg-ambient flex flex-col transition-colors duration-150">
      {/* FIXED TOP NAVBAR */}
      <Navbar />

      {/* BODY WITH COLLAPSIBLE SIDEBAR & RESPONSIVE MAIN CONTENT */}
      <div className="flex-1 flex pt-14">
        {showSidebar && <Sidebar />}

        <main
          className={`flex-1 min-h-[calc(100vh-3.5rem)] w-full transition-[padding] duration-200 ease-out ${
            showSidebar ? (isCollapsed ? "lg:pl-0" : "lg:pl-60") : "pl-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
