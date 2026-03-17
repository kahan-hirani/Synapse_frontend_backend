function GlassPanel({ className = '', children }) {
  return <section className={`glass-panel ${className}`.trim()}>{children}</section>;
}

export default GlassPanel;
