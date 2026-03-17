import { useEffect, useState } from 'react';

function RenameNotebookModal({ isOpen, isDark, notebookTitle, onClose, onRename }) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(notebookTitle || '');
  }, [isOpen, notebookTitle]);

  if (!isOpen) return null;

  const submit = (event) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    onRename(nextTitle);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <form
        onSubmit={submit}
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          isDark ? 'border-white/10 bg-[#111] text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <h2 className="text-xl font-bold tracking-tight">Rename Notebook</h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Give it a name that is easy to recognize.</p>

        <label className="mt-5 block text-sm font-medium" htmlFor="rename-notebook-name">
          Notebook Name
        </label>
        <input
          id="rename-notebook-name"
          type="text"
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={`mt-2 w-full rounded-xl border px-3 py-2.5 outline-none transition ${
            isDark
              ? 'border-white/20 bg-white/[0.04] text-white placeholder:text-white/35 focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
              : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
          }`}
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-xl bg-[#f15a0f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#de5009] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default RenameNotebookModal;
