import { Link } from 'react-router-dom';
import GlowButton from '../bits/GlowButton';

function MarketingFooter({ onTryNotebook }) {
  const footerLinks = {
    Product: [
      { label: 'Features', to: '/features' },
      { label: 'Workflow', to: '/workflow' },
      { label: 'Why Synapse', to: '/why' },
    ],
    Company: [
      { label: 'Contact', to: '/contact' },
      { label: 'Home', to: '/' },
    ],
    Resources: [
      { label: 'Status', to: '/contact' },
      { label: 'Support', to: '/contact' },
    ],
  };

  return (
    <footer className="relative mt-12 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#141414_0%,#0f0f0f_52%,#1b1615_100%)] px-5 py-7 sm:rounded-[2.2rem] sm:px-8 md:mt-16 md:px-10 md:py-10">
      <div className="orange-corona absolute -left-14 bottom-0 h-44 w-44 rounded-full opacity-70" />
      <div className="orange-corona absolute right-0 top-0 h-56 w-56 rounded-full opacity-50" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/75">Synapse</p>
          <h3 className="mt-3 max-w-xl font-display text-3xl leading-[0.95] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl">
            Notebook workflow built around source-backed answers.
          </h3>
          <p className="mt-4 max-w-lg text-sm text-slate-300">
            Upload documents, ask focused questions, verify citations, and share findings with your team.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className="rounded-full bg-[#201914] px-3 py-2 text-orange-100/85">Citation-first</span>
            <span className="rounded-full bg-[#201914] px-3 py-2 text-orange-100/85">Notebook-based</span>
            <span className="rounded-full bg-[#201914] px-3 py-2 text-orange-100/85">Team-ready</span>
          </div>

          <GlowButton
            className="kinetic-primary-btn btn mt-6 rounded-xl border-none px-6 text-sm font-semibold text-black"
            onClick={onTryNotebook}
          >
            Try Notebook
          </GlowButton>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/80">{title}</p>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="transition hover:text-orange-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-start justify-between gap-4 border-t border-orange-100/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <p>Copyright {new Date().getFullYear()} Synapse AI. All rights reserved.</p>
          <p>
            Made with love by{' '}
            <a
              href="https://github.com/kahan-hirani"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-200 transition hover:text-orange-100"
            >
              Kahan Hirani
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/contact" className="transition hover:text-orange-200">
            Privacy
          </Link>
          <Link to="/contact" className="transition hover:text-orange-200">
            Terms
          </Link>
          <Link to="/contact" className="transition hover:text-orange-200">
            Contact
          </Link>
          <a
            href="https://github.com/kahan-hirani"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-orange-200"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kahan-hirani-7934b92ab/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-orange-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
