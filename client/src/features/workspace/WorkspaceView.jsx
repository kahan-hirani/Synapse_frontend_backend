import GlassPanel from '../../components/bits/GlassPanel';
import GlowButton from '../../components/bits/GlowButton';
import ScrollReveal from '../../components/bits/ScrollReveal';

function WorkspaceView({
  sourceInputRef,
  uploading,
  status,
  activeNotebook,
  activeSources,
  selectedSource,
  activeMessages,
  question,
  asking,
  onUpload,
  onSelectSource,
  onAsk,
  onQuestionChange,
  onRequestUpload,
}) {
  return (
    <section className="dashboard-grid">
      <GlassPanel className="sources-panel">
        <div className="panel-head">
          <h3>Sources</h3>
          <GlowButton className="mini-btn" onClick={onRequestUpload}>
            + Add source
          </GlowButton>
        </div>

        <input
          id="pdf-upload"
          ref={sourceInputRef}
          type="file"
          accept="application/pdf"
          onChange={onUpload}
          disabled={uploading}
        />

        <GlassPanel className="search-source-box">
          <p>Search the web for new sources</p>
          <div className="source-chips">
            <button type="button">Web</button>
            <button type="button">Fast research</button>
            <button type="button">Go</button>
          </div>
        </GlassPanel>

        <div className="source-list">
          {activeSources.length === 0 && <p className="hint-text">Saved sources will appear here after upload.</p>}
          {activeSources.map((source) => (
            <button
              key={source.id}
              type="button"
              className={`source-card ${selectedSource?.id === source.id ? 'active' : ''}`}
              onClick={() => onSelectSource(source.id)}
            >
              <strong>{source.name}</strong>
              <small>{source.type}</small>
            </button>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="workspace-panel">
        <div className="panel-head">
          <h3>{activeNotebook?.title || 'Notebook'}</h3>
          <span className="pill">Realtime Q&A</span>
        </div>

        <div className="upload-ribbon glass-strip">
          <div className="pdf-status">
            {uploading
              ? 'Processing source...'
              : selectedSource?.pdfId
                ? `Connected PDF: ${selectedSource.pdfId}`
                : 'No source selected'}
          </div>
        </div>

        <div className="chat-feed">
          {activeMessages.length === 0 && (
            <div className="glass-message placeholder">
              <p>Upload a PDF, then ask anything about it. The response uses your backend citations.</p>
            </div>
          )}

          {activeMessages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`glass-message ${message.role === 'user' ? 'from-user' : 'from-ai'}`}
            >
              <p>{message.text}</p>
              {message.meta && <small>{message.meta}</small>}
            </article>
          ))}
        </div>

        <form className="chat-form" onSubmit={onAsk}>
          <input
            type="text"
            placeholder={selectedSource?.pdfId ? 'Ask a question from your document...' : 'Upload/select source first'}
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            disabled={!selectedSource?.pdfId || asking}
          />
          <GlowButton type="submit" className="primary-btn" disabled={!selectedSource?.pdfId || asking}>
            {asking ? 'Thinking...' : 'Ask'}
          </GlowButton>
        </form>
      </GlassPanel>

      <GlassPanel className="studio-panel">
        <h3>Studio Bits</h3>
        <div className="tool-grid">
          {[
            'Audio Overview',
            'Slide Deck',
            'Video Overview',
            'Mind Map',
            'Reports',
            'Flashcards',
            'Quiz',
            'Infographic',
            'Data Table',
          ].map((tool, index) => (
            <ScrollReveal key={tool} delay={index * 50}>
              <button type="button" className="tool-card">
                {tool}
              </button>
            </ScrollReveal>
          ))}
        </div>
        {status && <p className="status-text">{status}</p>}
      </GlassPanel>
    </section>
  );
}

export default WorkspaceView;
