import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import synapseLogo from '../assets/synapse-logo.png';

function sourceBadgeClasses(type, isDark) {
  if (type === 'WEB LINK') {
    return isDark
      ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200'
      : 'border-emerald-500/35 bg-emerald-50 text-emerald-700';
  }
  if (type === 'DOC') {
    return isDark
      ? 'border-blue-400/35 bg-blue-400/15 text-blue-200'
      : 'border-blue-500/35 bg-blue-50 text-blue-700';
  }
  return isDark
    ? 'border-rose-400/35 bg-rose-400/15 text-rose-200'
    : 'border-[#f15a0f]/35 bg-[#fff3eb] text-[#b45309]';
}

function sourceTypeLabel(type) {
  if (!type) return 'PDF';
  return String(type).toUpperCase();
}

function shortenSourceName(name, maxLength = 24) {
  const value = String(name || '').trim();
  if (!value) return 'Untitled source';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

const markdownComponents = {
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h1 className="mb-3 text-lg font-semibold leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 text-base font-semibold leading-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-sm font-semibold leading-tight">{children}</h3>,
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-[#ffb184] underline decoration-[#f15a0f]/70 underline-offset-2">
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className && String(className).includes('language-'));
    if (!isBlock) {
      return <code className="rounded bg-black/45 px-1.5 py-0.5 text-[12px] text-[#ffd4bd]">{children}</code>;
    }
    return (
      <code className="block overflow-x-auto rounded-xl border border-[#f15a0f]/30 bg-black/45 p-3 text-[12px] text-[#ffd4bd]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mb-3 overflow-x-auto last:mb-0">{children}</pre>,
  blockquote: ({ children }) => <blockquote className="mb-3 border-l-2 border-[#f15a0f]/55 pl-3 italic opacity-85">{children}</blockquote>,
};

function NotebookPage({
  notebook,
  notebooks,
  sourceInputRef,
  selectedSourceId,
  question,
  asking,
  uploading,
  theme,
  messages,
  onSelectSource,
  onQuestionChange,
  onAsk,
  onUpload,
  onRequestUpload,
  onGoDashboard,
  onOpenNotebook,
  onDeleteSource,
}) {
  const isDark = theme !== 'light';
  const selectedSource = useMemo(() => {
    if (!notebook?.sources?.length) return null;
    return notebook.sources.find((source) => source.id === selectedSourceId) || notebook.sources[0];
  }, [notebook, selectedSourceId]);
  const [isQuickSwitchOpen, setIsQuickSwitchOpen] = useState(true);
  const [sourceMode, setSourceMode] = useState('selected');
  const [showDesktopJump, setShowDesktopJump] = useState(false);
  const [showMobileJump, setShowMobileJump] = useState(false);
  const [deletingSourceId, setDeletingSourceId] = useState('');
  const [sourceToDelete, setSourceToDelete] = useState(null);
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

  const renderMessageBody = (text, isUser) => {
    const content = typeof text === 'string' ? text : String(text || '');
    if (isUser) {
      return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
    }

    return (
      <div className={isDark ? 'text-white/95' : 'text-[#0f172a]'}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    );
  };

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

  const handleDeleteSource = async (event, source) => {
    event.stopPropagation();
    if (!source?.id || !onDeleteSource || deletingSourceId) return;

    setSourceToDelete(source);
  };

  const handleConfirmDeleteSource = async () => {
    if (!sourceToDelete?.id || !onDeleteSource || deletingSourceId) return;

    try {
      setDeletingSourceId(sourceToDelete.id);
      const deleted = await onDeleteSource(sourceToDelete.id);
      if (deleted) {
        setSourceToDelete(null);
      }
    } finally {
      setDeletingSourceId('');
    }
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
    <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-[#070707] text-white' : 'bg-[#f8f6f2] text-[#0f172a]'}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_10%_20%,rgba(44,100,255,0.09),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(240,90,30,0.14),transparent_33%),radial-gradient(circle_at_52%_76%,rgba(255,255,255,0.08),transparent_42%)]' : 'bg-[radial-gradient(circle_at_10%_20%,rgba(241,90,15,0.12),transparent_42%),radial-gradient(circle_at_90%_10%,rgba(44,100,255,0.06),transparent_36%)]'}`} />
        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(130deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_55%)]' : 'bg-[linear-gradient(130deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.2)_55%)]'}`} />
      </div>

      <input ref={sourceInputRef} type="file" accept="application/pdf" onChange={onUpload} disabled={uploading} className="hidden" />

      <div className="relative z-10 hidden min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className={`flex h-screen flex-col p-5 backdrop-blur-xl ${isDark ? 'border-r border-white/10 bg-black/35' : 'border-r border-[#f15a0f]/15 bg-white/55'}`}>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onGoDashboard}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                isDark
                  ? 'border-[#f15a0f]/45 bg-[#f15a0f]/10 text-[#ffd4bd] hover:bg-[#f15a0f]/20 hover:text-white'
                  : 'border-[#f15a0f]/40 bg-white/90 text-[#c2410c] hover:bg-[#fff1e8] hover:text-[#9a3412]'
              }`}
              aria-label="Back to library"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className={`text-[10px] uppercase tracking-[0.28em] ${isDark ? 'text-white/50' : 'text-[#64748b]'}`}>Sources</h2>
            <button
              type="button"
              onClick={onRequestUpload}
              className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                isDark
                  ? 'border-[#f15a0f]/45 bg-[#f15a0f]/10 text-[#ffd4bd] hover:bg-[#f15a0f]/20 hover:text-white'
                  : 'border-[#f15a0f]/40 bg-white/90 text-[#c2410c] hover:bg-[#fff1e8] hover:text-[#9a3412]'
              }`}
            >
              {uploading ? 'Uploading...' : '+ Add'}
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
            {notebookSources.length ? (
              notebookSources.map((source) => {
                const type = sourceTypeLabel(source.type);

                return (
                  <div
                    key={source.id}
                    className={`group relative w-full rounded-xl border transition ${
                      selectedSource?.id === source.id
                        ? isDark
                          ? 'border-[#f15a0f]/55 bg-[#f15a0f]/12 shadow-[0_12px_28px_rgba(0,0,0,0.32)]'
                          : 'border-[#f15a0f]/35 bg-[#fff3eb] shadow-[0_10px_22px_rgba(241,90,15,0.14)]'
                        : isDark
                          ? 'border-white/10 bg-white/[0.03] hover:border-[#f15a0f]/35 hover:bg-white/[0.06]'
                          : 'border-[#e8e2da] bg-white/85 hover:border-[#f15a0f]/35 hover:bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectSource(source.id)}
                      className="w-full rounded-xl px-3 py-3 pr-11 text-left"
                    >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`inline-flex min-w-[54px] items-center justify-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${sourceBadgeClasses(
                          type,
                          isDark,
                        )}`}
                      >
                        {type}
                      </span>
                      <div className="min-w-0">
                        <p className={`truncate text-xs font-medium ${isDark ? 'text-white/90' : 'text-[#0f172a]'}`}>{source.name}</p>
                        <p className={`mt-1 text-[11px] ${isDark ? 'text-white/45' : 'text-[#64748b]'}`}>{source.addedAt ? new Date(source.addedAt).toLocaleDateString() : 'Recently added'}</p>
                      </div>
                    </div>
                    </button>

                    <button
                      type="button"
                      onClick={(event) => handleDeleteSource(event, source)}
                      disabled={deletingSourceId === source.id}
                      aria-label={`Delete ${source.name}`}
                      className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
                        isDark
                          ? 'border-white/20 bg-black/45 text-white/75 hover:border-red-400/50 hover:text-red-300'
                          : 'border-[#f15a0f]/25 bg-white text-[#9a3412] hover:border-red-400/60 hover:text-red-600'
                      } ${deletingSourceId === source.id ? 'cursor-wait opacity-70' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}
                    >
                      {deletingSourceId === source.id ? (
                        <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                      ) : (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <article className={`rounded-xl border p-4 text-xs ${isDark ? 'border-white/10 bg-white/[0.03] text-white/55' : 'border-[#f15a0f]/15 bg-white/80 text-[#64748b]'}`}>No sources yet. Add a PDF to start asking questions.</article>
            )}
          </div>

          <div className={`mt-5 pt-4 ${isDark ? 'border-t border-white/10' : 'border-t border-[#f15a0f]/15'}`}>
            <div
              id="quick-switch-list"
              className={`overflow-hidden transition-all duration-300 ease-out ${isQuickSwitchOpen ? 'max-h-72 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-3'}`}
            >
              <p className={`mb-2 text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-white/45' : 'text-[#64748b]'}`}>Quick Switch</p>
              <div className="space-y-2 pb-2">
                {notebooks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenNotebook(item.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                      item.id === notebook?.id
                        ? isDark
                          ? 'border-[#f15a0f]/55 bg-[#f15a0f]/12 text-[#ffe0d1]'
                          : 'border-[#f15a0f]/40 bg-[#fff1e8] text-[#9a3412]'
                        : isDark
                          ? 'border-white/10 bg-white/[0.03] text-white/65 hover:border-[#f15a0f]/35 hover:text-white'
                          : 'border-[#e8e2da] bg-white/85 text-[#5b6472] hover:border-[#f15a0f]/35 hover:text-[#0f172a]'
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
              className={`mt-2 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                isDark
                  ? 'border-[#f15a0f]/35 bg-[#f15a0f]/10 hover:bg-[#f15a0f]/18'
                  : 'border-[#f15a0f]/35 bg-white/90 hover:bg-[#fff1e8]'
              }`}
              aria-expanded={isQuickSwitchOpen}
              aria-controls="quick-switch-list"
            >
              <span className={`text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-[#ffd4bd]' : 'text-[#c2410c]'}`}>Quick Switch</span>
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${isDark ? 'text-[#ffd4bd]' : 'text-[#c2410c]'} ${isQuickSwitchOpen ? 'rotate-180' : 'rotate-0'}`}
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
                    <p className={`mb-2 text-[10px] uppercase tracking-[0.24em] ${isUser ? `text-right ${isDark ? 'text-white/45' : 'text-[#64748b]'}` : isDark ? 'text-white/45' : 'text-[#64748b]'}`}>
                      {isUser ? 'You' : 'Synapse'}
                    </p>

                    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <span className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f15a0f]/40 ${isDark ? 'bg-black/55' : 'bg-white/95'}`}>
                          <img src={synapseLogo} alt="Synapse" className="h-5 w-5 object-contain" />
                        </span>
                      )}

                      <div
                        className={`max-w-[88%] rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-[0_16px_32px_rgba(0,0,0,0.18)] ${
                          isUser
                            ? 'border-[#f15a0f]/45 bg-[#fff3ec] text-[#1f2937]'
                            : isDark
                              ? 'border-[#f15a0f]/20 bg-[linear-gradient(150deg,rgba(241,90,15,0.15),rgba(255,255,255,0.02))] text-white backdrop-blur-2xl'
                              : 'border-[#f15a0f]/20 bg-white/85 text-[#0f172a] backdrop-blur-2xl'
                        }`}
                      >
                        {renderMessageBody(message.text, isUser)}

                        {!isUser && notebookSources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {notebookSources.slice(0, 2).map((source) => (
                              <span
                                key={source.id}
                                className={`max-w-[220px] truncate rounded-md border px-2 py-1 text-[11px] ${isDark ? 'border-white/15 bg-black/35 text-white/70' : 'border-[#f15a0f]/20 bg-[#fff5ef] text-[#8a3915]'}`}
                                title={source.name}
                              >
                                {shortenSourceName(source.name)}
                              </span>
                            ))}
                          </div>
                        )}

                        {message.meta && (
                          <p className={`mt-3 text-[11px] ${isUser ? 'text-black/50' : isDark ? 'text-white/45' : 'text-[#64748b]'}`}>
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
                  <p className={`mb-2 text-[10px] uppercase tracking-[0.24em] ${isDark ? 'text-white/45' : 'text-[#64748b]'}`}>Synapse</p>
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f15a0f]/40 ${isDark ? 'bg-black/55' : 'bg-white/95'}`}>
                      <img src={synapseLogo} alt="Synapse" className="h-5 w-5 object-contain" />
                    </span>

                    <div className={`flex items-center gap-1 rounded-3xl border border-[#f15a0f]/20 px-5 py-4 backdrop-blur-2xl ${isDark ? 'bg-[linear-gradient(150deg,rgba(241,90,15,0.15),rgba(255,255,255,0.02))]' : 'bg-white/90'}`}>
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

          <footer className={`border-t px-8 pb-4 pt-3 backdrop-blur-xl ${isDark ? 'border-[#f15a0f]/20 bg-black/40' : 'border-[#f15a0f]/20 bg-white/70'}`}>
            <form
              onSubmit={(event) => onAsk(event, sourceMode)}
              className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[22px] border border-[#f15a0f]/30 bg-[linear-gradient(160deg,rgba(241,90,15,0.13),rgba(255,255,255,0.02))] p-2.5 shadow-[0_16px_32px_rgba(0,0,0,0.3)]"
            >
              <div className={`flex shrink-0 items-center rounded-xl border border-[#f15a0f]/35 p-1 ${isDark ? 'bg-black/25' : 'bg-white/90'}`}>
                <button
                  type="button"
                  onClick={() => setSourceMode('selected')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    sourceMode === 'selected' ? 'bg-[#f15a0f] text-white' : isDark ? 'text-white/70 hover:text-white' : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  This Source
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('all')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    sourceMode === 'all' ? 'bg-[#f15a0f] text-white' : isDark ? 'text-white/70 hover:text-white' : 'text-[#475569] hover:text-[#0f172a]'
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
                className={`min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none disabled:opacity-40 ${isDark ? 'text-white placeholder:text-white/35' : 'text-[#0f172a] placeholder:text-[#94a3b8]'}`}
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

            <p className={`mx-auto mt-3 w-full max-w-3xl text-center text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-white/35' : 'text-[#64748b]'}`}>
              Synapse may display inaccurate info. Verify important facts.
            </p>
          </footer>
        </main>

      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl lg:hidden">
        <header className={`sticky top-0 z-30 border-b px-4 py-3 backdrop-blur-xl ${isDark ? 'border-white/10 bg-black/65' : 'border-[#f15a0f]/15 bg-white/80'}`}>
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={onGoDashboard} className={`flex items-center gap-1 text-sm ${isDark ? 'text-white/70 hover:text-white' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="min-w-0 text-center">
              <h1 className="truncate text-sm font-semibold">{notebook?.title || 'Notebook'}</h1>
              <p className={`text-[11px] ${isDark ? 'text-white/45' : 'text-[#64748b]'}`}>Notebook Summary</p>
            </div>
            <div className="h-8 w-8" aria-hidden="true" />
          </div>
        </header>

        <div className={`border-b px-4 py-2.5 ${isDark ? 'border-white/5 bg-black/35' : 'border-[#f15a0f]/10 bg-white/65'}`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className={`mr-1 text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-[#64748b]'}`}>Sources:</span>
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
                  selectedSource?.id === source.id
                    ? 'border-[#f15a0f]/70 bg-[#f15a0f]/20 text-[#8a3915]'
                    : isDark
                      ? 'border-white/20 text-white/70'
                      : 'border-[#d9d2c8] bg-white/90 text-[#5b6472]'
                }`}
              >
                {shortenSourceName(source.name, 18)}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-6 px-4 py-6 pb-36 md:px-6 md:pb-40">
          {messages.map((message, idx) => (
              <article key={`${message.role}-${idx}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-3xl border p-4 text-sm leading-relaxed ${message.role === 'user' ? 'border-[#f15a0f]/25 bg-[#fff6f1] text-[#1f2937]' : isDark ? 'border-white/12 bg-white/[0.04] text-white' : 'border-[#f15a0f]/18 bg-white/88 text-[#0f172a]'}`}>
                  {renderMessageBody(message.text, message.role === 'user')}
                  {message.meta && <p className={`mt-2 text-xs ${message.role === 'user' ? 'text-black/60' : isDark ? 'text-white/45' : 'text-[#64748b]'}`}>{message.meta}</p>}
                </div>
              </article>
            ))}

          {asking && (
            <article className="flex justify-start">
              <div className={`flex items-center gap-2 rounded-3xl border border-[#f15a0f]/25 px-4 py-3 backdrop-blur-2xl ${isDark ? 'bg-[linear-gradient(150deg,rgba(241,90,15,0.15),rgba(255,255,255,0.02))]' : 'bg-white/90'}`}>
                <span className={`inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[#f15a0f]/40 ${isDark ? 'bg-black/55' : 'bg-white/95'}`}>
                  <img src={synapseLogo} alt="Synapse" className="h-4 w-4 object-contain" />
                </span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66] [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff9b66] [animation-delay:240ms]" />
              </div>
            </article>
          )}
        </section>

        <footer className={`fixed inset-x-0 bottom-0 mx-auto w-full max-w-3xl border-t px-4 py-4 backdrop-blur-xl md:px-6 ${isDark ? 'border-white/10 bg-black/85' : 'border-[#f15a0f]/15 bg-white/85'}`}>
          <form onSubmit={(event) => onAsk(event, sourceMode)} className="flex items-center gap-2 rounded-3xl border border-[#f15a0f]/30 bg-[linear-gradient(160deg,rgba(241,90,15,0.13),rgba(255,255,255,0.02))] p-2">
            <div className={`flex shrink-0 items-center rounded-xl border border-[#f15a0f]/35 p-1 ${isDark ? 'bg-black/25' : 'bg-white/85'}`}>
              <button
                type="button"
                onClick={() => setSourceMode('selected')}
                className={`rounded-lg px-2 py-1 text-[10px] font-medium transition ${
                  sourceMode === 'selected' ? 'bg-[#f15a0f] text-white' : isDark ? 'text-[#ffd4bd]' : 'text-[#6b7280]'
                }`}
              >
                This
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('all')}
                className={`rounded-lg px-2 py-1 text-[10px] font-medium transition ${
                  sourceMode === 'all' ? 'bg-[#f15a0f] text-white' : isDark ? 'text-[#ffd4bd]' : 'text-[#6b7280]'
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
              className={`min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none disabled:opacity-40 ${isDark ? 'text-white placeholder:text-white/35' : 'text-[#0f172a] placeholder:text-[#94a3b8]'}`}
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

      {sourceToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={() => (deletingSourceId ? null : setSourceToDelete(null))}
            aria-label="Close delete source modal"
          />

          <div className={`relative w-full max-w-md rounded-2xl border p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${isDark ? 'border-white/10 bg-[#111111] text-white' : 'border-[#f15a0f]/20 bg-white text-[#0f172a]'}`}>
            <h3 className="text-base font-semibold">Delete Source?</h3>
            <p className={`mt-2 text-sm ${isDark ? 'text-white/70' : 'text-[#475569]'}`}>
              This will remove
              {' '}
              <span className="font-semibold">{shortenSourceName(sourceToDelete.name, 42)}</span>
              {' '}
              from this notebook.
            </p>
            <p className={`mt-1 text-xs ${isDark ? 'text-white/50' : 'text-[#64748b]'}`}>
              If this source is not used in other notebooks, related indexed data may also be removed.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSourceToDelete(null)}
                disabled={Boolean(deletingSourceId)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition ${isDark ? 'border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]' : 'border-slate-200 bg-white text-[#334155] hover:bg-slate-50'} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSource}
                disabled={Boolean(deletingSourceId)}
                className="inline-flex min-w-[86px] items-center justify-center rounded-lg bg-[#dc2626] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingSourceId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotebookPage;
