function MonoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mono-grid-bg">
      <div className="absolute -top-20 left-8 h-48 w-48 rounded-full border border-white/30 bg-white/10 blur-2xl animate-drift" />
      <div className="absolute top-1/3 right-12 h-64 w-64 rounded-full border border-white/20 bg-white/10 blur-3xl animate-drift" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full border border-white/20 bg-white/10 blur-2xl animate-drift" style={{ animationDelay: '0.6s' }} />
    </div>
  );
}

export default MonoBackground;
