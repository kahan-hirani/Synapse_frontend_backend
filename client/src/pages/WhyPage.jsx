import ScrollReveal from '../components/bits/ScrollReveal';

function WhyPage() {
  return (
    <section className="space-y-8">
      <ScrollReveal>
        <article className="glass-panel p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Why NotebookLM</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-white md:text-5xl">
            A research cockpit built for signal, not noise.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            NotebookLM keeps your thinking grounded in source material while giving you fast conversational workflows. It is designed for deep understanding, not shallow summaries.
          </p>
        </article>
      </ScrollReveal>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Grounded by citations', 'Every answer is tied back to your uploaded documents for trust and traceability.'],
          ['Built for iteration', 'Switch between notebooks, upload new sources, and continue conversations without losing context.'],
          ['Calm interface', 'High-contrast monochrome visuals reduce distraction and keep attention on ideas.'],
        ].map(([title, body], index) => (
          <ScrollReveal key={title} delay={index * 90}>
            <article className="glass-panel h-full cursor-pointer p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/40 hover:shadow-[0_16px_40px_rgba(255,255,255,0.05)]">
              <h2 className="font-display text-xl text-white">{title}</h2>
              <p className="mt-3 text-sm text-slate-400">{body}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={120}>
        <article className="glass-panel p-7 md:p-10">
          <h2 className="font-display text-2xl text-white">Who benefits most</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-white/25">
              <h3 className="font-display text-lg text-white">Students and researchers</h3>
              <p className="mt-2 text-sm text-slate-400">Turn long PDFs into active study sessions with question-led exploration.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-white/25">
              <h3 className="font-display text-lg text-white">Product and strategy teams</h3>
              <p className="mt-2 text-sm text-slate-400">Digest specs, reports, and briefs faster while preserving source confidence.</p>
            </div>
          </div>
        </article>
      </ScrollReveal>
    </section>
  );
}

export default WhyPage;
