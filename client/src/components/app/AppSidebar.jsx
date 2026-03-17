import { useMemo } from "react";
import synapseLogo from '../../assets/synapse-logo.png';

function AppSidebar({
  isDark,
  brandLabel = "Synapse",
  user,
  isCollapsed,
  navItems,
  onToggleCollapse,
  onGoProfile,
  profileActive = false,
  onLogout,
}) {
  const initials = useMemo(
    () =>
      (user?.username || "John Doe")
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(""),
    [user],
  );

  const navIcon = (label) => {
    if (label === 'Home') {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5V20h12v-9.5" />
        </svg>
      );
    }
    if (label === 'Library') {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h11a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 19a2 2 0 0 0-2 2h11" />
        </svg>
      );
    }
    if (label === 'Sources') {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  };

  return (
    <aside
      className={`hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0 lg:flex-col lg:border-r lg:backdrop-blur-md lg:transition-all lg:duration-300 lg:ease-out ${
        isDark
          ? "lg:border-white/10 lg:bg-black/40"
          : "lg:border-slate-200 lg:bg-white/70"
      } ${isCollapsed ? "lg:w-[104px]" : "lg:w-64"}`}
    >
      <div className="p-5">
        <div className="mb-7 flex items-center">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`group flex items-center overflow-hidden rounded-xl p-1.5 transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'} ${isCollapsed ? 'justify-center' : 'gap-2'}`}
            aria-label="Toggle sidebar"
          >
            <img src={synapseLogo} alt="Synapse" className={`rounded-lg object-cover transition-all ${isCollapsed ? 'h-9 w-9' : 'h-10 w-10'}`} />
            {!isCollapsed && <span className="text-[1.9rem] font-semibold leading-none tracking-tight">{brandLabel}</span>}
          </button>
        </div>

        <nav className="space-y-1 text-sm">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={`flex w-full items-center rounded-xl px-3 py-2.5 transition ${
                item.active
                  ? isDark
                    ? 'bg-[#f15a0f]/20 text-[#ffb286] ring-1 ring-[#f15a0f]/40'
                    : 'bg-orange-100 text-orange-700'
                  : isDark
                    ? "text-white/65 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100"
              } ${isCollapsed ? "justify-center" : "justify-start gap-3"}`}
              aria-label={item.label}
            >
              {navIcon(item.label)}
              {!isCollapsed && item.label}
            </button>
          ))}
        </nav>
      </div>

      <div
        className={`mt-auto border-t p-5 ${isDark ? "border-white/10" : "border-slate-200"}`}
      >
        <div className={`mb-3 flex items-center rounded-xl px-3 py-2 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.username || 'User avatar'}
              className="h-8 w-8 rounded-full border border-white/20 object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
              {initials || "JD"}
            </div>
          )}
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {user?.username || "John Doe"}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onGoProfile}
          className={`mb-2 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${
            profileActive
              ? isDark
                ? 'bg-[#f15a0f]/20 text-[#ffb286] ring-1 ring-[#f15a0f]/40'
                : 'bg-orange-100 text-orange-700'
              : isDark
                ? 'text-white hover:bg-white/10'
                : 'text-slate-700 hover:bg-slate-100'
          } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
          aria-label="Profile"
        >
          {navIcon('Profile')}
          {!isCollapsed && 'Profile'}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${
            isDark
              ? 'bg-red-500/10 text-red-300 hover:bg-red-500/15'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
          aria-label="Log out"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 7-5 5 5 5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 4v16" />
          </svg>
          {!isCollapsed && 'Log out'}
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
