// Brand logo — open book + rising arrow (learn → grow → achieve)
export default function Logo({ size = 38, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`logo ${className}`}
      aria-label="Learn-Grow-Achieve logo"
    >
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="lg-arrow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lg-bg)" />
      {/* open book */}
      <path className="logo-book" d="M32 28c-4-2-10-4-16-3.5V16c6 3 12 4 16 3.5 4 .5 10-.5 16-3.5v8.5c-6-.5-12 .5-16 3.5z" fill="#fff" />
      <path className="logo-spine" d="M32 27v14" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" />
      {/* rising arrow */}
      <path className="logo-arrow" d="M32 26V13m0 0-4.5 4.5M32 13l4.5 4.5" stroke="url(#lg-arrow)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* sparkle */}
      <path className="logo-sparkle" d="M46 10l1.3 3.4 3.4 1.3-3.4 1.3-1.3 3.4-1.3-3.4-3.4-1.3 3.4-1.3z" fill="#fbbf24" />
    </svg>
  );
}