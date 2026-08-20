export function WaveRibbon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ribbon-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b8f96" stopOpacity="0" />
          <stop offset="18%" stopColor="#c7cad0" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#f2f3f5" stopOpacity="0.55" />
          <stop offset="82%" stopColor="#c7cad0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b8f96" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ribbon-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b6e73" stopOpacity="0" />
          <stop offset="30%" stopColor="#9a9ea5" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#d5d7db" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6b6e73" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ribbon-highlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="ribbon-blur-soft" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="ribbon-blur-tight" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <g className="wave-drift-slow">
        <path
          d="M -100 300 C 200 180, 480 380, 780 250 S 1300 120, 1700 260"
          fill="none"
          stroke="url(#ribbon-b)"
          strokeWidth="44"
          filter="url(#ribbon-blur-soft)"
        />
      </g>

      <g className="wave-drift">
        <path
          d="M -100 260 C 250 340, 500 160, 800 240 S 1250 340, 1700 200"
          fill="none"
          stroke="url(#ribbon-a)"
          strokeWidth="30"
          filter="url(#ribbon-blur-soft)"
        />
        <path
          d="M -100 270 C 260 330, 520 190, 800 250 S 1240 320, 1700 210"
          fill="none"
          stroke="url(#ribbon-highlight)"
          strokeWidth="2.5"
          filter="url(#ribbon-blur-tight)"
        />
      </g>

      <g className="wave-drift-rev">
        <path
          d="M -100 240 C 300 150, 560 300, 850 230 S 1350 150, 1700 250"
          fill="none"
          stroke="url(#ribbon-a)"
          strokeWidth="16"
          strokeOpacity="0.6"
          filter="url(#ribbon-blur-tight)"
        />
      </g>
    </svg>
  );
}
