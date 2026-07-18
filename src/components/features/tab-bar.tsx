"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabBar({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
