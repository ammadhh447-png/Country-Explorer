"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  items: readonly { q: string; a: string }[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.q}
            className="glass rounded-2xl overflow-hidden border border-border/60"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-sm sm:text-base leading-snug pr-2 text-foreground break-words min-w-0">
                {item.q}
              </span>
              <span
                className={cn(
                  "shrink-0 size-8 rounded-lg flex items-center justify-center transition-all",
                  isOpen ? "gradient-bg text-primary-foreground rotate-45" : "bg-muted text-muted-foreground"
                )}
              >
                <Plus className="size-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
