"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Sonner
      theme={(mounted ? resolvedTheme : "dark") as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "glass border-border text-foreground",
          description: "text-muted-foreground",
          actionButton: "gradient-bg text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
