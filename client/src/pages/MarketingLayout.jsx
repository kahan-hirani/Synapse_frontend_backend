import { NavLink, Outlet } from 'react-router-dom';
import GlowButton from '../components/bits/GlowButton';
import MonoBackground from '../components/bits/MonoBackground';
import MarketingFooter from '../components/app/MarketingFooter';

function navClass({ isActive }) {
  return `whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium tracking-wide transition sm:px-4 sm:text-sm ${isActive ? 'bg-[#f15a0f] text-black' : 'text-white/75 hover:bg-[#2a1b12] hover:text-orange-100'}`;
}

function MarketingLayout({ onTryNotebook, authModal }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-white">
      <MonoBackground />

      <header className="fixed inset-x-0 top-0 z-30 p-3 sm:p-4 md:px-6 lg:px-10">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl bg-[rgba(38,24,17,0.62)] px-3 py-2.5 backdrop-blur-2xl sm:px-4 sm:py-3 md:px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f15a0f] text-black shadow-[0_0_28px_rgba(241,90,15,0.32)]">
              <span className="h-3 w-3 rotate-45 bg-black/90" />
            </span>
            <p className="font-display text-lg tracking-tight sm:text-xl lg:text-2xl">Synapse</p>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/features" className={navClass}>
              Features
            </NavLink>
            <NavLink to="/workflow" className={navClass}>
              Workflow
            </NavLink>
            <NavLink to="/why" className={navClass}>
              Why Synapse
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </div>

          <GlowButton
            className="kinetic-primary-btn btn rounded-xl border-none px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black sm:px-5 sm:py-2.5 sm:text-xs md:text-sm"
            onClick={onTryNotebook}
          >
            Try Notebook
          </GlowButton>
        </nav>

        <nav className="mx-auto mt-2 flex w-full max-w-7xl items-center gap-2 overflow-x-auto rounded-2xl bg-[rgba(32,22,16,0.74)] p-2 backdrop-blur-xl lg:hidden">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/features" className={navClass}>
            Features
          </NavLink>
          <NavLink to="/workflow" className={navClass}>
            Workflow
          </NavLink>
          <NavLink to="/why" className={navClass}>
            Why
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-44 sm:px-6 sm:pt-48 md:px-7 md:pt-52 lg:px-8 lg:pt-32">
        <Outlet />
        <MarketingFooter onTryNotebook={onTryNotebook} />
      </main>

      {authModal}
    </div>
  );
}

export default MarketingLayout;
