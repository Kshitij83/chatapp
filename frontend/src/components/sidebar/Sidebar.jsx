import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaUserCog } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <>
      {/* Mobile backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`${
          showSidebar ? "flex" : "hidden"
        } sm:flex fixed sm:static z-50 inset-y-0 left-0 w-[85%] max-w-xs sm:w-72 lg:w-80 flex-col shrink-0 bg-surface-2 border-r border-[var(--border)]`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate("/profile")}
            className="relative shrink-0 group"
            title="View profile"
          >
            <img
              src={authUser.profilePic}
              alt="profile"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary group-hover:ring-primary-strong transition-all"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full ring-2 ring-surface-2" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink truncate leading-tight">
              {authUser.fullName}
            </p>
            <p className="text-xs text-ink-muted truncate">@{authUser.username}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-btn"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <FaSun size={15} /> : <FaMoon size={15} />}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="theme-btn"
            title="Profile"
          >
            <FaUserCog size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <SearchInput />
        </div>

        {/* Conversations */}
        <div className="px-3 py-2 border-y border-[var(--border)]">
          <p className="text-[11px] uppercase tracking-widest text-ink-muted font-semibold px-1">
            Conversations
          </p>
        </div>
        <div className="flex-1 overflow-y-auto py-2 sidebar-scroll">
          <Conversations />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-xs text-ink-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-online animate-pulse" />
            Online
          </span>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
