function QuickInsightsPanel({
  isDark,
  isCollapsed,
  notebooks,
  sharedCount,
  favoriteCount,
  storagePercent,
  recentNotebooks,
  onToggleCollapse,
  onOpenNotebook,
  getRelativeTime,
}) {
  return (
    <aside
      className={`hidden xl:sticky xl:top-0 xl:h-screen xl:shrink-0 xl:overflow-hidden xl:flex-col xl:border-l xl:p-5 xl:backdrop-blur-md xl:transition-all xl:duration-300 xl:ease-out ${
        isDark ? 'xl:border-white/10 xl:bg-black/40' : 'xl:border-slate-200 xl:bg-white/65'
      } ${isCollapsed ? 'xl:flex xl:w-[74px]' : 'xl:flex xl:w-80'}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={`overflow-hidden text-lg font-bold transition-all duration-300 ${
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}
        >
          Quick Insights
        </h2>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-lg p-2 transition hover:bg-black/10"
          aria-label="Toggle insights panel"
        >
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className={`transition-all duration-300 ${isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <article className={`rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f15a0f]">Overview</p>
          <p className="mt-2 text-sm">You have {notebooks.length} notebooks, {sharedCount} shared, and {favoriteCount} favorited.</p>
        </article>

        <article className={`mt-4 rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f15a0f]">Storage</p>
          <div className={`mt-3 h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <div className="h-2 rounded-full bg-[#f15a0f] transition-all duration-500" style={{ width: `${storagePercent}%` }} />
          </div>
          <p className={`mt-2 text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{storagePercent}% used from source volume</p>
        </article>

        <article className={`mt-4 rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f15a0f]">Jump Back In</p>
          <div className="mt-3 space-y-2">
            {recentNotebooks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenNotebook(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{item.title}</span>
                <span className={`ml-2 text-xs ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                  {getRelativeTime(item.lastEditedAt || item.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </article>
      </div>
    </aside>
  );
}

export default QuickInsightsPanel;
