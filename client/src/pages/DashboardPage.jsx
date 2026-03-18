import { useEffect, useMemo, useState } from "react";
import AppSidebar from "../components/app/AppSidebar";
import QuickInsightsPanel from "../components/app/QuickInsightsPanel";
import { useSidebarState } from "../app/SidebarContext";

function getRelativeTime(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return "just now";
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function DashboardPage({
  user,
  notebooks,
  theme,
  activityLog,
  onCreateNotebook,
  onRequestRenameNotebook,
  onOpenNotebook,
  onDeleteNotebook,
  onDuplicateNotebook,
  onToggleFavorite,
  onToggleShared,
  onLogout,
  onGoProfile,
  onGoHome,
  onGoLibrary,
  onGoSources,
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [menuNotebookId, setMenuNotebookId] = useState("");
  const {
    isCollapsed,
    toggleCollapsed,
    isInsightsCollapsed,
    toggleInsightsCollapsed,
  } = useSidebarState();
  const isDark = theme === "dark";

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('[data-notebook-menu-root="true"]')) {
        setMenuNotebookId("");
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuNotebookId("");
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const filteredNotebooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sorted = [...notebooks].sort(
      (a, b) =>
        new Date(b.lastEditedAt || b.createdAt) -
        new Date(a.lastEditedAt || a.createdAt),
    );
    const byTab = sorted.filter((item) => {
      if (activeTab === "Shared") return item.isShared;
      if (activeTab === "Favorites") return item.isFavorite;
      if (activeTab === "Recent") return true;
      return true;
    });
    if (!normalizedQuery) {
      return activeTab === "Recent" ? byTab.slice(0, 8) : byTab;
    }
    return byTab.filter((item) =>
      item.title.toLowerCase().includes(normalizedQuery),
    );
  }, [notebooks, query, activeTab]);

  const recentNotebooks = useMemo(
    () =>
      [...notebooks]
        .sort(
          (a, b) =>
            new Date(b.lastEditedAt || b.createdAt) -
            new Date(a.lastEditedAt || a.createdAt),
        )
        .slice(0, 3),
    [notebooks],
  );

  const sharedCount = notebooks.filter((item) => item.isShared).length;
  const favoriteCount = notebooks.filter((item) => item.isFavorite).length;
  const sourceCount = notebooks.reduce(
    (sum, item) => sum + (item.sources?.length || 0),
    0,
  );
  const storagePercent = Math.min(
    100,
    Math.round((sourceCount * 0.35 * 10) / 10),
  );

  const handleNotebookAction = (action, notebook) => {
    setMenuNotebookId("");
    if (action === "open") onOpenNotebook(notebook.id);
    if (action === "rename") onRequestRenameNotebook(notebook);
    if (action === "duplicate") onDuplicateNotebook(notebook.id);
    if (action === "favorite") onToggleFavorite(notebook.id);
    if (action === "shared") onToggleShared(notebook.id);
    if (action === "delete") {
      const confirmed = window.confirm(`Delete "${notebook.title}"?`);
      if (confirmed) onDeleteNotebook(notebook.id);
    }
  };

  const tabs = ["All", "Recent", "Shared", "Favorites"];

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${isDark ? "bg-[#050505] text-white" : "bg-[#f2f2f2] text-[#111827]"} lg:flex`}
    >
      <AppSidebar
        isDark={isDark}
        user={user}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
        onGoProfile={onGoProfile}
        onLogout={onLogout}
        navItems={[
          { label: "Home", active: false, onClick: onGoHome },
          { label: "Library", active: true, onClick: onGoLibrary },
          { label: "Sources", active: false, onClick: onGoSources },
        ]}
      />

      <main className="min-w-0 flex-1 px-4 pb-28 pt-4 sm:px-5 sm:pt-6 lg:px-8 lg:py-8">
        <section className="mb-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2
                className={`text-3xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}
              >
                My Library
              </h2>
              <p
                className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-[#64748b]"}`}
              >
                Manage your research notebooks and sources
              </p>
            </div>
            <button
              type="button"
              onClick={onCreateNotebook}
              className="rounded-xl bg-[#f15a0f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#de5009]"
            >
              + New Notebook
            </button>
          </div>

          <div
            className={`rounded-3xl border p-4 ${isDark ? "border-white/10 bg-white/[0.02]" : "border-orange-100 bg-white/80 shadow-[0_10px_30px_rgba(241,90,15,0.08)]"}`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 lg:max-w-md transition focus-within:ring-2 focus-within:ring-[#f15a0f]/40 ${isDark ? "border border-white/10 bg-white/[0.03] focus-within:border-[#f15a0f]" : "border border-orange-100 bg-[#fff7f2] focus-within:border-[#f15a0f]"}`}
              >
                <svg
                  className={`h-5 w-5 ${isDark ? "text-white/40" : "text-[#94a3b8]"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.3-4.3M5.5 10.5a5 5 0 1 0 10 0 5 5 0 0 0-10 0Z"
                  />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search notebooks..."
                  className={`w-full bg-transparent text-sm outline-none ${isDark ? "text-white placeholder:text-white/35" : "text-[#334155] placeholder:text-[#667085]"}`}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                      activeTab === tab
                        ? "bg-[#f15a0f] text-white"
                        : isDark
                          ? "bg-black/50 text-white/70 hover:text-white"
                          : "bg-[#fff2eb] text-[#8a3915]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotebooks.slice(0, 9).map((notebook) => (
            <article
              key={notebook.id}
              className={`rounded-3xl border p-5 transition-all duration-200 ${
                isDark
                  ? "border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-[#f15a0f]/60 hover:shadow-[0_10px_30px_rgba(241,90,15,0.18)]"
                  : "border-orange-100 bg-white/85 hover:-translate-y-0.5 hover:border-[#f15a0f]/60 hover:shadow-[0_12px_26px_rgba(241,90,15,0.15)]"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenNotebook(notebook.id)}
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-white/10" : "bg-[#f15a0f]/10 text-[#f15a0f]"} text-2xl`}
                  >
                    {notebook.icon}
                  </div>
                  <div>
                    <h3
                      className={`line-clamp-1 text-base font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}
                    >
                      {notebook.title}
                    </h3>
                    <p
                      className={`text-xs ${isDark ? "text-white/50" : "text-[#64748b]"}`}
                    >
                      {notebook.sources.length} sources •{" "}
                      {getRelativeTime(
                        notebook.lastEditedAt || notebook.createdAt,
                      )}
                    </p>
                  </div>
                </button>

                <div className="relative" data-notebook-menu-root="true">
                  <button
                    type="button"
                    aria-label="Manage notebook"
                    onClick={() =>
                      setMenuNotebookId((prev) =>
                        prev === notebook.id ? "" : notebook.id,
                      )
                    }
                    className={`rounded-lg px-2 py-1 text-sm ${isDark ? "text-white/70 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"}`}
                  >
                    ...
                  </button>
                  {menuNotebookId === notebook.id && (
                    <div
                      className={`absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border shadow-xl ${isDark ? "border-white/15 bg-[#111]" : "border-slate-200 bg-white"}`}
                    >
                      {[
                        { key: "open", label: "Open Notebook" },
                        { key: "rename", label: "Rename" },
                        { key: "duplicate", label: "Duplicate" },
                        {
                          key: "favorite",
                          label: notebook.isFavorite
                            ? "Remove Favorite"
                            : "Add to Favorites",
                        },
                        {
                          key: "shared",
                          label: notebook.isShared ? "Unshare" : "Share",
                        },
                        { key: "delete", label: "Delete" },
                      ].map((action) => (
                        <button
                          key={action.key}
                          type="button"
                          onClick={() =>
                            handleNotebookAction(action.key, notebook)
                          }
                          className={`block w-full px-3 py-2 text-left text-sm ${action.key === "delete" ? "text-red-500" : isDark ? "text-white/85" : "text-slate-700"} ${isDark ? "hover:bg-white/10" : "hover:bg-slate-50"}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {notebook.isShared && (
                  <span
                    className={`rounded-full px-2 py-0.5 ${isDark ? "bg-white/10 text-white/80" : "bg-orange-100 text-orange-700"}`}
                  >
                    Shared
                  </span>
                )}
                {notebook.isFavorite && (
                  <span
                    className={`rounded-full px-2 py-0.5 ${isDark ? "bg-white/10 text-white/80" : "bg-orange-100 text-orange-700"}`}
                  >
                    Favorite
                  </span>
                )}
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={onCreateNotebook}
            className={`hidden min-h-[165px] items-center justify-center rounded-2xl border-2 border-dashed text-sm font-semibold lg:flex ${
              isDark
                ? "border-orange-200 text-white/70 hover:border-orange-300"
                : "border-orange-200 text-orange-600 hover:border-orange-300"
            }`}
          >
            + Create Notebook
          </button>
        </section>

        <section className="hidden lg:block">
          <h3 className="mb-4 text-lg font-bold">Recent Activity</h3>
          <div
            className={`overflow-hidden rounded-2xl border ${isDark ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white/70"}`}
          >
            <table className="w-full text-left text-sm">
              <thead
                className={`${isDark ? "border-b border-white/10 text-white/45" : "border-b border-slate-200 text-slate-500"} text-xs uppercase tracking-[0.12em]`}
              >
                <tr>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Notebook</th>
                  <th className="px-6 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody
                className={`${isDark ? "divide-y divide-white/5 text-white/85" : "divide-y divide-slate-100 text-slate-700"}`}
              >
                {(activityLog || []).slice(0, 6).map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3">{item.action}</td>
                    <td className="px-6 py-3">{item.notebookTitle}</td>
                    <td
                      className={`px-6 py-3 text-right ${isDark ? "text-white/50" : "text-slate-500"}`}
                    >
                      {getRelativeTime(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <QuickInsightsPanel
        isDark={isDark}
        isCollapsed={isInsightsCollapsed}
        notebooks={notebooks}
        sharedCount={sharedCount}
        favoriteCount={favoriteCount}
        storagePercent={storagePercent}
        recentNotebooks={recentNotebooks}
        onToggleCollapse={toggleInsightsCollapsed}
        onOpenNotebook={onOpenNotebook}
        getRelativeTime={getRelativeTime}
      />

      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t px-4 py-2.5 backdrop-blur-xl lg:hidden ${isDark ? "border-white/10 bg-black/85" : "border-orange-100 bg-white/92"}`}
      >
        {[
          { label: "Home", action: onGoHome },
          { label: "Library", action: () => {} },
          { label: "", action: onCreateNotebook },
          { label: "Sources", action: onGoSources },
          { label: "Profile", action: onGoProfile },
        ].map((item, idx) => (
          <button
            key={`${item.label}-${idx}`}
            type="button"
            onClick={item.action}
            className={`flex min-w-[56px] flex-col items-center justify-center transition ${idx === 2 ? "-mt-8 h-14 w-14 rounded-full bg-[#f15a0f] text-white shadow-[0_10px_24px_rgba(241,90,15,0.45)] hover:scale-105" : "gap-1 py-1 hover:-translate-y-0.5"}`}
          >
            {idx === 2 ? (
              <span className="text-2xl font-bold leading-none">+</span>
            ) : (
              <>
                <span
                  className={`${idx === 1 ? "text-[#f15a0f]" : isDark ? "text-white/65" : "text-slate-400"}`}
                >
                  {idx === 0 && (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 11.5 12 4l9 7.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 10.5V20h12v-9.5"
                      />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 3h11a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 19a2 2 0 0 0-2 2h11"
                      />
                    </svg>
                  )}
                  {idx === 3 && (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h16M4 12h16M4 17h10"
                      />
                    </svg>
                  )}
                  {idx === 4 && (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 20a7 7 0 0 1 14 0"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-[10px] ${idx === 1 ? "font-bold text-[#f15a0f]" : isDark ? "text-white/55" : "text-slate-400"}`}
                >
                  {item.label}
                </span>
              </>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default DashboardPage;
