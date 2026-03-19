function AuthModal({
  isOpen,
  authMode,
  authForm,
  status,
  isSubmitting,
  onClose,
  onChangeMode,
  onFieldChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  const isLogin = authMode === 'login';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 pb-6 pt-4 sm:items-center sm:px-6" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close authentication modal" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <section className="kinetic-surface relative z-10 w-full max-w-4xl overflow-hidden rounded-[1.4rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8 lg:p-9">
        <div className="orange-corona absolute -left-20 top-0 h-52 w-52 rounded-full" />
        <div className="orange-corona absolute -bottom-16 right-0 h-56 w-56 rounded-full opacity-80" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg bg-[#20150f] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-100/80 transition hover:bg-[#2a1b12] sm:right-4 sm:top-4"
        >
          Close
        </button>

        <div className="relative z-10 grid gap-4 sm:gap-6 md:grid-cols-[1.05fr_0.95fr] md:gap-8">
          <aside className="order-2 rounded-3xl bg-[#151111] p-4 sm:p-6 md:order-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-orange-200/75">Synapse Access</p>
            <h2 className="mt-3 font-display text-3xl leading-[0.92] tracking-[-0.03em] text-white sm:text-5xl">
              <span className="kinetic-hero-text block">SIGN IN</span>
              <span className="kinetic-hero-text block [animation-delay:220ms]">TO CONTINUE</span>
            </h2>
            <p className="mt-4 text-sm text-slate-300">
              Use your account to access notebooks, source uploads, and citation-based chat in the product workspace.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
              {['Notebook access', 'Source-backed chat', 'Team-ready flow'].map((item) => (
                <span key={item} className="rounded-full bg-[#201711] px-3 py-1.5 text-xs text-orange-100/85">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 hidden gap-3 sm:grid sm:grid-cols-2 md:grid-cols-1">
              {[
                ['Notebook access', 'Open your saved notebooks instantly.'],
                ['Source-backed chat', 'Responses include document citations.'],
                ['Team-ready flow', 'Share and continue research context.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-2xl bg-[#201711] px-4 py-3">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-300">{body}</p>
                </article>
              ))}
            </div>
          </aside>

          <div className="order-1 rounded-3xl bg-[#131313] p-4 sm:p-6 md:order-2">
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-[#201711] p-1">
              <button
                type="button"
                onClick={() => onChangeMode('login')}
                className={`rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  isLogin ? 'bg-[#f97316] text-black' : 'text-orange-100/70 hover:text-orange-100'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onChangeMode('register')}
                className={`rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  !isLogin ? 'bg-[#f97316] text-black' : 'text-orange-100/70 hover:text-orange-100'
                }`}
              >
                Signup
              </button>
            </div>

            <h3 className="font-display text-2xl text-white sm:text-3xl">{isLogin ? 'Welcome back' : 'Create account'}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {isLogin ? 'Enter your credentials to access product.' : 'Sign up with your name, email, and password.'}
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              {!isLogin && (
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-slate-400">Name</span>
                  <input
                    name="username"
                    type="text"
                    value={authForm.username}
                    onChange={onFieldChange}
                    className="w-full rounded-xl bg-[#201f1f] px-4 py-3 text-base text-white outline-none transition focus:bg-[#262626] sm:text-sm"
                    placeholder="Your name"
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-slate-400">Email</span>
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={onFieldChange}
                  className="w-full rounded-xl bg-[#201f1f] px-4 py-3 text-base text-white outline-none transition focus:bg-[#262626] sm:text-sm"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-slate-400">Password</span>
                <input
                  name="password"
                  type="password"
                  minLength={6}
                  value={authForm.password}
                  onChange={onFieldChange}
                  className="w-full rounded-xl bg-[#201f1f] px-4 py-3 text-base text-white outline-none transition focus:bg-[#262626] sm:text-sm"
                  placeholder="Minimum 6 characters"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="kinetic-primary-btn w-full rounded-xl px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {status && <p className="mt-4 text-sm text-orange-100/85">{status}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthModal;
