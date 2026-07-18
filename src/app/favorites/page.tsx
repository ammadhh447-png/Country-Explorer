"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function FavoritesPage() {
  const { favorites, clearAll, loaded } = useFavorites();

  if (!loaded) {
    return <div className="max-w-7xl mx-auto px-4 py-20 skeleton h-64 rounded-2xl" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-accent" />
              <h1 className="font-serif text-4xl font-bold">Favorites</h1>
            </div>
            <p className="text-muted-foreground">Saved countries stored locally in your browser</p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearAll();
                toast.success("Favorites cleared");
              }}
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </Button>
          )}
        </div>
      </motion.div>

      <section>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-accent" /> Saved Countries
          <Badge>{favorites.length}</Badge>
        </h2>
        {favorites.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No favorites yet. Explore countries and click the heart icon.
            </p>
            <Link href="/countries">
              <Button>Browse Countries</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((f) => (
              <Link key={f.cca3} href={`/countries/${f.cca3.toLowerCase()}`}>
                <Card className="flex items-center gap-3 !p-4 card-hover">
                  <img src={f.flag} alt="" className="w-10 h-7 rounded object-cover" />
                  <div>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(f.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
