import GlassPanel from '../../components/bits/GlassPanel';

function AppHeader({ view, activeNotebookTitle, onGoLibrary, onGoWorkspace, onLogout }) {
  return (
    <GlassPanel className="topbar">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h2>{view === 'library' ? 'My notebooks' : activeNotebookTitle}</h2>
      </div>
      <div className="topbar-actions">
        <button type="button" className="glass-chip" onClick={onGoLibrary}>
          Home
        </button>
        <button type="button" className="glass-chip" onClick={onGoWorkspace}>
          Studio
        </button>
        <button type="button" className="glass-chip danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </GlassPanel>
  );
}

export default AppHeader;
