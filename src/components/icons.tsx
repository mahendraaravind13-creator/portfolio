// Small inline icon set (no icon library → smaller bundle, nothing to break).
type P = { className?: string };
const base = "shrink-0";

export const GitHubIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const LinkedInIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

export const LeetCodeIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
    <path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.2l-2.26 2.43a5.9 5.9 0 0 0-1.36 2.35 5.64 5.64 0 0 0 .05 3.44 5.9 5.9 0 0 0 1.38 2.24l4.35 4.39c1.4 1.4 3.4 2.1 5.33 1.9a6.1 6.1 0 0 0 3.6-1.64l2.45-2.4a1.38 1.38 0 0 0-1.93-1.97l-2.45 2.4a3.4 3.4 0 0 1-4.86-.07L7.11 14.9a3.07 3.07 0 0 1 .02-4.43l4.8-5.14 2.53-2.72A1.38 1.38 0 0 0 13.48 0Zm-2.87 12.04a1.38 1.38 0 1 0 0 2.76h9.4a1.38 1.38 0 1 0 0-2.76h-9.4Z" />
  </svg>
);

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const MailIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}>
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);
export const PhoneIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);
export const ArrowRightIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeftIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const ExternalIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const DownloadIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
);
export const FileIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>
);
export const SunIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const MoonIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
);
export const MenuIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const MapPinIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const GradCapIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M22 9 12 4 2 9l10 5 10-5Z" /><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>
);
export const SparkIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>
);
export const TrophyIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden className={`${base} ${className}`}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg>
);
