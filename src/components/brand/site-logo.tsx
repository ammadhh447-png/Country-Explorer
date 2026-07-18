import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo-mark";

export function SiteLogo({
  className,
  size = 36,
  showBackground = true,
}: {
  className?: string;
  size?: number;
  showBackground?: boolean;
}) {
  const iconSize = Math.round(size * 0.58);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0",
        showBackground &&
          "rounded-xl border border-border bg-muted/60 dark:bg-muted/40 shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      <LogoMark size={iconSize} className="text-foreground" />
    </div>
  );
}
