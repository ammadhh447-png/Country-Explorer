"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Map,
  GitCompare,
  Sparkles,
  Clock,
  Trophy,
  Heart,
  Mail,
  ArrowRight,
  Compass,
  Shield,
  Globe2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/brand/site-logo";

const HIGHLIGHTS = [
  {
    icon: Globe2,
    title: "Country Profiles",
    desc: "Explore capitals, languages, currencies, time zones, and culture for every nation.",
    href: "/countries",
  },
  {
    icon: Map,
    title: "Interactive World Map",
    desc: "Navigate the globe visually and jump straight into any country profile.",
    href: "/map",
  },
  {
    icon: BarChart3,
    title: "Statistics & Rankings",
    desc: "Compare population, area, development, and language diversity across the world.",
    href: "/statistics",
  },
  {
    icon: GitCompare,
    title: "Side-by-Side Compare",
    desc: "Put two or three countries next to each other and review key metrics at a glance.",
    href: "/compare",
  },
  {
    icon: Sparkles,
    title: "Country Assistant",
    desc: "Ask questions in plain language and get structured answers grounded in live data.",
    href: "/assistant",
  },
  {
    icon: Clock,
    title: "World Time",
    desc: "View live local times for every nation, compare time zones, and track major capitals worldwide.",
    href: "/time",
  },
];

const VALUES = [
  {
    icon: Compass,
    title: "Built for discovery",
    desc: "Whether you are researching, travelling, or simply curious, Country Explorer makes world knowledge easy to browse.",
  },
  {
    icon: Shield,
    title: "Clear and dependable",
    desc: "Figures and profiles are refreshed from established public datasets so you can explore with confidence.",
  },
  {
    icon: Heart,
    title: "Designed for everyone",
    desc: "A clean, responsive experience in light or dark mode — on desktop, tablet, or mobile.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="min-w-0">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 gradient-bg opacity-[0.07] dark:opacity-[0.12]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="flex flex-col items-center">
            <SiteLogo size={56} className="mb-5 shadow-lg shadow-indigo-500/25" />
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 break-words">
              About Country Explorer
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Your gateway to understanding the world — one country at a time.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14 sm:space-y-16">
        <motion.section {...fadeUp} transition={{ duration: 0.45, delay: 0.05 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Our purpose</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Making global knowledge accessible
              </h2>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Country Explorer brings together maps, profiles, statistics, comparisons, and quizzes
                in one place — so you can learn about any nation without jumping between dozens of
                websites.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From population and geography to languages, currencies, and regional context, the
                platform is built for students, travellers, researchers, and anyone who wants a
                clearer picture of our world.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Explore</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              What you can do here
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
              >
                <Link href={item.href} className="block h-full min-w-0 group">
                  <Card className="h-full card-hover !p-5 sm:!p-6 flex flex-col">
                    <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0 mb-4 group-hover:scale-105 transition-transform">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words">
                      {item.desc}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp} transition={{ duration: 0.45, delay: 0.15 }}>
          <Card className="!p-6 sm:!p-8 border-accent/15 bg-accent/[0.03]">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Principles</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Why Country Explorer
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VALUES.map((value) => (
                <div key={value.title} className="flex flex-col items-center text-center min-w-0 px-2">
                  <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 mb-4">
                    <value.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: "Countries", value: "250+", icon: Globe2 },
            { label: "Data modules", value: "12+", icon: BarChart3 },
            { label: "Rankings", value: "5", icon: Trophy },
            { label: "Time zones", value: "250+", icon: Clock },
          ].map((stat) => (
            <Card key={stat.label} className="!p-4 sm:!p-5 text-center min-w-0 flex flex-col items-center">
              <div className="w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 mb-3">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{stat.label}</p>
            </Card>
          ))}
        </motion.section>

        <motion.section
          id="contact"
          {...fadeUp}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="!p-6 sm:!p-8 flex flex-col justify-between min-w-0">
            <div>
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 mb-4">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3">
                Get in touch
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                Have feedback, a suggestion, or a question about Country Explorer? We would love
                to hear from you. Your input helps us keep improving the experience for everyone.
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-6 pt-6 border-t border-border/60">
              Reach out via the contact options listed on this page or explore the platform to
              see what is new.
            </p>
          </Card>

          <Card className="!p-6 sm:!p-8 gradient-bg text-primary-foreground flex flex-col justify-center min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3">
              Start exploring today
            </h2>
            <p className="text-sm opacity-90 leading-relaxed mb-6 break-words">
              Browse all countries, compare nations side by side, or ask the assistant
              anything about the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/countries">
                <Button variant="secondary" className="w-full sm:w-auto bg-card text-foreground hover:bg-card/90">
                  Browse Countries
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/assistant">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Try Assistant
                </Button>
              </Link>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
