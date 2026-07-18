import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.65" />
      <ellipse cx="12" cy="12" rx="3.25" ry="8.75" stroke="currentColor" strokeWidth="1.35" opacity="0.55" />
      <path d="M3.25 12h17.5" stroke="currentColor" strokeWidth="1.35" opacity="0.55" strokeLinecap="round" />
      <path
        d="M12 4.5v2.25M12 17.25V19.5M4.5 12h2.25M17.25 12H19.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M12 6.25l2.35 6.75H9.65L12 6.25z" fill="currentColor" />
      <path d="M12 17.75l-2.35-6.75h4.7L12 17.75z" fill="currentColor" opacity="0.35" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}
