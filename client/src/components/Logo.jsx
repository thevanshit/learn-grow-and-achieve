// Brand logo — graduation cap on an open book, tassel rising into a star
// (learn → grow → achieve)
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
        <linearGradient id="lg-tassel" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>

      {/* background */}
      <rect width="64" height="64" rx="16" fill="url(#lg-bg)" />
      <circle cx="14" cy="10" r="26" fill="#fff" opacity="0.07" />

      {/* open book (learn) */}
      <path
        className="logo-book"
        d="M32 38c-6-4-14-4.5-20-1.5v13.5c6-2 14-1 20 2 6-3 14-4 20-2V36.5c-6-3-14-2.5-20 1.5z"
        fill="#fff"
      />
      <path className="logo-spine" d="M32 36.5V51" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />

      {/* mortarboard (achieve) */}
      <path className="logo-cap" d="M32 12 50 20 32 28 14 20Z" fill="#fff" />
      <path className="logo-band" d="M14 20 32 28 50 20v5L32 33l-18-8z" fill="#c7d2fe" />

      {/* tassel rising like a growth curve (grow) */}
      <path
        className="logo-tassel"
        d="M50 20c3.5-2.5 5-6 5-9"
        stroke="url(#lg-tassel)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* star at the tip */}
      <path
        className="logo-star"
        d="M56 6l1.3 3.4 3.4 1.3-3.4 1.3-1.3 3.4-1.3-3.4-3.4-1.3 3.4-1.3z"
        fill="#fbbf24"
      />
    </svg>
  );
}