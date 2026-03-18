function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex w-full flex-col gap-2 px-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-full sm:max-w-sm sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md transition ${
            toast.kind === 'error'
              ? 'border-red-300/40 bg-red-950/70 text-red-100'
              : toast.kind === 'warning'
                ? 'border-amber-300/40 bg-amber-950/70 text-amber-100'
                : 'border-emerald-300/40 bg-emerald-950/70 text-emerald-100'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md px-1.5 py-0.5 text-xs opacity-80 transition hover:bg-black/25 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
