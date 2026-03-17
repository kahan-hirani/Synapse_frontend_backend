import { useMemo } from 'react';
import AppSidebar from '../components/app/AppSidebar';
import { useSidebarState } from '../app/SidebarContext';

function HomePage({ user, notebooks, theme, onGoLibrary, onGoSources, onGoProfile, onOpenNotebook, onLogout }) {
  const { isCollapsed, toggleCollapsed } = useSidebarState();
  const isDark = theme === 'dark';

  const recentNotebooks = useMemo(
    () => [...notebooks].sort((a, b) => new Date(b.lastEditedAt || b.createdAt) - new Date(a.lastEditedAt || a.createdAt)).slice(0, 6),
    [notebooks],
  );

  const sourceCount = notebooks.reduce((sum, notebook) => sum + (notebook.sources?.length || 0), 0);

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
          { label: 'Home', active: true, onClick: () => {} },
          { label: 'Library', active: false, onClick: onGoLibrary },
          { label: 'Sources', active: false, onClick: onGoSources },
        ]}
      />

      <main className="flex-1 px-5 pb-28 pt-6 lg:px-10 lg:py-10">
        <section className="rounded-3xl bg-[radial-gradient(circle_at_top_left,#f15a0f33,transparent_45%),radial-gradient(circle_at_90%_10%,#4f46e533,transparent_40%)] p-6 lg:p-10">
          <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Welcome</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-5xl">Hi {user?.username || 'there'}, ready to build your next notebook?</h1>
          <p className={`mt-3 max-w-2xl text-sm lg:text-base ${isDark ? 'text-white/65' : 'text-slate-600'}`}>
            This home view keeps your important actions in one place so you can jump into your research quickly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onGoLibrary}
              className="rounded-xl bg-[#f15a0f] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#de5009]"
            >
              Open Library
            </button>
            <button
              type="button"
              onClick={onGoSources}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                isDark ? 'border-white/20 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              Manage Sources
            </button>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Total notebooks', value: notebooks.length },
            { label: 'Total sources', value: sourceCount },
            { label: 'Active chats', value: notebooks.filter((item) => item.sources?.length).length },
          ].map((stat) => (
            <article
              key={stat.label}
              className={`rounded-2xl border p-5 transition hover:-translate-y-1 ${
                isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white/70'
              }`}
            >
              <p className={`text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{stat.label}</p>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">Recent notebooks</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentNotebooks.map((notebook) => (
              <button
                key={notebook.id}
                type="button"
                onClick={() => onOpenNotebook(notebook.id)}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                  isDark ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]' : 'border-slate-200 bg-white/75 hover:bg-white'
                }`}
              >
                <p className="text-sm font-semibold">{notebook.title}</p>
                <p className={`mt-1 text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{notebook.sources.length} sources</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
