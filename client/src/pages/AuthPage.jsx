function AuthPage({ authMode, authForm, status, onFieldChange, onChangeMode, onSubmit, onBackToLanding }) {
  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(110deg,#1f1f1f_0%,#111_45%,#171717_100%)] px-4 py-8 sm:px-6">
        <button type="button" onClick={onBackToLanding} className="mx-auto mb-6 block text-sm text-white/65 transition hover:text-white">
          Back to landing
        </button>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_30px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h5" />
            </svg>
          </div>

          <h1 className="text-center text-3xl font-semibold text-white">{isLogin ? 'Sign in' : 'Create your account'}</h1>
          <p className="mt-2 text-center text-sm text-white/55">
            {isLogin ? 'Welcome back. Please enter your details.' : 'Join the next generation of note-taking.'}
          </p>

          {!isLogin && (
            <div className="mx-auto mt-6 flex max-w-[260px] items-center justify-between">
              {['Info', 'Verify', 'Ready'].map((step, idx) => (
                <div key={step} className="flex items-center gap-2">
                  <span className={`h-5 w-5 rounded-full border text-[10px] ${idx === 0 ? 'border-[#314a68] bg-[#314a68] text-white' : 'border-white/35 text-white/60'}`} />
                  <span className="text-[10px] text-white/45">{step}</span>
                  {idx < 2 && <span className="h-px w-8 bg-white/30" />}
                </div>
              ))}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10">
                  Google
                </button>
                <button type="button" className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10">
                  GitHub
                </button>
              </div>
            )}

            {isLogin && <p className="text-center text-[11px] uppercase tracking-[0.16em] text-white/35">Or continue with</p>}

            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-white/60">Full Name</span>
                <input
                  name="username"
                  type="text"
                  value={authForm.username}
                  onChange={onFieldChange}
                  className="w-full rounded-none border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30"
                  placeholder="John Doe"
                  required
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-white/60">Email Address</span>
              <input
                name="email"
                type="email"
                value={authForm.email}
                onChange={onFieldChange}
                className="w-full rounded-none border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30"
                placeholder={isLogin ? 'name@company.com' : 'name@example.com'}
                required
              />
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/60">Password</span>
                {isLogin && <span className="text-xs text-white/45">Forgot password?</span>}
              </div>
              <input
                name="password"
                type="password"
                value={authForm.password}
                minLength={6}
                onChange={onFieldChange}
                className="w-full rounded-none border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30"
                required
              />
            </label>

            {isLogin && (
              <label className="flex items-center gap-2 pt-1 text-sm text-white/65">
                <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-white/10" />
                Remember me for 30 days
              </label>
            )}

            <button type="submit" className="mt-2 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/60">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => onChangeMode(isLogin ? 'register' : 'login')} className="font-semibold text-white">
              {isLogin ? 'Create account' : 'Sign in'}
            </button>
          </p>

          {!isLogin && (
            <>
              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-white/35">Or continue with</p>
              <button type="button" className="mt-3 w-full rounded-xl border border-white/12 bg-white/[0.02] px-4 py-2.5 text-sm text-white/85 transition hover:bg-white/10">
                Sign up with Google
              </button>
            </>
          )}

          {status && <p className="mt-4 text-center text-sm text-white/80">{status}</p>}

          <div className="mt-8 flex items-center justify-center gap-5 text-[11px] uppercase tracking-[0.1em] text-white/30">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Support</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
