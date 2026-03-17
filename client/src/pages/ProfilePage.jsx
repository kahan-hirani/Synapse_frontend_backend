function ProfilePage({ user, notebooks, onGoDashboard, onLogout }) {
  const initials = (user?.username || 'John Doe')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const totalSources = notebooks.reduce((sum, nb) => sum + (nb.sources?.length || 0), 0);

  const settingsRows = [
    {
      label: 'Personal Information',
      desc: 'Manage your name, email, and photo',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Notifications',
      desc: 'Choose what you want to be notified about',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      label: 'Security & Privacy',
      desc: 'Password, 2FA, and sessions',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Appearance',
      desc: 'Theme, display, and accessibility',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111827] lg:flex lg:bg-[#050505] lg:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-white/10 lg:bg-black/40 lg:backdrop-blur-md">
        <div className="p-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <div className="h-4 w-4 rounded-sm bg-black" />
            </div>
            <span className="text-xl font-semibold tracking-tight">NotebookLM</span>
          </div>
          <nav className="space-y-1 text-sm">
            <button type="button" onClick={onGoDashboard} className="flex w-full items-center rounded-xl px-4 py-3 text-white/55 hover:bg-white/5 hover:text-white">Home</button>
            <button type="button" onClick={onGoDashboard} className="flex w-full items-center rounded-xl px-4 py-3 text-white/55 hover:bg-white/5 hover:text-white">Library</button>
            <button type="button" onClick={onGoDashboard} className="flex w-full items-center rounded-xl px-4 py-3 text-white/55 hover:bg-white/5 hover:text-white">Sources</button>
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

      {/* Desktop Main */}
      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-6 lg:max-w-4xl lg:px-10 lg:py-10">
        {/* Mobile header */}
        <header className="mb-6 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold tracking-tight">Account</h1>
          <button type="button" className="rounded-full p-2 text-slate-600 hover:bg-slate-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </button>
        </header>

        {/* Profile header */}
        <section className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:mb-10">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-500 bg-gradient-to-tr from-gray-700 to-gray-500 text-2xl font-bold text-white lg:h-24 lg:w-24">
                {initials || 'JD'}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-gray-100 transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold lg:text-3xl">{user?.username || 'John Doe'}</h2>
              <p className="mt-0.5 text-sm text-[#64748b] lg:text-gray-400">{user?.email || 'user@example.com'}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white lg:inline-flex hidden">Pro Plan</span>
                <span className="rounded-full border border-slate-200 bg-white/60 px-2.5 py-0.5 text-xs font-semibold text-slate-500 lg:hidden">PRO PLAN</span>
                <span className="hidden text-xs italic text-gray-500 lg:inline">Member since Jan 2024</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex gap-3">
            <button type="button" className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition">
              View Public Profile
            </button>
            <button type="button" className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200 transition">
              Edit Profile
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur lg:border-white/10 lg:bg-white/[0.04]">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 lg:border lg:border-white/10 lg:bg-white/5">
                <svg className="h-4 w-4 text-slate-500 lg:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-emerald-500 lg:text-emerald-400">+3 this week</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0f172a] lg:text-4xl lg:text-white">{notebooks.length}</p>
            <p className="mt-1 text-xs text-[#64748b] lg:text-gray-400">Notebooks Created</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur lg:border-white/10 lg:bg-white/[0.04]">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 lg:border lg:border-white/10 lg:bg-white/5">
                <svg className="h-4 w-4 text-slate-500 lg:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-blue-500 lg:text-blue-400">Unlimited Tier</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0f172a] lg:text-4xl lg:text-white">1,284</p>
            <p className="mt-1 text-xs text-[#64748b] lg:text-gray-400">AI Queries this month</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur lg:col-span-1 lg:border-white/10 lg:bg-white/[0.04]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 lg:border lg:border-white/10 lg:bg-white/5">
                <svg className="h-4 w-4 text-slate-500 lg:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className="text-xs text-[#64748b] lg:text-gray-400">Cloud Storage</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#0f172a] lg:text-white">4.2 GB / 10 GB</span>
              <span className="text-[#64748b] lg:text-gray-400">42%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 lg:bg-white/10">
              <div className="h-full w-[42%] rounded-full bg-blue-500" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#64748b] lg:text-gray-500">Personal &amp; Shared</span>
              <button type="button" className="text-xs font-bold text-blue-500 hover:underline">UPGRADE</button>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="mb-8">
          <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-[#64748b] lg:mb-4 lg:text-sm lg:text-white/60">Settings</h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/60 backdrop-blur lg:border-white/10 lg:bg-white/[0.04]">
            {settingsRows.map((row, idx) => (
              <button
                key={row.label}
                type="button"
                className={`flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50 lg:hover:bg-white/5 ${idx < settingsRows.length - 1 ? 'border-b border-slate-100 lg:border-white/5' : ''}`}
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 lg:bg-gray-800 lg:text-gray-300">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0f172a] lg:text-white">{row.label}</p>
                    <p className="hidden text-xs text-gray-500 lg:block">{row.desc}</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-slate-300 lg:text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </section>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 py-3.5 text-sm font-bold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 lg:border-white/10 lg:text-white/40 lg:hover:border-red-500/30 lg:hover:bg-red-500/5 lg:hover:text-red-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          LOG OUT
        </button>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-[#dde3ef] bg-white/90 px-6 py-3 backdrop-blur-xl lg:hidden">
        {[
          { label: 'Library', action: onGoDashboard },
          { label: 'Notebook', action: onGoDashboard },
          { label: '', action: onGoDashboard },
          { label: 'Explore', action: undefined },
          { label: 'Profile', action: undefined },
        ].map((item, idx) => (
          <button
            key={`${item.label}-${idx}`}
            type="button"
            onClick={item.action}
            className={`flex flex-col items-center justify-center ${idx === 2 ? '-mt-10 h-16 w-16 rounded-full bg-black text-white' : ''}`}
          >
            {idx === 2 ? (
              <span className="text-2xl font-bold leading-none">+</span>
            ) : (
              <span className={`text-[11px] ${idx === 4 ? 'font-bold text-black' : 'text-[#8ea0bd]'}`}>{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default ProfilePage;
