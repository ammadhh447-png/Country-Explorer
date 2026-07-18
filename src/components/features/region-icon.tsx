import { cn } from "@/lib/utils";

type RegionIconProps = {
  region: string;
  className?: string;
};

export function RegionIcon({ region, className }: RegionIconProps) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: cn("shrink-0", className),
    "aria-hidden": true as const,
  };

  switch (region) {
    case "Africa":
      return (
        <svg {...props}>
          <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 3.5V5.5M12 12.5V14.5M7.05 5.55L8.46 6.96M15.54 11.04L16.95 12.45M5.5 9H7.5M16.5 9H18.5M7.05 12.45L8.46 11.04M15.54 6.96L16.95 5.55"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M6 18c1.2-1.5 3-2.5 6-2.5s4.8 1 6 2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Americas":
      return (
        <svg {...props}>
          <path
            d="M8 4.5c-1.2 2.5-1.5 5.5-1 8.5.4 2.5 1.2 4.5 2.5 6.5M16 4.5c1.2 2.5 1.5 5.5 1 8.5-.4 2.5-1.2 4.5-2.5 6.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 3v3M9.5 19.5h5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M6 10h12M7 14h10"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      );
    case "Asia":
      return (
        <svg {...props}>
          <path
            d="M5 19V9l7-4 7 4v10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 19v-5h6v5M12 5v3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 9h14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      );
    case "Europe":
      return (
        <svg {...props}>
          <path
            d="M6 19V11l6-5 6 5v8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 19v-4h6v4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="8" r="1.25" fill="currentColor" />
          <path
            d="M4 19h16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Oceania":
      return (
        <svg {...props}>
          <path
            d="M4 16c2.5-2 5.5-2 8 0s5.5 2 8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M3 19c3-1.5 6-1.5 9 0s6 1.5 9 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.75"
          />
          <circle cx="8" cy="9" r="1.75" fill="currentColor" />
          <circle cx="14" cy="7" r="1.25" fill="currentColor" opacity="0.85" />
          <circle cx="17" cy="11" r="1.5" fill="currentColor" opacity="0.9" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 12h16M12 4c2 2.5 3 5 3 8s-1 5.5-3 8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
  }
}

export function RegionIconBadge({ region }: { region: string }) {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center border border-border bg-muted/50 dark:bg-muted/30">
      <RegionIcon region={region} className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
    </div>
  );
}
