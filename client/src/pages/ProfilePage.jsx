import { useMemo, useRef, useState } from 'react';
import AppSidebar from '../components/app/AppSidebar';
import EditProfileModal from '../components/app/EditProfileModal';
import ChangePasswordModal from '../components/app/ChangePasswordModal';
import { useSidebarState } from '../app/SidebarContext';

function ProfilePage({
  user,
  notebooks,
  chatMap,
  theme,
  onUpdateProfile,
  onChangePassword,
  onGoHome,
  onGoLibrary,
  onGoSources,
  onCreateNotebook,
  onOpenNotebook,
  onLogout,
}) {
  const { isCollapsed, toggleCollapsed } = useSidebarState();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const avatarInputRef = useRef(null);
  const isDark = theme === 'dark';
  const initials = (user?.username || 'John Doe')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const totalSources = notebooks.reduce((sum, nb) => sum + (nb.sources?.length || 0), 0);
  const totalQueries = useMemo(
    () => Object.values(chatMap || {}).flat().filter((entry) => entry.role === 'user').length,
    [chatMap],
  );
  const storagePercent = Math.min(100, Math.max(4, Math.round(totalSources * 4.2)));

  const notificationsEnabled = user?.preferences?.notificationsEnabled ?? true;

  const handleToggleNotifications = async () => {
    await onUpdateProfile({ preferences: { notificationsEnabled: !notificationsEnabled } });
  };

  const handleToggleThemePreference = async () => {
    await onUpdateProfile({ preferences: { theme: isDark ? 'light' : 'dark' } });
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== 'string') return;
      await onUpdateProfile({ avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const settingsItems = [
    {
      key: 'personal',
      label: 'Personal Information',
      desc: 'Manage your name, email, and photo',
      onClick: () => setEditModalOpen(true),
      value: null,
    },
    {
      key: 'notifications',
      label: 'Notifications',
      desc: 'Choose what you want to be notified about',
      onClick: handleToggleNotifications,
      value: notificationsEnabled ? 'Enabled' : 'Disabled',
    },
    {
      key: 'security',
      label: 'Security & Privacy',
      desc: 'Password, 2FA, and sessions',
      onClick: () => setPasswordModalOpen(true),
      value: 'Update password',
    },
    {
      key: 'appearance',
      label: 'Appearance',
      desc: 'Theme, display, and accessibility',
      onClick: handleToggleThemePreference,
      value: isDark ? 'Dark Mode' : 'Light Mode',
    },
  ];

  const recentNotebooks = useMemo(
    () => [...notebooks].sort((a, b) => new Date(b.lastEditedAt || b.createdAt) - new Date(a.lastEditedAt || a.createdAt)).slice(0, 4),
    [notebooks],
  );
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'recently';

  return (
    <div className={`min-h-screen lg:flex ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f2f2f2] text-[#111827]'}`}>
      {/* Desktop Sidebar */}
      <AppSidebar
        isDark={isDark}
        user={user}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
        onGoProfile={() => {}}
        profileActive
        onLogout={onLogout}
        navItems={[
          { label: 'Home', active: false, onClick: onGoHome },
          { label: 'Library', active: false, onClick: onGoLibrary },
          { label: 'Sources', active: false, onClick: onGoSources },
        ]}
      />

      {/* Desktop Main */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4 sm:px-5 sm:pt-6 lg:max-w-5xl lg:px-10 lg:py-10">

        {/* Profile header */}
        <section className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:mb-10">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
            <div className="relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user?.username || 'User'} avatar`}
                  className="h-20 w-20 rounded-full border-4 border-[#f15a0f] object-cover lg:h-24 lg:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#f15a0f] bg-gradient-to-tr from-gray-700 to-gray-500 text-2xl font-bold text-white lg:h-24 lg:w-24">
                  {initials || 'JD'}
                </div>
              )}
              <button
                type="button"
                onClick={handleAvatarButtonClick}
                className={`absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition ${
                  isDark ? 'bg-black/80 text-white hover:bg-black' : 'bg-white text-[#0f172a] hover:bg-slate-100'
                }`}
                aria-label="Upload profile image"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h4l2-2h6l2 2h4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold lg:text-3xl">{user?.username || 'John Doe'}</h2>
              <p className={`mt-0.5 text-sm ${isDark ? 'text-gray-400' : 'text-[#64748b]'}`}>{user?.email || 'user@example.com'}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-[#f15a0f]/40 bg-[#f15a0f]/10 px-2.5 py-0.5 text-xs font-semibold text-[#f15a0f]">PRO PLAN</span>
                <span className="hidden text-xs italic text-gray-500 lg:inline">Member since {memberSince}</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex gap-3">
            {/* <button type="button" onClick={() => setEditModalOpen(true)} className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition ${isDark ? 'border-white/10 bg-white/[0.04] text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
              View Public Profile
            </button> */}
            {/* <button type="button" onClick={() => setEditModalOpen(true)} className="rounded-lg bg-[#f15a0f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#de5009] transition">
              Edit Profile
            </button> */}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className={`rounded-2xl border p-5 backdrop-blur ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white/70'}`}>
            <div className="mb-2 flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? 'lg:border lg:border-white/10 lg:bg-white/5' : 'bg-slate-100'}`}>
                <svg className="h-4 w-4 text-slate-500 lg:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-emerald-500">{Math.max(0, notebooks.length - 1)} this week</span>
            </div>
            <p className={`mt-3 text-3xl font-bold lg:text-4xl ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{notebooks.length}</p>
            <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-[#64748b]'}`}>Notebooks Created</p>
          </div>

          <div className={`rounded-2xl border p-5 backdrop-blur ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white/70'}`}>
            <div className="mb-2 flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? 'lg:border lg:border-white/10 lg:bg-white/5' : 'bg-slate-100'}`}>
                <svg className="h-4 w-4 text-slate-500 lg:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-[#f15a0f]">Live</span>
            </div>
            <p className={`mt-3 text-3xl font-bold lg:text-4xl ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{totalQueries}</p>
            <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-[#64748b]'}`}>AI Queries</p>
          </div>

          <div className={`col-span-2 rounded-2xl border p-5 backdrop-blur lg:col-span-1 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white/70'}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? 'lg:border lg:border-white/10 lg:bg-white/5' : 'bg-slate-100'}`}>
                <svg className="h-4 w-4 text-slate-500 lg:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#64748b]'}`}>Cloud Storage</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{(storagePercent / 10).toFixed(1)} GB / 10 GB</span>
              <span className={`${isDark ? 'text-gray-400' : 'text-[#64748b]'}`}>{storagePercent}%</span>
            </div>
            <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
              <div className="h-full rounded-full bg-[#f15a0f]" style={{ width: `${storagePercent}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#64748b]'}`}>Personal &amp; Shared</span>
              <button type="button" className="text-xs font-bold text-[#f15a0f] hover:underline">UPGRADE</button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className={`mb-3 px-1 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/60 lg:text-white/60' : 'text-[#64748b]'}`}>Recent Notebooks</h3>
          <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${isDark ? '' : ''}`}>
            {recentNotebooks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenNotebook(item.id)}
                className={`rounded-xl border p-4 text-left ${isDark ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]' : 'border-slate-200 bg-white/70 hover:bg-white'} transition`}
              >
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{item.title}</p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-[#64748b]'}`}>{item.sources.length} sources</p>
              </button>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="mb-8">
          <h3 className={`mb-3 px-1 text-xs font-bold uppercase tracking-widest lg:mb-4 lg:text-sm ${isDark ? 'text-white/60' : 'text-[#64748b]'}`}>Settings</h3>
          <div className={`overflow-hidden rounded-2xl border backdrop-blur ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white/60'}`}>
            {settingsItems.map((row, idx) => (
              <button
                key={row.key}
                type="button"
                onClick={row.onClick}
                className={`flex w-full items-center justify-between p-4 text-left transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} ${idx < settingsItems.length - 1 ? isDark ? 'border-b border-white/5' : 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{row.label}</p>
                    <p className={`hidden text-xs lg:block ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{row.desc}</p>
                  </div>
                </div>
                {row.value ? (
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isDark ? 'bg-white/10 text-[#ffb286]' : 'bg-orange-100 text-orange-700'}`}>{row.value}</span>
                ) : (
                  <svg className={`h-4 w-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t px-4 py-2.5 backdrop-blur-xl lg:hidden ${isDark ? 'border-white/10 bg-black/85' : 'border-orange-100 bg-white/92'}`}>
        {[
          { label: 'Home', action: onGoHome },
          { label: 'Library', action: onGoLibrary },
          { label: '', action: onCreateNotebook },
          { label: 'Sources', action: onGoSources },
          { label: 'Profile', action: () => {} },
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
                <span className={`${idx === 4 ? 'text-[#f15a0f]' : isDark ? 'text-white/65' : 'text-slate-400'}`}>
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
                <span className={`text-[10px] ${idx === 4 ? 'font-bold text-[#f15a0f]' : isDark ? 'text-white/55' : 'text-slate-400'}`}>{item.label}</span>
              </>
            )}
          </button>
        ))}
      </nav>

      <EditProfileModal
        isOpen={editModalOpen}
        isDark={isDark}
        user={user}
        onClose={() => setEditModalOpen(false)}
        onSave={async (payload) => {
          const updated = await onUpdateProfile(payload);
          if (updated) {
            setEditModalOpen(false);
          }
        }}
      />

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        isDark={isDark}
        onClose={() => setPasswordModalOpen(false)}
        onSave={async (payload) => {
          const updated = await onChangePassword(payload);
          if (updated) {
            setPasswordModalOpen(false);
          }
        }}
      />
    </div>
  );
}

export default ProfilePage;
