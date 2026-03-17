import GlassPanel from '../../components/bits/GlassPanel';
import GlowButton from '../../components/bits/GlowButton';

function AuthView({ authMode, authForm, status, onChangeMode, onFieldChange, onSubmit }) {
  return (
    <main className="shell auth-shell">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />
      <GlassPanel className="auth-card">
        <p className="eyebrow">NotebookLM Clone Experience</p>
        <h1>Build intelligence from your documents</h1>
        <p className="subtext">
          A cinematic, glassy workspace where your PDFs become interactive conversations.
        </p>

        <div className="mode-toggle glass-strip">
          <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => onChangeMode('login')}>
            Login
          </button>
          <button
            type="button"
            className={authMode === 'register' ? 'active' : ''}
            onClick={() => onChangeMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {authMode === 'register' && (
            <label>
              Username
              <input
                name="username"
                type="text"
                value={authForm.username}
                onChange={onFieldChange}
                required
              />
            </label>
          )}

          <label>
            Email
            <input name="email" type="email" value={authForm.email} onChange={onFieldChange} required />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={authForm.password}
              onChange={onFieldChange}
              minLength={6}
              required
            />
          </label>

          <GlowButton type="submit" className="primary-btn">
            {authMode === 'register' ? 'Create Account' : 'Enter Studio'}
          </GlowButton>
        </form>

        {status && <p className="status-text">{status}</p>}
      </GlassPanel>
    </main>
  );
}

export default AuthView;
