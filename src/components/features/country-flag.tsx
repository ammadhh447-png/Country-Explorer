"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getFlagUrl, getFlagSvgUrl } from "@/lib/format";

export function CountryFlag({
  cca2,
  name,
  className,
  svg = false,
}: {
  cca2: string;
  name?: string;
  className?: string;
  svg?: boolean;
}) {
  const [src, setSrc] = useState(svg ? getFlagSvgUrl(cca2) : getFlagUrl(cca2));

  return (
    <img
      src={src}
      alt={name ? `${name} flag` : ""}
      className={cn("object-cover rounded", className)}
      loading="lazy"
      onError={() => {
        if (svg) setSrc(getFlagUrl(cca2));
        else setSrc(getFlagUrl(cca2, "w160"));
      }}
    />
  );
}
