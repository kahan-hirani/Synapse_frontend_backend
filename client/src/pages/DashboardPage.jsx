function DashboardPage({ user, notebooks, onCreateNotebook, onOpenNotebook, onLogout, onGoProfile }) {
  const initials = (user?.username || 'John Doe')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const visibleNotebooks = notebooks.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111827] lg:flex lg:bg-[#050505] lg:text-white">
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-white/10 lg:bg-black/40 lg:backdrop-blur-md">
        <div className="p-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <div className="h-4 w-4 rounded-sm bg-black" />
            </div>
            <span className="text-xl font-semibold tracking-tight">NotebookLM</span>
          </div>

          <nav className="space-y-1 text-sm">
            <button type="button" className="flex w-full items-center rounded-xl px-4 py-3 text-white/55 hover:bg-white/5 hover:text-white">Home</button>
            <button type="button" className="flex w-full items-center rounded-xl bg-white/10 px-4 py-3 font-medium text-white">Library</button>
            <button type="button" className="flex w-full items-center rounded-xl px-4 py-3 text-white/55 hover:bg-white/5 hover:text-white">Sources</button>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-6">
          <button type="button" className="mb-2 flex w-full items-center rounded-xl bg-white/10 px-4 py-3 text-left text-white">Settings</button>
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">{initials || 'JD'}</div>
            <span className="text-sm font-medium">{user?.username || 'John Doe'}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-5 pb-28 pt-6 lg:px-10 lg:py-8">
        <header className="mb-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 6h10v12H7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6" />
              </svg>
            </div>
            <h1 className="text-base font-bold tracking-tight">NotebookLM</h1>
          </div>
          <button type="button" onClick={onGoProfile} className="rounded-full p-2 text-slate-700 hover:bg-slate-200">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 20a7 7 0 0 1 14 0" />
            </svg>
          </button>
        </header>

        <section className="mb-8 lg:mb-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-[#0f172a] lg:text-4xl lg:text-white">My Library</h2>
              <p className="mt-1.5 text-sm text-[#64748b] lg:text-white/50">Manage your research notebooks and sources</p>
            </div>
            <button type="button" onClick={onCreateNotebook} className="hidden rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 lg:inline-flex">
              + New Notebook
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 backdrop-blur lg:rounded-none lg:border-none lg:bg-transparent lg:p-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex w-full items-center gap-3 rounded-2xl bg-[#f7f7f7] px-4 py-3 lg:max-w-md lg:border lg:border-white/10 lg:bg-white/5">
                <svg className="h-6 w-6 text-[#94a3b8] lg:text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M5.5 10.5a5 5 0 1 0 10 0 5 5 0 0 0-10 0Z" />
                </svg>
                <input type="text" placeholder="Search notebooks..." className="w-full bg-transparent text-sm text-[#334155] outline-none placeholder:text-[#667085] lg:text-sm lg:text-white lg:placeholder:text-white/35" />
              </label>

              <div className="flex gap-2 overflow-x-auto">
                {['All', 'Recent', 'Shared', 'Favorites'].map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition lg:px-5 lg:py-2 lg:text-sm ${
                      index === 0 ? 'bg-black text-white lg:bg-[#4c1d95]' : 'bg-[#ececec] text-[#111827] lg:bg-black/40 lg:text-white/70'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
          <button
            type="button"
            onClick={onCreateNotebook}
            className="order-last flex min-h-[230px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#c7d2e1] bg-transparent p-6 text-center transition hover:border-[#94a3b8] lg:order-first lg:rounded-2xl lg:border-white/25 lg:text-white"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#e2e8f0] text-2xl text-[#64748b] lg:bg-white/10 lg:text-white">+</div>
            <p className="text-base font-semibold text-[#334155] lg:text-sm lg:text-white">Create Blank Notebook</p>
          </button>

          {visibleNotebooks.map((notebook) => (
            <button
              key={notebook.id}
              type="button"
              onClick={() => onOpenNotebook(notebook.id)}
              className="rounded-[2rem] border border-slate-200 bg-white/70 p-6 text-left transition hover:-translate-y-1 lg:min-h-[220px] lg:rounded-2xl lg:border-white/10 lg:bg-white/[0.04]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 text-2xl lg:bg-white/10">{notebook.icon}</div>
                <span className="text-lg leading-none text-[#94a3b8] lg:text-white/45">...</span>
              </div>
              <h3 className="text-xl font-bold leading-tight text-[#0f172a] lg:text-lg lg:text-white">{notebook.title}</h3>
              <p className="mt-2 text-sm text-[#64748b] lg:text-sm lg:text-white/55">{notebook.sources.length} sources • Edited recently</p>
            </button>
          ))}
        </section>

        <section className="mt-10 hidden lg:block">
          <h3 className="mb-4 text-xl font-bold">Recent Activity</h3>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-white/45">
                <tr>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Notebook</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white/80">
                <tr>
                  <td className="px-6 py-4">Updated "Sources" document</td>
                  <td className="px-6 py-4">Project Phoenix</td>
                  <td className="px-6 py-4 text-right text-white/45">12 min ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Added 3 new PDF files</td>
                  <td className="px-6 py-4">Marketing Strategy</td>
                  <td className="px-6 py-4 text-right text-white/45">45 min ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Generated AI Summary</td>
                  <td className="px-6 py-4">Technical Specs</td>
                  <td className="px-6 py-4 text-right text-white/45">3 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <button type="button" onClick={onLogout} className="mt-8 w-full rounded-2xl border-2 border-[#cfd7e5] py-3 text-sm font-bold text-[#8fa0bb] lg:hidden">
          Log Out
        </button>
      </main>

      <aside className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:w-80 xl:shrink-0 xl:flex-col xl:border-l xl:border-white/10 xl:bg-black/40 xl:p-6 xl:backdrop-blur-md">
        <h2 className="text-lg font-bold text-white">Quick Insights</h2>
        <p className="text-xs text-white/45">AI-powered summary of your library</p>

        <div className="mt-6 space-y-5">
          <article className="rounded-xl border border-blue-500/30 bg-black/50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-300">Trending Topic</p>
            <p className="mt-4 text-sm text-white/85">"Propulsion systems" appears in 14 of your sources across 2 notebooks.</p>
            <p className="mt-4 text-sm font-semibold text-white">View connection</p>
          </article>

          <article className="rounded-xl border border-white/10 bg-black/40 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Recommendation</p>
            <p className="mt-4 text-sm text-white/85">You haven't updated the 'Technical Specs' notebook in 3 days. Need a refresher?</p>
          </article>
        </div>

        <div className="mt-auto rounded-2xl border border-white/15 bg-white/[0.04] p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-white/50">
            <span>Storage</span>
            <span>42%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-[42%] rounded-full bg-blue-500" />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-white/40">
            <span>4.2 GB / 10 GB</span>
            <span className="font-semibold text-white/70">UPGRADE</span>
          </div>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-[#dde3ef] bg-white/90 px-6 py-3 backdrop-blur-xl lg:hidden">
        {['Library', 'Notebook', '', 'Explore', 'Settings'].map((item, idx) => (
          <button
            key={`${item}-${idx}`}
            type="button"
            onClick={idx === 2 ? onCreateNotebook : undefined}
            className={`flex flex-col items-center justify-center ${idx === 2 ? '-mt-10 h-16 w-16 rounded-full bg-black text-white' : ''}`}
          >
            {idx === 2 ? <span className="text-2xl leading-none font-bold">+</span> : <span className={`text-[11px] ${idx === 0 ? 'font-bold text-black' : 'text-[#8ea0bd]'}`}>{item}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default DashboardPage;
