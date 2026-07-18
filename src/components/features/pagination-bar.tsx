"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  label = "items",
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalItems?: number;
  pageSize?: number;
  label?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
    .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
      acc.push(p);
      return acc;
    }, []);

  const start = totalItems != null && pageSize ? (page - 1) * pageSize + 1 : null;
  const end = totalItems != null && pageSize ? Math.min(page * pageSize, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 mt-6">
      <p className="text-sm text-muted-foreground">
        {start != null && end != null && totalItems != null ? (
          <>Showing {start}–{end} of {totalItems} {label}</>
        ) : (
          <>Page {page} of {totalPages}</>
        )}
      </p>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`e-${idx}`} className="px-2 text-muted-foreground">…</span>
            ) : (
              <Button
                key={item}
                variant={page === item ? "default" : "ghost"}
                size="sm"
                className="min-w-9"
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            )
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
