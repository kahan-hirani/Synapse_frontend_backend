import { useNavigate } from 'react-router-dom';
import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';

function WhyPage() {
  const navigate = useNavigate();

  const reasons = [
    {
      title: 'Citations stay visible',
      body: 'Answers point to source pages so teams can verify context before sharing decisions.',
    },
    {
      title: 'Notebook-first workflow',
      body: 'Uploads, chat prompts, and findings live in one notebook instead of spread across tools.',
    },
    {
      title: 'Built for practical research',
      body: 'Designed for teams reviewing reports, policies, and long documents every day.',
    },
  ];

  const useCases = [
    ['Product teams', 'Review specs, user feedback, and research docs in one focused workflow.'],
    ['Operations teams', 'Track policies and procedures with source-backed Q&A for faster onboarding.'],
    ['Research teams', 'Interrogate large PDF sets and keep citations attached to every key finding.'],
  ];

  return (
    <section className="space-y-10 md:space-y-14">
      <ScrollReveal>
        <article className="kinetic-surface relative overflow-hidden rounded-[2rem] p-7 md:p-10 lg:p-12">
          <div className="orange-corona absolute -left-16 top-0 h-44 w-44 rounded-full" />
          <div className="orange-corona absolute -bottom-20 right-8 h-52 w-52 rounded-full opacity-80" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-[#2a1910] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200">
              Why Synapse
            </p>
            <h1 className="mt-7 max-w-5xl font-display text-5xl leading-[0.88] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[6rem]">
              <span className="kinetic-hero-text block">SIMPLE TO USE.</span>
              <span className="kinetic-hero-text block [animation-delay:220ms]">EASY TO TRUST.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-sm text-slate-300 sm:text-base md:text-lg">
              Synapse helps teams work with long documents using notebook chat and page-level citations. The goal is clarity, not noise.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <GlowButton className="kinetic-primary-btn btn rounded-xl border-none px-6 text-sm font-semibold text-black" onClick={() => navigate('/workflow')}>
                View Workflow Tour
              </GlowButton>
              <button type="button" onClick={() => navigate('/features')} className="kinetic-ghost-btn rounded-xl px-5 py-3 text-sm font-medium">
                See All Features
              </button>
            </div>
          </div>
        </article>
      </ScrollReveal>

      <section className="grid gap-5 md:grid-cols-3">
        {reasons.map((item, idx) => (
          <ScrollReveal key={item.title} delay={idx * 80}>
            <article className="rounded-3xl bg-[#131313] h-full p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-orange-200/75">Reason {idx + 1}</p>
              <h2 className="mt-3 font-display text-2xl text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <ScrollReveal delay={100}>
        <article className="rounded-3xl bg-[#171313] p-7 md:p-9">
          <p className="text-xs uppercase tracking-[0.22em] text-orange-200/75">Used by</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Teams that work with real documents every week.</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {useCases.map(([title, body]) => (
              <article key={title} className="rounded-2xl bg-[#201f1f] p-5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{body}</p>
              </article>
            ))}
          </div>
        </article>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <article className="rounded-3xl bg-[linear-gradient(160deg,#201b1a_0%,#171313_55%,#262626_100%)] p-7 md:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-orange-200/75">Next step</p>
              <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">Explore the full feature set.</h2>
              <p className="mt-2 text-sm text-slate-300">Understand what Synapse supports across notebooking, source management, and team collaboration.</p>
            </div>
            <GlowButton className="kinetic-primary-btn btn rounded-xl border-none px-7 text-sm font-semibold text-black" onClick={() => navigate('/features')}>
              Open Features
            </GlowButton>
          </div>
        </article>
      </ScrollReveal>
    </section>
  );
}

export default WhyPage;
