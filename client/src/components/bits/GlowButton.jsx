function GlowButton({ className = '', type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      className={`transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,0.18)] ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default GlowButton;
