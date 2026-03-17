import GlowButton from '../components/bits/GlowButton';
import ScrollReveal from '../components/bits/ScrollReveal';

function ContactPage({ onTryNotebook }) {
  return (
    <section className="space-y-8">
      <ScrollReveal>
        <article className="glass-panel p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">Talk to the NotebookLM team</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Questions about onboarding, collaboration, or enterprise usage? Send us a note and we will get back quickly.
          </p>
        </article>
      </ScrollReveal>

      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <ScrollReveal delay={80}>
          <form className="glass-panel space-y-4 p-6 md:p-8">
            <label className="form-control w-full">
              <span className="label-text text-slate-400">Name</span>
              <input type="text" className="input input-bordered w-full bg-black/40" placeholder="Your name" />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-slate-400">Email</span>
              <input type="email" className="input input-bordered w-full bg-black/40" placeholder="you@example.com" />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-slate-400">Message</span>
              <textarea className="textarea textarea-bordered h-36 w-full bg-black/40" placeholder="How can we help?" />
            </label>
            <button type="button" className="btn glass-pill w-full border-white/25 bg-white px-8 py-3 font-semibold text-black hover:bg-slate-100">
              Send Message
            </button>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={140}>
          <aside className="space-y-4">
            <article className="glass-panel p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">General</p>
              <p className="mt-2 font-display text-lg text-white">hello@notebooklm.local</p>
            </article>
            <article className="glass-panel p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">Partnerships</p>
              <p className="mt-2 font-display text-lg text-white">partners@notebooklm.local</p>
            </article>
            <article className="glass-panel p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">Try the product now</p>
              <GlowButton
                className="btn mt-3 w-full glass-pill border-white/25 bg-white text-black hover:bg-white/90"
                onClick={onTryNotebook}
              >
                Open app.localhost
              </GlowButton>
            </article>
          </aside>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default ContactPage;
