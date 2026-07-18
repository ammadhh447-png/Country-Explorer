"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllSummaries,
  getCountryByCode,
  searchCountries,
} from "@/lib/api/countries";
import { getCountryIndicators } from "@/lib/api/world-bank";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getAllSummaries,
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
}

export function useCountry(code: string) {
  return useQuery({
    queryKey: ["country", code],
    queryFn: () => getCountryByCode(code),
    enabled: !!code,
    retry: 2,
  });
}

export function useCountrySearch(query: string) {
  return useQuery({
    queryKey: ["countries-search", query],
    queryFn: () => searchCountries(query),
    enabled: query.length >= 2,
  });
}

export function useCountryIndicators(iso3: string) {
  return useQuery({
    queryKey: ["indicators", iso3],
    queryFn: () => getCountryIndicators(iso3),
    enabled: !!iso3,
  });
}
