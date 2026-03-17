import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';

function LandingPage({ onTryNotebook }) {
  return (
    <section className="space-y-10 pb-10">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <ScrollReveal>
          <article className="glass-panel relative overflow-hidden p-8 md:p-10">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border border-white/25 bg-white/10 blur-2xl" />
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Document intelligence, redesigned</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] text-white md:text-6xl">
              Think with your documents in a sharp monochrome research flow.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
              Upload PDFs, interrogate details, and build insights grounded in citations. A premium workspace tuned for serious reading and synthesis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GlowButton className="btn glass-pill border-white/30 bg-white text-black hover:bg-white/90" onClick={onTryNotebook}>
                Try Notebook
              </GlowButton>
              <span className="glass-pill inline-flex items-center px-5 py-2 text-sm text-slate-400">Cited responses. Faster understanding.</span>
            </div>
          </article>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <aside className="grid gap-4">
            <article className="glass-panel p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/65">Live metrics</p>
              <p className="mt-3 font-display text-4xl text-white">3.2x</p>
              <p className="mt-2 text-sm text-slate-400">Faster review cycles for long-form source material.</p>
            </article>
            <article className="glass-panel p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/65">Workspace modes</p>
              <div className="mt-3 space-y-2 text-sm text-white/80">
                <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Notebook chat</p>
                <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Source explorer</p>
                <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Citation memory</p>
              </div>
            </article>
          </aside>
        </ScrollReveal>
      </div>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          ['Grounded answers', 'Each response maps to your documents so teams can verify what matters.'],
          ['Fluid notebooking', 'Create, switch, and query notebooks with low-friction interactions.'],
          ['Quietly premium UI', 'Glass layers, bold typography, and monochrome contrast built for focus.'],
        ].map(([title, body], idx) => (
          <ScrollReveal key={title} delay={idx * 80}>
            <article className="glass-panel h-full cursor-pointer p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/40 hover:shadow-[0_16px_40px_rgba(255,255,255,0.05)]">
              <h2 className="font-display text-xl text-white">{title}</h2>
              <p className="mt-3 text-sm text-slate-400">{body}</p>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <ScrollReveal delay={140}>
        <section className="glass-panel p-7 md:p-10">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl text-white">Ready to start your first notebook?</h2>
              <p className="mt-2 text-slate-400">Jump into the product app and begin chatting with your documents.</p>
            </div>
            <GlowButton className="btn glass-pill border-white/30 bg-white text-black hover:bg-white/90" onClick={onTryNotebook}>
              Open app.localhost
            </GlowButton>
          </div>
        </section>
      </ScrollReveal>
    </section>
  );
}

export default LandingPage;
