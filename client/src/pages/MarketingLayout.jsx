import { NavLink, Outlet } from 'react-router-dom';
import GlowButton from '../components/bits/GlowButton';
import MonoBackground from '../components/bits/MonoBackground';

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-white text-black' : 'text-white/80 hover:text-white hover:bg-white/10'}`;
}

function MarketingLayout({ onTryNotebook }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 text-base-content">
      <MonoBackground />

      <header className="fixed inset-x-0 top-0 z-30 p-4 md:px-10">
        <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <p className="font-display text-2xl tracking-tight">NotebookLM</p>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/why" className={navClass}>
              Why NotebookLM
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </div>

          <GlowButton
            className="btn glass-pill border-white/30 bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-slate-100"
            onClick={onTryNotebook}
          >
            Try Notebook
          </GlowButton>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MarketingLayout;
