import { useNavigate } from 'react-router-dom';
import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';

function FeaturesPage({ onTryNotebook }) {
  const navigate = useNavigate();

  const featureGroups = [
    {
      title: 'Notebook Management',
      items: [
        'Create, rename, duplicate, favorite, and share notebooks.',
        'Keep related sources and chat history grouped by notebook.',
        'Track recent notebook activity for quick continuation.',
      ],
    },
    {
      title: 'Source Processing',
      items: [
        'Upload PDFs into selected notebooks.',
        'Delete outdated sources and keep notebook context clean.',
        'Select one source or query across all notebook sources.',
      ],
    },
    {
      title: 'Grounded AI Chat',
      items: [
        'Ask questions against uploaded document context.',
        'Receive citations with page references in responses.',
        'Continue conversation threads per notebook.',
      ],
    },
    {
      title: 'User & Security',
      items: [
        'Authentication with login/register and protected routes.',
        'Profile update and password change support.',
        'Theme preference handling and session persistence.',
      ],
    },
    {
      title: 'Product Experience',
      items: [
        'Desktop and mobile-optimized page flows.',
        'Sidebar-driven navigation in the app workspace.',
        'Toasts and status feedback for key actions.',
      ],
    },
    {
      title: 'API & Infrastructure',
      items: [
        'Notebook, PDF, chat, and user API routes.',
        'Vector store and retrieval workflow integration.',
        'Rate limiting and middleware-based error handling.',
      ],
    },
  ];

  return (
    <section className="space-y-10 md:space-y-14">
      <ScrollReveal>
        <article className="kinetic-surface relative overflow-hidden rounded-[2rem] p-7 md:p-10 lg:p-12">
          <div className="orange-corona absolute -left-16 top-0 h-48 w-48 rounded-full" />
          <div className="orange-corona absolute -bottom-20 right-8 h-52 w-52 rounded-full opacity-80" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-[#2a1910] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200">
              Features
            </p>
            <h1 className="mt-7 max-w-5xl font-display text-5xl leading-[0.88] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[6rem]">
              <span className="kinetic-hero-text block">ALL CORE</span>
              <span className="kinetic-hero-text block [animation-delay:220ms]">PROJECT FEATURES</span>
            </h1>
            <p className="mt-6 max-w-3xl text-sm text-slate-300 sm:text-base md:text-lg">
              A clear overview of what this project currently supports across notebooking, source handling, chat, and user management.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <GlowButton className="kinetic-primary-btn btn rounded-xl border-none px-6 text-sm font-semibold text-black" onClick={onTryNotebook}>
                Try the Product
              </GlowButton>
              <button type="button" onClick={() => navigate('/workflow')} className="kinetic-ghost-btn rounded-xl px-5 py-3 text-sm font-medium">
                Open Workflow Tour
              </button>
            </div>
          </div>
        </article>
      </ScrollReveal>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featureGroups.map((group, idx) => (
          <ScrollReveal key={group.title} delay={idx * 60}>
            <article className="rounded-3xl bg-[#131313] p-6 h-full">
              <p className="text-[11px] uppercase tracking-[0.24em] text-orange-200/75">Group {idx + 1}</p>
              <h2 className="mt-3 font-display text-2xl text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {group.items.map((item) => (
                  <li key={item} className="rounded-xl bg-[#201f1f] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <ScrollReveal delay={120}>
        <section className="rounded-3xl bg-[linear-gradient(160deg,#201b1a_0%,#171313_55%,#262626_100%)] p-7 md:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-orange-200/75">Explore next</p>
              <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">See the workflow in action.</h2>
              <p className="mt-2 text-sm text-slate-300">Walk through how these features connect in practical usage from upload to final insight.</p>
            </div>
            <GlowButton className="kinetic-primary-btn btn rounded-xl border-none px-7 text-sm font-semibold text-black" onClick={() => navigate('/workflow')}>
              Go to Workflow Tour
            </GlowButton>
          </div>
        </section>
      </ScrollReveal>
    </section>
  );
}

export default FeaturesPage;
