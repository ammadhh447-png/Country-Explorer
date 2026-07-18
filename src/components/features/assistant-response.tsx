"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountryFlag } from "@/components/features/country-flag";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AssistantBlock } from "@/lib/api/assistant-engine";

export function AssistantResponse({ blocks }: { blocks: AssistantBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "title":
            return (
              <h3 key={i} className="font-serif text-lg font-semibold text-foreground">
                {block.content}
              </h3>
            );
          case "text":
            return (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {block.content}
              </p>
            );
          case "stats":
            return (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {block.items.map((item) => (
                  <div key={item.label} className="rounded-xl bg-muted/30 px-3 py-2.5 min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium mt-0.5 text-foreground break-words">{item.value}</p>
                  </div>
                ))}
              </div>
            );
          case "country":
            return (
              <Card key={i} className="!p-4">
                <div className="flex items-center gap-4">
                  <CountryFlag
                    cca2={block.country.cca2}
                    name={block.country.name}
                    className="w-16 h-10 rounded-lg shadow"
                  />
                  <div>
                    <p className="font-serif text-xl font-bold">{block.country.name}</p>
                    <p className="text-sm text-muted-foreground">{block.country.officialName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {block.country.capital} · {block.country.region}
                    </p>
                  </div>
                </div>
              </Card>
            );
          case "compare":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left p-3 text-muted-foreground font-medium">Metric</th>
                      <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <CountryFlag cca2={block.left.cca2} name={block.left.name} className="w-6 h-4 rounded shrink-0" />
                          <span className="break-words">{block.left.name}</span>
                        </div>
                      </th>
                      <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <CountryFlag cca2={block.right.cca2} name={block.right.name} className="w-6 h-4 rounded shrink-0" />
                          <span className="break-words">{block.right.name}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.label} className="border-b border-border/50 last:border-0">
                        <td className="p-3 text-muted-foreground">{row.label}</td>
                        <td className="p-3 font-medium text-foreground break-words">{row.left}</td>
                        <td className="p-3 font-medium text-foreground break-words">{row.right}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "ranking":
            return (
              <div key={i} className="space-y-1">
                {block.title && (
                  <p className="text-xs font-medium text-muted-foreground mb-2">{block.title}</p>
                )}
                {block.items.map((item) => (
                  <Link
                    key={item.cca3}
                    href={`/countries/${item.cca3.toLowerCase()}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/30 transition-colors min-w-0"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-6 shrink-0">#{item.rank}</span>
                    <CountryFlag cca2={item.cca2} name={item.name} className="w-7 h-5 rounded shrink-0" />
                    <span className="flex-1 text-sm font-medium text-foreground truncate min-w-0">{item.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 max-w-[40%] truncate">{item.value}</span>
                  </Link>
                ))}
              </div>
            );
          case "actions":
            return (
              <div key={i} className="flex flex-wrap gap-2 pt-1">
                {block.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button variant="secondary" size="sm">
                      {link.label}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
