import { useMemo } from 'react';
import AppSidebar from '../components/app/AppSidebar';
import { useSidebarState } from '../app/SidebarContext';

function HomePage({ user, notebooks, theme, onGoLibrary, onGoSources, onGoProfile, onOpenNotebook, onCreateNotebook, onLogout }) {
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

      <nav className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t px-4 py-2.5 backdrop-blur-xl lg:hidden ${isDark ? 'border-white/10 bg-black/85' : 'border-orange-100 bg-white/92'}`}>
        {[
          { label: 'Home', action: () => {} },
          { label: 'Library', action: onGoLibrary },
          { label: '', action: onCreateNotebook },
          { label: 'Sources', action: onGoSources },
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
                <span className={`${idx === 0 ? 'text-[#f15a0f]' : isDark ? 'text-white/65' : 'text-slate-400'}`}>
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
                <span className={`text-[10px] ${idx === 0 ? 'font-bold text-[#f15a0f]' : isDark ? 'text-white/55' : 'text-slate-400'}`}>{item.label}</span>
              </>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default HomePage;
