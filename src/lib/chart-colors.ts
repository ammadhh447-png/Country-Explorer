export const CHART_CATEGORICAL = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#4f46e5",
  "#0d9488",
  "#ea580c",
] as const;

export const CHART_CONTINENT_COLORS: Record<string, string> = {
  Africa: "#F28E2B",
  Asia: "#E15759",
  Europe: "#4E79A7",
  "North America": "#59A14F",
  "South America": "#B07AA1",
  Oceania: "#76B7B2",
  Antarctica: "#BAB0AC",
};

export const CHART_SERIES = ["#2563eb", "#db2777", "#059669"] as const;

export const CHART_PRIMARY = "#2563eb";
export const CHART_GDP = "#0d9488";
export const CHART_POPULATION = "#4f46e5";
export const CHART_LIFE = "#059669";

export function getChartColor(index: number, palette: readonly string[] = CHART_CATEGORICAL): string {
  return palette[index % palette.length];
}

export function getContinentChartColor(name: string): string {
  return CHART_CONTINENT_COLORS[name] ?? "#64748b";
}
