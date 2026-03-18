import { useEffect, useMemo, useRef, useState } from 'react';
import synapseLogo from '../assets/synapse-logo.png';

function sourceBadgeClasses(type) {
  if (type === 'WEB LINK') {
    return 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200';
  }
  if (type === 'DOC') {
    return 'border-blue-400/35 bg-blue-400/15 text-blue-200';
  }
  return 'border-rose-400/35 bg-rose-400/15 text-rose-200';
}

function sourceTypeLabel(type) {
  if (!type) return 'PDF';
  return String(type).toUpperCase();
}

function NotebookPage({
  notebook,
  notebooks,
  sourceInputRef,
  selectedSourceId,
  question,
  asking,
  uploading,
  messages,
  onSelectSource,
  onQuestionChange,
  onAsk,
  onUpload,
  onRequestUpload,
  onGoDashboard,
  onOpenNotebook,
}) {
  const selectedSource = useMemo(() => {
    if (!notebook?.sources?.length) return null;
    return notebook.sources.find((source) => source.id === selectedSourceId) || notebook.sources[0];
  }, [notebook, selectedSourceId]);
  const [isQuickSwitchOpen, setIsQuickSwitchOpen] = useState(true);
  const [sourceMode, setSourceMode] = useState('selected');
  const [showDesktopJump, setShowDesktopJump] = useState(false);
  const [showMobileJump, setShowMobileJump] = useState(false);
  const desktopScrollRef = useRef(null);

  const notebookSources = notebook?.sources || [];
  const canAsk = sourceMode === 'all' ? notebookSources.length > 0 : Boolean(selectedSource?.pdfId);
  const questionPlaceholder =
    sourceMode === 'all'
      ? notebookSources.length
        ? 'Ask across all notebook sources...'
        : 'Upload a source first'
      : selectedSource?.pdfId
        ? 'Ask about selected source...'
        : 'Select a source first';
  const mobileQuestionPlaceholder =
    sourceMode === 'all'
      ? notebookSources.length
        ? 'Ask across all sources...'
        : 'Upload a source first'
      : selectedSource?.pdfId
        ? 'Ask selected source...'
        : 'Select a source first';

  const scrollDesktopToBottom = (behavior = 'smooth') => {
    const container = desktopScrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  const scrollMobileToBottom = (behavior = 'smooth') => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
  };

  const handleDesktopScroll = () => {
    const container = desktopScrollRef.current;
    if (!container) return;
    const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowDesktopJump(remaining > 140);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollDesktopToBottom('smooth');
      scrollMobileToBottom('smooth');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages.length, asking]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleWindowScroll = () => {
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);
      setShowMobileJump(remaining > 150);
    };

    handleWindowScroll();
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleWindowScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(44,100,255,0.09),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(240,90,30,0.14),transparent_33%),radial-gradient(circle_at_52%_76%,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_55%)]" />
      </div>

      <input ref={sourceInputRef} type="file" accept="application/pdf" onChange={onUpload} disabled={uploading} className="hidden" />

      <div className="relative z-10 hidden min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex h-screen flex-col border-r border-white/10 bg-black/35 p-5 backdrop-blur-xl">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onGoDashboard}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f15a0f]/45 bg-[#f15a0f]/10 text-[#ffd4bd] transition hover:bg-[#f15a0f]/20 hover:text-white"
              aria-label="Back to library"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-[10px] uppercase tracking-[0.28em] text-white/50">Sources</h2>
            <button
              type="button"
              onClick={onRequestUpload}
              className="rounded-lg border border-[#f15a0f]/45 bg-[#f15a0f]/10 px-2.5 py-1 text-xs text-[#ffd4bd] transition hover:bg-[#f15a0f]/20 hover:text-white"
            >
              {uploading ? 'Uploading...' : '+ Add'}
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
            {notebookSources.length ? (
              notebookSources.map((source) => {
                const type = sourceTypeLabel(source.type);

                return (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => onSelectSource(source.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selectedSource?.id === source.id
                        ? 'border-[#f15a0f]/55 bg-[#f15a0f]/12 shadow-[0_12px_28px_rgba(0,0,0,0.32)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-[#f15a0f]/35 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`inline-flex min-w-[54px] items-center justify-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${sourceBadgeClasses(
                          type,
                        )}`}
                      >
                        {type}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white/90">{source.name}</p>
                        <p className="mt-1 text-[11px] text-white/45">{source.addedAt ? new Date(source.addedAt).toLocaleDateString() : 'Recently added'}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/55">No sources yet. Add a PDF to start asking questions.</article>
            )}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div
              id="quick-switch-list"
              className={`overflow-hidden transition-all duration-300 ease-out ${isQuickSwitchOpen ? 'max-h-72 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-3'}`}
            >
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/45">Quick Switch</p>
              <div className="space-y-2 pb-2">
                {notebooks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenNotebook(item.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                      item.id === notebook?.id
                        ? 'border-[#f15a0f]/55 bg-[#f15a0f]/12 text-[#ffe0d1]'
                        : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-[#f15a0f]/35 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQuickSwitchOpen((prev) => !prev)}
              className="mt-2 flex w-full items-center justify-between rounded-xl border border-[#f15a0f]/35 bg-[#f15a0f]/10 px-3 py-2 text-left transition hover:bg-[#f15a0f]/18"
              aria-expanded={isQuickSwitchOpen}
              aria-controls="quick-switch-list"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#ffd4bd]">Quick Switch</span>
              <svg
                className={`h-4 w-4 text-[#ffd4bd] transition-transform duration-300 ${isQuickSwitchOpen ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </aside>

        <main className="relative flex h-screen min-h-screen flex-col">
          <section ref={desktopScrollRef} onScroll={handleDesktopScroll} className="flex-1 overflow-y-auto px-8 py-7">
            <div className="mx-auto w-full max-w-3xl space-y-7">

              {messages.map((message, idx) => {
                const isUser = message.role === 'user';
                return (
                  <article key={`${message.role}-${idx}`} className={isUser ? 'pl-16' : 'pr-16'}>
                    <p className={`mb-2 text-[10px] uppercase tracking-[0.24em] ${isUser ? 'text-right text-white/45' : 'text-white/45'}`}>
                      {isUser ? 'You' : 'Synapse'}
                    </p>

                    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f15a0f]/40 bg-black/55">
                          <img src={synapseLogo} alt="Synapse" className="h-4 w-4 object-contain" />
                        </span>
                      )}

                      <div
                        className={`max-w-[88%] rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-[0_16px_32px_rgba(0,0,0,0.32)] ${
                          isUser
                            ? 'border-[#f15a0f]/45 bg-[#fff3ec] text-[#1f2937]'
                            : 'border-[#f15a0f]/20 bg-[linear-gradient(150deg,rgba(241,90,15,0.15),rgba(255,255,255,0.02))] text-white backdrop-blur-2xl'
                        }`}
                      >
                        <p>{message.text}</p>

                        {!isUser && notebookSources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {notebookSources.slice(0, 2).map((source) => (
                              <span key={source.id} className="rounded-md border border-white/15 bg-black/35 px-2 py-1 text-[11px] text-white/70">
                                {source.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {message.meta && (
                          <p className={`mt-3 text-[11px] ${isUser ? 'text-black/50' : 'text-white/45'}`}>
                            {message.meta}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {asking && (
                <article className="pr-16">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/45">Synapse</p>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f15a0f]/40 bg-black/55">
                      <img src={synapseLogo} alt="Synapse" className="h-4 w-4 object-contain" />
                    </span>

                    <div className="flex items-center gap-1 rounded-3xl border border-[#f15a0f]/20 bg-[linear-gradient(150deg,rgba(241,90,15,0.15),rgba(255,255,255,0.02))] px-5 py-4 backdrop-blur-2xl">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66] [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66] [animation-delay:240ms]" />
                    </div>
                  </div>
                </article>
              )}
            </div>
          </section>

          <button
            type="button"
            onClick={() => scrollDesktopToBottom('smooth')}
            className={`absolute bottom-28 left-1/2 z-20 inline-flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#f15a0f]/45 bg-[#f15a0f] text-white shadow-[0_10px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#ff6d24] ${
              showDesktopJump ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
            aria-label="Scroll to latest messages"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V4" />
            </svg>
          </button>

          <footer className="border-t border-[#f15a0f]/20 bg-black/40 px-8 pb-4 pt-3 backdrop-blur-xl">
            <form
              onSubmit={(event) => onAsk(event, sourceMode)}
              className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[22px] border border-[#f15a0f]/30 bg-[linear-gradient(160deg,rgba(241,90,15,0.13),rgba(255,255,255,0.02))] p-2.5 shadow-[0_16px_32px_rgba(0,0,0,0.3)]"
            >
              <div className="flex shrink-0 items-center rounded-xl border border-[#f15a0f]/35 bg-black/25 p-1">
                <button
                  type="button"
                  onClick={() => setSourceMode('selected')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    sourceMode === 'selected' ? 'bg-[#f15a0f] text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  This Source
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('all')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    sourceMode === 'all' ? 'bg-[#f15a0f] text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  All Sources
                </button>
              </div>

              <input
                type="text"
                value={question}
                onChange={(event) => onQuestionChange(event.target.value)}
                placeholder={questionPlaceholder}
                disabled={!canAsk || asking}
                className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-40"
              />

              <button
                type="submit"
                disabled={!canAsk || asking}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f15a0f] text-white transition hover:bg-[#ff6d24] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send question"
              >
                {asking ? (
                  <span className="text-xs">...</span>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
              </button>
            </form>

            <p className="mx-auto mt-3 w-full max-w-3xl text-center text-[10px] uppercase tracking-[0.2em] text-white/35">
              Synapse may display inaccurate info. Verify important facts.
            </p>
          </footer>
        </main>

      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl lg:hidden">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/65 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={onGoDashboard} className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="min-w-0 text-center">
              <h1 className="truncate text-sm font-semibold">{notebook?.title || 'Notebook'}</h1>
              <p className="text-[11px] text-white/45">Notebook Summary</p>
            </div>
            <div className="h-8 w-8" aria-hidden="true" />
          </div>
        </header>

        <div className="border-b border-white/5 bg-black/35 px-4 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="mr-1 text-[10px] uppercase tracking-[0.2em] text-white/40">Sources:</span>
            <button
              type="button"
              onClick={onRequestUpload}
              className="rounded-full border border-[#f15a0f]/50 bg-[#f15a0f]/20 px-2.5 py-1.5 text-sm font-semibold text-[#ffd4bd]"
              aria-label="Upload source"
            >
              +
            </button>
            {notebook?.sources?.slice(0, 3).map((source) => (
              <button
                key={source.id}
                type="button"
                onClick={() => onSelectSource(source.id)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${
                  selectedSource?.id === source.id ? 'border-[#f15a0f]/70 bg-[#f15a0f]/20 text-[#ffd4bd]' : 'border-white/20 text-white/70'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-6 px-4 py-6 pb-36 md:px-6 md:pb-40">
          {messages.map((message, idx) => (
              <article key={`${message.role}-${idx}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-3xl border p-4 text-sm leading-relaxed ${message.role === 'user' ? 'border-[#f15a0f]/25 bg-[#fff6f1] text-[#1f2937]' : 'border-white/12 bg-white/[0.04] text-white'}`}>
                  {message.text}
                  {message.meta && <p className={`mt-2 text-xs ${message.role === 'user' ? 'text-black/60' : 'text-white/45'}`}>{message.meta}</p>}
                </div>
              </article>
            ))}

          {asking && (
            <article className="flex justify-start">
              <div className="flex items-center gap-2 rounded-3xl border border-[#f15a0f]/25 bg-[linear-gradient(150deg,rgba(241,90,15,0.15),rgba(255,255,255,0.02))] px-4 py-3 backdrop-blur-2xl">
                <span className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-[#f15a0f]/40 bg-black/55">
                  <img src={synapseLogo} alt="Synapse" className="h-3.5 w-3.5 object-contain" />
                </span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66] [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66] [animation-delay:240ms]" />
              </div>
            </article>
          )}
        </section>

        <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-3xl border-t border-white/10 bg-black/85 px-4 py-4 backdrop-blur-xl md:px-6">
          <form onSubmit={(event) => onAsk(event, sourceMode)} className="flex items-center gap-2 rounded-3xl border border-[#f15a0f]/30 bg-[linear-gradient(160deg,rgba(241,90,15,0.13),rgba(255,255,255,0.02))] p-2">
            <div className="flex shrink-0 items-center rounded-xl border border-[#f15a0f]/35 bg-black/25 p-1">
              <button
                type="button"
                onClick={() => setSourceMode('selected')}
                className={`rounded-lg px-2 py-1 text-[10px] font-medium transition ${
                  sourceMode === 'selected' ? 'bg-[#f15a0f] text-white' : 'text-[#ffd4bd]'
                }`}
              >
                This
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('all')}
                className={`rounded-lg px-2 py-1 text-[10px] font-medium transition ${
                  sourceMode === 'all' ? 'bg-[#f15a0f] text-white' : 'text-[#ffd4bd]'
                }`}
              >
                All
              </button>
            </div>
            <input
              type="text"
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder={mobileQuestionPlaceholder}
              disabled={!canAsk || asking}
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!canAsk || asking}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f15a0f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition hover:bg-[#ff6d24] disabled:opacity-40"
              aria-label="Send question"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </footer>

        <button
          type="button"
          onClick={() => scrollMobileToBottom('smooth')}
          className={`fixed bottom-24 left-1/2 z-40 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[#f15a0f]/45 bg-[#f15a0f] text-white shadow-[0_10px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#ff6d24] ${
            showMobileJump ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
          }`}
          aria-label="Scroll to latest messages"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NotebookPage;
