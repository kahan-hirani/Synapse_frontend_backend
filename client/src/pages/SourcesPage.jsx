import { useMemo, useState } from 'react';
import AppSidebar from '../components/app/AppSidebar';
import { useSidebarState } from '../app/SidebarContext';

function SourcesPage({ user, notebooks, theme, onGoHome, onGoLibrary, onGoProfile, onOpenNotebook, onLogout }) {
  const { isCollapsed, toggleCollapsed } = useSidebarState();
  const [query, setQuery] = useState('');
  const isDark = theme === 'dark';

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

    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => item.sourceName.toLowerCase().includes(normalized) || item.notebookTitle.toLowerCase().includes(normalized));
  }, [notebooks, query]);

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

      <main className="flex-1 px-5 pb-24 pt-6 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sources</h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>All uploaded references across your notebooks.</p>
          </div>
          <label className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-[#f15a0f]/40 ${isDark ? 'border-white/15 bg-white/[0.03] focus-within:border-[#f15a0f]' : 'border-slate-200 bg-white focus-within:border-[#f15a0f]'}`}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M5.5 10.5a5 5 0 1 0 10 0 5 5 0 0 0-10 0Z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sources or notebooks"
              className={`w-72 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder:text-white/35' : 'text-slate-700 placeholder:text-slate-400'}`}
            />
          </label>
        </div>

        <div className={`overflow-hidden rounded-2xl border ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'}`}>
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
                  <td className="px-5 py-3">{item.sourceName}</td>
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
      </main>
    </div>
  );
}

export default SourcesPage;
