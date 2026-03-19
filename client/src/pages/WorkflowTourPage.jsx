import { useNavigate } from 'react-router-dom';
import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';

function WorkflowTourPage({ onTryNotebook }) {
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Create a notebook',
      body: 'Start a notebook for a topic, project, or team objective. This keeps all related sources and conversations grouped together.',
    },
    {
      title: 'Upload source files',
      body: 'Add PDFs and documents to the notebook. Sources are indexed so they can be used during chat and citation lookup.',
    },
    {
      title: 'Ask focused questions',
      body: 'Use notebook chat to ask specific questions. Keep prompts concrete to get clearer, more useful responses.',
    },
    {
      title: 'Validate with citations',
      body: 'Check the cited pages to confirm the answer context before sharing findings with your team.',
    },
    {
      title: 'Synthesize and share',
      body: 'Capture final notes inside the notebook and share results so collaborators can continue from the same context.',
    },
  ];

  const responsiveNotes = [
    ['Desktop', 'Full-width workspace with side-by-side source and chat views for deep review.'],
    ['Tablet', 'Balanced layout for reading documents and chatting during meetings.'],
    ['Mobile', 'Fast notebook access, source checks, and follow-up prompts on the go.'],
  ];

  return (
    <section className="space-y-10 pb-10 md:space-y-14">
      <ScrollReveal>
        <section className="kinetic-surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="orange-corona absolute -left-20 top-0 h-56 w-56 rounded-full" />
          <div className="orange-corona absolute -bottom-20 right-10 h-64 w-64 rounded-full opacity-75" />

          <div className="relative z-10">
            <p className="inline-flex items-center rounded-full bg-[#2a1910] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200">
              Workflow Tour
            </p>
            <h1 className="mt-7 max-w-5xl font-display text-5xl leading-[0.88] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[6.2rem] xl:text-[7rem]">
              <span className="kinetic-hero-text block">HOW SYNAPSE</span>
              <span className="kinetic-hero-text block [animation-delay:220ms]">WORKS DAILY</span>
            </h1>
            <p className="mt-6 max-w-3xl text-sm text-slate-300 sm:text-base md:text-lg">
              This page shows the practical workflow used in this project: source upload, notebook chat, citation checks, and final synthesis.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <GlowButton className="kinetic-primary-btn btn rounded-xl border-none px-6 text-sm font-semibold text-black" onClick={onTryNotebook}>
                Open Product
              </GlowButton>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="kinetic-ghost-btn rounded-xl px-5 py-3 text-sm font-medium"
              >
                Back to Landing
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((item, idx) => (
          <ScrollReveal key={item.title} delay={idx * 60}>
            <article className="rounded-3xl bg-[#131313] p-5 md:p-6 h-full">
              <p className="text-[11px] uppercase tracking-[0.24em] text-orange-200/75">Step {idx + 1}</p>
              <h2 className="mt-3 font-display text-2xl leading-tight text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <section className="gap-5 lg:grid-cols-[1fr_1fr]">
        <ScrollReveal>
          <article className="rounded-3xl bg-[#171313] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-200/70">Interface view</p>
            <h3 className="mt-3 font-display text-3xl text-white md:text-4xl">At-a-glance workflow board</h3>

            <div className="mt-6 rounded-2xl bg-[#0f0f0f] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[#2b1b12] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-orange-100/80">Notebook</span>
                <span className="text-xs text-slate-400">Q2 Expansion Research</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#211711] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-200/70">Sources</p>
                  <p className="mt-2 text-sm text-white">14 uploaded files</p>
                  <p className="mt-1 text-xs text-slate-400">Policies, support logs, interviews</p>
                </div>
                <div className="rounded-xl bg-[#211711] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-200/70">Chat</p>
                  <p className="mt-2 text-sm text-white">8 focused queries</p>
                  <p className="mt-1 text-xs text-slate-400">Answers with citation references</p>
                </div>
                <div className="rounded-xl bg-[#211711] p-3 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-200/70">Outcome</p>
                  <p className="mt-2 text-sm text-white">Final notebook summary ready for team review</p>
                </div>
              </div>
            </div>
          </article>
        </ScrollReveal>
      </section>

      <ScrollReveal delay={120}>
        <section className="kinetic-surface relative overflow-hidden rounded-[2rem] p-7 md:p-10">
          <div className="orange-corona absolute -left-10 top-0 h-36 w-36 rounded-full" />
          <div className="orange-corona absolute -bottom-14 right-8 h-44 w-44 rounded-full opacity-80" />

          <div className="relative z-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-orange-200/75">Ready to try</p>
              <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">Start with one notebook and one clear question.</h3>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">The fastest way to learn the workflow is to run a small real example with your own source files.</p>
            </div>
            <GlowButton className="kinetic-primary-btn btn rounded-xl border-none px-8 text-sm font-semibold text-black" onClick={onTryNotebook}>
              Start Notebook
            </GlowButton>
          </div>
        </section>
      </ScrollReveal>
    </section>
  );
}

export default WorkflowTourPage;
