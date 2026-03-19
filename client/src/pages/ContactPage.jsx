import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';

function ContactPage({ onTryNotebook }) {
  return (
    <section className="space-y-10 md:space-y-14">
      <ScrollReveal>
        <article className="kinetic-surface relative overflow-hidden rounded-[2rem] p-7 md:p-10 lg:p-12">
          <div className="orange-corona absolute -left-16 top-0 h-48 w-48 rounded-full" />
          <div className="orange-corona absolute -bottom-16 right-8 h-52 w-52 rounded-full opacity-80" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-[#2a1910] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200">
              Contact
            </p>
            <h1 className="mt-7 max-w-5xl font-display text-5xl leading-[0.88] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[6rem]">
              <span className="kinetic-hero-text block">LET'S TALK</span>
              <span className="kinetic-hero-text block [animation-delay:220ms]">ABOUT YOUR WORKFLOW</span>
            </h1>
            <p className="mt-6 max-w-3xl text-sm text-slate-300 sm:text-base md:text-lg">
              Reach out for onboarding, feature guidance, or implementation support for your document workflow.
            </p>
          </div>
        </article>
      </ScrollReveal>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <ScrollReveal delay={60}>
          <form className="rounded-3xl bg-[#131313] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-200/75">Send message</p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">We usually reply within one business day.</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-1">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl bg-[#201f1f] px-4 py-3 text-sm text-white outline-none transition focus:bg-[#262626]"
                />
              </label>

              <label className="space-y-2 sm:col-span-1">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-[#201f1f] px-4 py-3 text-sm text-white outline-none transition focus:bg-[#262626]"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">What do you need help with?</span>
                <textarea
                  placeholder="Tell us about your use case or questions..."
                  className="h-36 w-full rounded-xl bg-[#201f1f] px-4 py-3 text-sm text-white outline-none transition focus:bg-[#262626]"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="kinetic-primary-btn rounded-xl px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5">
                Send Message
              </button>
              <GlowButton className="kinetic-ghost-btn rounded-xl px-5 py-3 text-sm font-medium" onClick={onTryNotebook}>
                Try Product Now
              </GlowButton>
            </div>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={110}>
          <aside className="space-y-4">
            <article className="rounded-3xl bg-[#171313] p-5 md:p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-orange-200/75">General</p>
              <p className="mt-2 text-lg font-semibold text-white">hello@synapse.local</p>
              <p className="mt-2 text-sm text-slate-300">Questions about setup, plans, or product usage.</p>
            </article>

            <article className="rounded-3xl bg-[#171313] p-5 md:p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-orange-200/75">Implementation</p>
              <p className="mt-2 text-lg font-semibold text-white">support@synapse.local</p>
              <p className="mt-2 text-sm text-slate-300">Help with notebook workflow, source processing, and team onboarding.</p>
            </article>

            <article className="rounded-3xl bg-[linear-gradient(160deg,#201b1a_0%,#171313_55%,#262626_100%)] p-5 md:p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-orange-200/75">Availability</p>
              <p className="mt-2 text-sm text-white">Monday to Friday</p>
              <p className="text-sm text-slate-300">09:00 - 18:00 IST</p>
            </article>
          </aside>
        </ScrollReveal>
      </section>
    </section>
  );
}

export default ContactPage;
