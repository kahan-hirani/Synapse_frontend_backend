import { useMemo } from 'react';

function NotebookPage({
  notebook,
  notebooks,
  sourceInputRef,
  selectedSourceId,
  question,
  asking,
  uploading,
  status,
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="hidden min-h-screen lg:flex lg:items-start">
        <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r border-white/10 bg-black/40 p-4 backdrop-blur-md">
          <h2 className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/45">Sources</h2>
          <input ref={sourceInputRef} type="file" accept="application/pdf" onChange={onUpload} disabled={uploading} className="hidden" />
          <div className="space-y-2">
            {notebook?.sources?.length ? (
              notebook.sources.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => onSelectSource(source.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                    selectedSource?.id === source.id
                      ? 'border-white/25 bg-white/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25'
                  }`}
                >
              <span className="text-[11px] font-medium uppercase tracking-wide">PDF</span>
                  <span className="min-w-0 flex-1 truncate text-xs">{source.name}</span>
                </button>
              ))
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-white/55">No sources yet</div>
            )}
          </div>

          <button
            type="button"
            onClick={onRequestUpload}
            className="mt-5 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-slate-200"
          >
            {uploading ? 'Uploading...' : '+ Add Source'}
          </button>
        </aside>

        <main className="flex h-screen min-h-screen flex-1 flex-col bg-[linear-gradient(110deg,#0b0b0b_0%,#141414_48%,#121212_100%)]">
          <header className="flex h-14 items-center justify-between border-b border-white/10 bg-black/30 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button type="button" onClick={onGoDashboard} className="text-sm text-white/70 hover:text-white">← Library</button>
              <h1 className="text-sm font-semibold tracking-tight">{notebook?.title || 'Notebook'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onRequestUpload} className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/85 hover:bg-white/10">
                + Add Source
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[10px]">JD</div>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto px-8 py-8">
            <div className="mx-auto w-full max-w-3xl space-y-8">
              {messages.length === 0 ? (
                <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/65 backdrop-blur-xl">
                  Ask anything about your connected sources.
                </article>
              ) : (
                messages.map((message, idx) => (
                  <article key={`${message.role}-${idx}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[88%] rounded-2xl border p-5 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'border-white/40 bg-white text-black'
                          : 'border-white/10 bg-white/[0.05] text-white backdrop-blur-xl'
                      }`}
                    >
                      <p>{message.text}</p>
                      {message.meta && <p className={`mt-3 text-[11px] ${message.role === 'user' ? 'text-black/60' : 'text-white/45'}`}>{message.meta}</p>}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <footer className="border-t border-white/10 bg-black/35 px-8 py-5 backdrop-blur-xl">
            <form onSubmit={onAsk} className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-2">
              <button type="button" onClick={onRequestUpload} className="rounded-xl p-2 text-white/65 hover:bg-white/10 hover:text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                type="text"
                value={question}
                onChange={(event) => onQuestionChange(event.target.value)}
                placeholder={selectedSource?.pdfId ? 'Ask about your sources...' : 'Upload or select a source first'}
                disabled={!selectedSource?.pdfId || asking}
                className="flex-1 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!selectedSource?.pdfId || asking}
                className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {asking ? 'Thinking...' : 'Send'}
              </button>
            </form>
            {status && <p className="mx-auto mt-2 w-full max-w-3xl text-xs text-white/55">{status}</p>}
          </footer>
        </main>

        <aside className="sticky top-0 h-screen w-72 shrink-0 overflow-y-auto border-l border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/45">Notebook Summary</h2>
          <article className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
            Gathering insights on {notebook?.title || 'this notebook'} with grounded responses and citations.
          </article>

          <h3 className="mt-8 text-[10px] uppercase tracking-[0.2em] text-white/45">Key Insights</h3>
          <div className="mt-4 space-y-3">
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/70">Ask for summaries grouped by source.</article>
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/70">Request contradictions to spot weak claims.</article>
          </div>

          <button type="button" className="mt-8 w-full rounded-xl border border-white/20 bg-white/[0.04] py-2.5 text-sm text-white/85 hover:bg-white/12">
            Share Research
          </button>

          <div className="mt-8">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/45">Quick switch</p>
            <div className="space-y-2">
              {notebooks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenNotebook(item.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                    item.id === notebook?.id
                      ? 'border-white/25 bg-white/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="lg:hidden">
        <header className="border-b border-white/10 bg-[linear-gradient(110deg,#171717_0%,#222_55%,#1d1d1d_100%)] px-5 py-4">
          <div className="flex items-center justify-between">
            <button type="button" onClick={onGoDashboard} className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="min-w-0 text-center">
              <h1 className="truncate text-base font-semibold">{notebook?.title || 'Notebook'}</h1>
              <p className="text-xs text-white/55">Notebook Summary</p>
            </div>
            <button type="button" className="rounded-full p-1.5 text-white/70 hover:bg-white/10">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </header>

        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="mr-2 text-sm uppercase tracking-[0.14em] text-white/45">Sources:</span>
            {notebook?.sources?.slice(0, 3).map((source) => (
              <button
                key={source.id}
                type="button"
                onClick={() => onSelectSource(source.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                  selectedSource?.id === source.id ? 'border-white/40 bg-white/10 text-white' : 'border-white/20 text-white/70'
                }`}
              >
                {source.name}
              </button>
            ))}
            <button type="button" onClick={onRequestUpload} className="rounded-full border border-white/20 px-3 py-2 text-lg text-white">+</button>
          </div>
        </div>

        <section className="space-y-6 px-4 py-6 pb-36">
          {messages.length === 0 ? (
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/65">Ask anything about your sources...</article>
          ) : (
            messages.map((message, idx) => (
              <article key={`${message.role}-${idx}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-3xl border p-4 text-sm ${message.role === 'user' ? 'border-white/35 bg-white text-black' : 'border-white/12 bg-white/[0.04] text-white'}`}>
                  {message.text}
                  {message.meta && <p className={`mt-2 text-xs ${message.role === 'user' ? 'text-black/60' : 'text-white/45'}`}>{message.meta}</p>}
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-black/80 px-4 py-4 backdrop-blur-xl">
          <form onSubmit={onAsk} className="flex items-center gap-2 rounded-3xl border border-white/15 bg-white/[0.04] p-2">
            <button type="button" onClick={onRequestUpload} className="rounded-full p-1.5 text-white/70 hover:bg-white/10">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <input
              type="text"
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder={selectedSource?.pdfId ? 'Ask anything about your sources...' : 'Upload a source first'}
              disabled={!selectedSource?.pdfId || asking}
              className="flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-40"
            />
            <button type="submit" disabled={!selectedSource?.pdfId || asking} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black disabled:opacity-40">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>
          {status && <p className="mt-2 text-center text-xs text-white/55">{status}</p>}
        </footer>
      </div>
    </div>
  );
}

export default NotebookPage;
