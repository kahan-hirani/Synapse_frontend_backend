import GlassPanel from '../../components/bits/GlassPanel';
import GlowButton from '../../components/bits/GlowButton';
import ScrollReveal from '../../components/bits/ScrollReveal';

function LibraryView({
  libraryTab,
  layoutMode,
  sortMode,
  searchText,
  visibleNotebooks,
  onTabChange,
  onLayoutChange,
  onSortChange,
  onSearchChange,
  onCreateNotebook,
  onOpenNotebook,
}) {
  return (
    <section className="library-wrap">
      <GlassPanel className="library-filters">
        <div className="tabs-row">
          {[
            { key: 'all', label: 'All' },
            { key: 'mine', label: 'My notebooks' },
            { key: 'featured', label: 'Featured notebooks' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-btn ${libraryTab === tab.key ? 'active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="actions-row">
          <div className="layout-toggle">
            <button
              type="button"
              className={layoutMode === 'grid' ? 'active' : ''}
              onClick={() => onLayoutChange('grid')}
            >
              Grid
            </button>
            <button
              type="button"
              className={layoutMode === 'list' ? 'active' : ''}
              onClick={() => onLayoutChange('list')}
            >
              List
            </button>
          </div>

          <select value={sortMode} onChange={(event) => onSortChange(event.target.value)}>
            <option value="recent">Most recent</option>
            <option value="name">Name</option>
          </select>

          <GlowButton className="mini-btn" onClick={onCreateNotebook}>
            + Create new
          </GlowButton>
        </div>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search notebooks"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </GlassPanel>

      <div className={`notebook-gallery ${layoutMode}`}>
        <ScrollReveal>
          <button type="button" className="create-card" onClick={onCreateNotebook}>
            <span>+</span>
            <strong>Create new notebook</strong>
          </button>
        </ScrollReveal>

        {visibleNotebooks.map((notebook, index) => (
          <ScrollReveal key={notebook.id} delay={index * 60}>
            <button type="button" className="gallery-card" onClick={() => onOpenNotebook(notebook.id)}>
              <div className="gallery-icon">{notebook.icon}</div>
              <h3>{notebook.title}</h3>
              <p>
                {new Date(notebook.createdAt).toLocaleDateString()} • {notebook.sources.length} sources
              </p>
            </button>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default LibraryView;
