import { useMemo, useState } from 'react';
import AppSidebar from '../components/app/AppSidebar';
import { useSidebarState } from '../app/SidebarContext';

function shortenSourceName(name, maxLength = 28) {
  const value = String(name || '').trim();
  if (!value) return 'Untitled source';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function SourcesPage({ user, notebooks, theme, onGoHome, onGoLibrary, onGoProfile, onCreateNotebook, onOpenNotebook, onLogout }) {
  const { isCollapsed, toggleCollapsed } = useSidebarState();
  const [query, setQuery] = useState('');
  const [selectedNotebookId, setSelectedNotebookId] = useState('all');
  const isDark = theme === 'dark';

  const notebookFilters = useMemo(
    () => notebooks.filter((item) => (item.sources || []).length > 0).map((item) => ({ id: item.id, title: item.title })),
    [notebooks],
  );

  const sources = useMemo(() => {
    const items = notebooks.flatMap((notebook) =>
      (notebook.sources || []).map((source) => ({
        sourceId: source.id,
        sourceName: source.name,
        notebookId: notebook.id,
        notebookTitle: notebook.title,
        addedAt: source.addedAt,
      })),
    );

    const byNotebook =
      selectedNotebookId === 'all' ? items : items.filter((item) => String(item.notebookId) === String(selectedNotebookId));

    const normalized = query.trim().toLowerCase();
    if (!normalized) return byNotebook;
    return byNotebook.filter((item) => item.sourceName.toLowerCase().includes(normalized) || item.notebookTitle.toLowerCase().includes(normalized));
  }, [notebooks, query, selectedNotebookId]);

  return (
    <div className={`min-h-screen lg:flex ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f2f2f2] text-[#111827]'}`}>
      <AppSidebar
        isDark={isDark}
        user={user}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
        onGoProfile={onGoProfile}
        onLogout={onLogout}
        navItems={[
          { label: 'Home', active: false, onClick: onGoHome },
          { label: 'Library', active: false, onClick: onGoLibrary },
          { label: 'Sources', active: true, onClick: () => {} },
        ]}
      />

      <main className="flex-1 px-4 pb-24 pt-4 sm:px-5 sm:pt-6 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sources</h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>All uploaded references across your notebooks.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <label className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-white/[0.03]' : 'border-slate-200 bg-white'}`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
              </svg>
              <select
                value={selectedNotebookId}
                onChange={(event) => setSelectedNotebookId(event.target.value)}
                className={`w-[170px] bg-transparent text-sm outline-none ${isDark ? 'text-white' : 'text-slate-700'}`}
              >
                <option value="all">All notebooks</option>
                {notebookFilters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>

            <label className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-[#f15a0f]/40 ${isDark ? 'border-white/15 bg-white/[0.03] focus-within:border-[#f15a0f]' : 'border-slate-200 bg-white focus-within:border-[#f15a0f]'}`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M5.5 10.5a5 5 0 1 0 10 0 5 5 0 0 0-10 0Z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sources or notebooks"
                className={`w-[220px] bg-transparent text-sm outline-none sm:w-72 ${isDark ? 'text-white placeholder:text-white/35' : 'text-slate-700 placeholder:text-slate-400'}`}
              />
            </label>
          </div>
        </div>

        <div className={`hidden overflow-hidden rounded-2xl border lg:block ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'}`}>
          <table className="w-full text-left text-sm">
            <thead className={`${isDark ? 'border-b border-white/10 text-white/45' : 'border-b border-slate-200 text-slate-500'} text-xs uppercase tracking-[0.12em]`}>
              <tr>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Notebook</th>
                <th className="px-5 py-3">Added</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`${isDark ? 'divide-y divide-white/5 text-white/90' : 'divide-y divide-slate-100 text-slate-700'}`}>
              {sources.map((item) => (
                <tr key={item.sourceId}>
                  <td className="px-5 py-3" title={item.sourceName}>{shortenSourceName(item.sourceName)}</td>
                  <td className="px-5 py-3">{item.notebookTitle}</td>
                  <td className={`px-5 py-3 ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
                    {item.addedAt ? new Date(item.addedAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenNotebook(item.notebookId)}
                      className="rounded-lg bg-[#f15a0f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#de5009]"
                    >
                      Open Notebook
                    </button>
                  </td>
                </tr>
              ))}
              {sources.length === 0 && (
                <tr>
                  <td colSpan="4" className={`px-5 py-8 text-center ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
                    No sources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {sources.map((item) => (
            <article
              key={item.sourceId}
              className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-orange-100 bg-white/85'}`}
            >
              <p className="line-clamp-1 text-sm font-semibold" title={item.sourceName}>{shortenSourceName(item.sourceName, 24)}</p>
              <p className={`mt-1 text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{item.notebookTitle}</p>
              <p className={`mt-1 text-[11px] ${isDark ? 'text-white/45' : 'text-slate-400'}`}>
                Added {item.addedAt ? new Date(item.addedAt).toLocaleDateString() : 'Unknown'}
              </p>
              <button
                type="button"
                onClick={() => onOpenNotebook(item.notebookId)}
                className="mt-3 rounded-xl bg-[#f15a0f] px-3 py-2 text-xs font-semibold text-white"
              >
                Open Notebook
              </button>
            </article>
          ))}

          {sources.length === 0 && (
            <div className={`rounded-2xl border px-4 py-8 text-center text-sm ${isDark ? 'border-white/10 bg-white/[0.03] text-white/55' : 'border-slate-200 bg-white/85 text-slate-500'}`}>
              No sources found.
            </div>
          )}
        </div>
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t px-4 py-2.5 backdrop-blur-xl lg:hidden ${isDark ? 'border-white/10 bg-black/85' : 'border-orange-100 bg-white/92'}`}>
        {[
          { label: 'Home', action: onGoHome },
          { label: 'Library', action: onGoLibrary },
          { label: '', action: onCreateNotebook },
          { label: 'Sources', action: () => {} },
          { label: 'Profile', action: onGoProfile },
        ].map((item, idx) => (
          <button
            key={`${item.label}-${idx}`}
            type="button"
            onClick={item.action}
            className={`flex min-w-[56px] flex-col items-center justify-center transition ${idx === 2 ? '-mt-8 h-14 w-14 rounded-full bg-[#f15a0f] text-white shadow-[0_10px_24px_rgba(241,90,15,0.45)] hover:scale-105' : 'gap-1 py-1 hover:-translate-y-0.5'}`}
          >
            {idx === 2 ? (
              <span className="text-2xl font-bold leading-none">+</span>
            ) : (
              <>
                <span className={`${idx === 3 ? 'text-[#f15a0f]' : isDark ? 'text-white/65' : 'text-slate-400'}`}>
                  {idx === 0 && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5V20h12v-9.5" />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h11a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 19a2 2 0 0 0-2 2h11" />
                    </svg>
                  )}
                  {idx === 3 && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
                    </svg>
                  )}
                  {idx === 4 && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20a7 7 0 0 1 14 0" />
                    </svg>
                  )}
                </span>
                <span className={`text-[10px] ${idx === 3 ? 'font-bold text-[#f15a0f]' : isDark ? 'text-white/55' : 'text-slate-400'}`}>{item.label}</span>
              </>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default SourcesPage;
