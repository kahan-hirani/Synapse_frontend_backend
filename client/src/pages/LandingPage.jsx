import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';
import { useNavigate } from 'react-router-dom';

function LandingPage({ onTryNotebook }) {
  const navigate = useNavigate();

  const proofStats = [
    { label: 'Avg response latency', value: '1.6s' },
    { label: 'Citation precision', value: '99.2%' },
    { label: 'Teams using weekly', value: '4,300+' },
    { label: 'Docs indexed / day', value: '1.8M' },
  ];

  const features = [
    {
      eyebrow: 'Source-grounded intelligence',
      title: 'Ask questions and trace answers to source passages.',
      body: 'Each response includes citations so teams can verify context before taking action.',
    },
    {
      eyebrow: 'Intentional notebooking',
      title: 'Organize work in notebooks built around real sources.',
      body: 'Keep uploads, prompts, and findings in one place so research remains easy to continue.',
    },
    {
      eyebrow: 'Team acceleration',
      title: 'Share research with teammates without losing context.',
      body: 'Notebook sharing and cited outputs help teams align faster with fewer repeated discussions.',
    },
  ];

  const workflow = [
    ['01', 'Ingest', 'Upload PDFs, docs, and reports. Synapse parses and indexes automatically.'],
    ['02', 'Probe', 'Interrogate your corpus with conversational prompts and citation trails.'],
    ['03', 'Synthesize', 'Export concise, source-backed insight for strategy, research, and ops.'],
  ];

  const workspaceModes = ['Notebook Chat', 'Source Explorer', 'Citation Trail', 'Team Share'];

  return (
    <section className="space-y-10 pb-4 md:space-y-12 lg:space-y-20">
      <ScrollReveal>
        <section className="kinetic-surface relative overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.2rem] sm:p-7 md:p-9 lg:p-12">
          <div className="orange-corona absolute -left-28 top-12 h-56 w-56 rounded-full" />
          <div className="orange-corona absolute -bottom-24 right-10 h-64 w-64 rounded-full opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(249,115,22,0.14),transparent_34%),radial-gradient(circle_at_24%_84%,rgba(251,146,60,0.16),transparent_38%)]" />

          <div className="relative z-10">
            <div>
              <p className="inline-flex items-center rounded-full bg-[#2a1910] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.24em]">
                NotebookLM workflow with citations
              </p>

              <h1 className="mt-6 max-w-5xl font-display text-[2.4rem] leading-[0.9] tracking-[-0.03em] text-white sm:mt-8 sm:text-[3.5rem] md:text-[4.7rem] lg:text-[6.2rem] xl:text-[7.2rem]">
                <span className="kinetic-hero-text block">SUPERCHARGE</span>
                <span className="kinetic-hero-text block [animation-delay:220ms]">YOUR RESEARCH</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm text-slate-300 sm:mt-6 sm:text-base md:text-lg">
                Synapse helps teams upload sources, ask grounded questions, and keep findings organized in one notebook workflow.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
                <GlowButton
                  className="kinetic-primary-btn btn w-full rounded-xl border-none px-6 text-sm font-semibold text-black sm:w-auto md:px-7"
                  onClick={onTryNotebook}
                >
                  Start Your Notebook
                </GlowButton>
                <button
                  type="button"
                  className="kinetic-ghost-btn w-full rounded-xl px-5 py-3 text-sm font-medium transition sm:w-auto"
                  onClick={() => navigate('/workflow')}
                >
                  See Workflow Tour
                </button>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {proofStats.map((item) => (
                  <div key={item.label} className="bg-[#171313] px-4 py-3 rounded-2xl">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-white md:text-2xl">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="grid gap-4 md:gap-5 md:grid-cols-2">
        <ScrollReveal delay={30}>
          <article className="kinetic-glass p-5 rounded-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-200/80">Live notebook pulse</p>
            <div className="mt-4 rounded-2xl bg-[#161111] p-4">
              <p className="text-sm font-semibold text-white">Q2 Expansion Research</p>
              <p className="mt-1 text-xs text-white/55">14 sources · Updated 2m ago</p>
              <div className="mt-4 space-y-2 text-xs">
                <p className="rounded-lg bg-[#24160f] px-3 py-2 text-white/80">Top risk: churn linked to delayed onboarding adaptation.</p>
                <p className="rounded-lg bg-[#24160f] px-3 py-2 text-white/80">Evidence: 3 support clusters + 2 retention analyses.</p>
              </div>
            </div>
          </article>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <article className="kinetic-glass h-full rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-200/80">Modes</p>
            <ul className="mt-3 grid gap-2 text-sm text-white/85 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {workspaceModes.map((item) => (
                <li key={item} className="rounded-xl bg-[#171313] px-3 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigate('/workflow')}
              className="mt-5 rounded-xl bg-[#24160f] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 transition hover:bg-[#2c1b12]"
            >
              Open Workflow Tour
            </button>
          </article>
        </ScrollReveal>
      </section>

      <ScrollReveal delay={60}>
        <section className="bg-[#131313] rounded-[1.6rem] px-5 py-5 sm:px-6 md:px-7">
          <p className="text-center text-[11px] uppercase tracking-[0.28em] text-slate-400">Teams switching to Synapse</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4 lg:grid-cols-8">
            {['Northwind', 'Reframe', 'Axis Lab', 'Cobalt', 'LinearOps', 'Atlas Bio', 'Mosaic', 'Proofline'].map((logo) => (
              <span
                key={logo}
                className="rounded-xl bg-[#1f1a19] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-orange-100/70"
              >
                {logo}
              </span>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <section className="grid gap-4 md:grid-cols-3 md:gap-5">
        {features.map((feature, idx) => (
          <ScrollReveal key={feature.title} delay={idx * 90}>
            <article className="group h-full rounded-3xl bg-[#131313] p-6 transition duration-300 hover:-translate-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-orange-200/70">{feature.eyebrow}</p>
              <h2 className="mt-4 font-display text-2xl leading-tight text-white">{feature.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{feature.body}</p>
              <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-[#2f2826]">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-400 to-orange-200 transition group-hover:w-full" />
              </div>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:gap-5">
        <ScrollReveal>
          <article className="rounded-3xl bg-[#131313] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-200/70">How it works</p>
            <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">From raw files to trusted answers in three steps.</h3>
            <div className="mt-6 space-y-3">
              {workflow.map(([step, title, body]) => (
                <article key={step} className="rounded-2xl bg-[#201f1f] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-200/70">Step {step}</p>
                  <h4 className="mt-2 text-lg font-semibold text-white">{title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{body}</p>
                </article>
              ))}
            </div>
          </article>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <article className="rounded-3xl bg-[linear-gradient(160deg,#201b1a_0%,#171313_45%,#262626_100%)] p-6 md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-orange-200/70">Responsive by design</p>
                <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">Desktop, Tablet, Mobile</h3>
              </div>
              <span className="w-fit rounded-full bg-[#2a1a11] px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-100/80">Adaptive UI</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#181212] p-4 sm:col-span-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Desktop layout</p>
                <div className="mt-3 rounded-xl bg-[#0f0f0f] p-3">
                  <div className="mb-2 h-2 w-14 rounded-full bg-orange-200/40" />
                  <div className="h-20 rounded-lg bg-gradient-to-r from-orange-400/40 to-orange-200/10" />
                </div>
              </div>

              <div className="rounded-2xl bg-[#181212] p-4 sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Tablet layout</p>
                <div className="mt-3 rounded-xl bg-[#0f0f0f] p-3">
                  <div className="mb-2 h-2 w-10 rounded-full bg-orange-200/35" />
                  <div className="grid h-16 grid-cols-2 gap-2">
                    <div className="rounded-lg bg-orange-300/20" />
                    <div className="rounded-lg bg-orange-100/12" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#181212] p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Mobile layout</p>
                <div className="mt-3 rounded-xl bg-[#0f0f0f] p-2">
                  <div className="mb-2 h-2 w-8 rounded-full bg-orange-200/35" />
                  <div className="space-y-2">
                    <div className="h-4 rounded bg-orange-200/20" />
                    <div className="h-4 rounded bg-orange-100/10" />
                    <div className="h-4 rounded bg-orange-300/22" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </ScrollReveal>
      </section>

      <ScrollReveal delay={110}>
        <section className="rounded-3xl bg-[#131313] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-orange-200/70">Workflow Tour</p>
              <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl md:text-4xl">Want to see the full process step by step?</h3>
              <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                Open the Workflow Tour page to understand how source upload, chat prompts, citations, and notebook insights fit together across desktop, tablet, and mobile.
              </p>
            </div>
            <GlowButton className="kinetic-primary-btn btn w-full rounded-xl border-none px-7 text-sm font-semibold text-black sm:w-auto" onClick={() => navigate('/workflow')}>
              See Workflow Tour
            </GlowButton>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <section className="kinetic-surface relative overflow-hidden rounded-[2rem] p-7 md:p-10">
          <div className="orange-corona absolute -left-10 top-0 h-32 w-32 rounded-full" />
          <div className="orange-corona absolute -bottom-14 right-8 h-44 w-44 rounded-full opacity-80" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-orange-200/75">Start in minutes</p>
              <h2 className="mt-2 font-display text-2xl text-white sm:text-4xl md:text-5xl">Bring your team into a sharper notebook workflow.</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">Use your own documents, keep citations visible, and move from question to decision without context switching.</p>
            </div>

            <GlowButton
              className="kinetic-primary-btn btn w-full rounded-xl border-none px-8 text-sm font-semibold text-black sm:w-auto md:text-base"
              onClick={onTryNotebook}
            >
              Try Notebook Now
            </GlowButton>
          </div>
        </section>
      </ScrollReveal>

    </section>
  );
}

export default LandingPage;
