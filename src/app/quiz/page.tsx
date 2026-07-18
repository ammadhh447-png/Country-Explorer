"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, RotateCcw } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabBar } from "@/components/features/tab-bar";
import type { CountrySummary } from "@/types/country";

type QuizMode = "flag" | "capital" | "trivia";

const MODES = [
  { id: "flag", label: "Guess the Flag" },
  { id: "capital", label: "Guess the Capital" },
  { id: "trivia", label: "Country Trivia" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOptions(correct: CountrySummary, all: CountrySummary[], field: "name" | "capital"): string[] {
  const wrong = shuffle(all.filter((c) => c.cca3 !== correct.cca3)).slice(0, 3);
  const options = field === "name"
    ? [correct.name, ...wrong.map((c) => c.name)]
    : [correct.capital, ...wrong.map((c) => c.capital)];
  return shuffle(options);
}

export default function QuizPage() {
  const { data: countries = [], isLoading } = useCountries();
  const [mode, setMode] = useState<QuizMode>("flag");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState<CountrySummary | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const eligible = useMemo(
    () => countries.filter((c) => c.capital !== "N/A" && c.population > 100000),
    [countries]
  );

  const nextQuestion = useCallback(() => {
    if (!eligible.length) return;
    const country = eligible[Math.floor(Math.random() * eligible.length)];
    setCurrent(country);
    setSelected(null);
    setFeedback(null);

    if (mode === "flag") {
      setOptions(getOptions(country, eligible, "name"));
    } else if (mode === "capital") {
      setOptions(getOptions(country, eligible, "capital"));
    } else {
      const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
      const wrong = shuffle(regions.filter((r) => r !== country.region)).slice(0, 3);
      setOptions(shuffle([country.region, ...wrong]));
    }
  }, [eligible, mode]);

  const startQuiz = () => {
    setScore(0);
    setTotal(0);
    nextQuestion();
  };

  const handleAnswer = (answer: string) => {
    if (!current || selected) return;
    setSelected(answer);
    setTotal((t) => t + 1);

    let correct = false;
    if (mode === "flag") correct = answer === current.name;
    else if (mode === "capital") correct = answer === current.capital;
    else if (mode === "trivia") {
      correct = answer === current.region;
    }

    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
  };

  const correctAnswer = current
    ? mode === "flag"
      ? current.name
      : mode === "capital"
        ? current.capital
        : current.region
    : "";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-accent" />
          <h1 className="font-serif text-4xl font-bold">Country Quiz</h1>
        </div>
        <p className="text-muted-foreground mb-8">Test your geography knowledge</p>
      </motion.div>

      <TabBar tabs={MODES} value={mode} onValueChange={(id) => { setMode(id as QuizMode); setCurrent(null); }} className="mb-8" />

      {total > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="default">Score: {score}/{total}</Badge>
          <Badge variant="outline">{Math.round((score / total) * 100)}% accuracy</Badge>
        </div>
      )}

      {!current ? (
        <Card className="text-center py-16">
          <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="font-semibold text-xl mb-2">Ready to play?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "flag" && "Identify countries by their flags"}
            {mode === "capital" && "Match countries to their capitals"}
            {mode === "trivia" && "Answer trivia about countries"}
          </p>
          <Button onClick={startQuiz} disabled={isLoading || !eligible.length}>
            Start Quiz
          </Button>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.cca3 + total}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="text-center !p-8">
              {mode === "flag" && (
                <img
                  src={current.flagSvg || current.flag}
                  alt="Flag"
                  className="w-48 h-32 object-cover rounded-xl mx-auto mb-6 shadow-lg"
                />
              )}
              {mode === "capital" && (
                <div className="mb-6">
                  <img src={current.flag} alt="" className="w-16 h-10 mx-auto mb-4 rounded" />
                  <h2 className="font-serif text-3xl font-bold">{current.name}</h2>
                  <p className="text-muted-foreground mt-1">What is the capital?</p>
                </div>
              )}
              {mode === "trivia" && (
                <div className="mb-6">
                  <img src={current.flag} alt="" className="w-16 h-10 mx-auto mb-4 rounded" />
                  <h2 className="font-serif text-2xl font-bold mb-2">{current.name}</h2>
                  <p className="text-muted-foreground">Which region is this country in?</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = option === correctAnswer;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={!!selected}
                      className={`p-4 rounded-xl text-sm font-medium transition-all border ${
                        isSelected && isCorrect
                          ? "border-green-600 bg-green-500/10 text-green-700 dark:text-green-400"
                          : isSelected && !isCorrect
                            ? "border-red-600 bg-red-500/10 text-red-700 dark:text-red-400"
                            : selected && isCorrect
                              ? "border-green-600/50 bg-green-500/5 text-foreground"
                              : "border-border text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {option}
                        {isSelected && isCorrect && <Check className="w-4 h-4" />}
                        {isSelected && !isCorrect && <X className="w-4 h-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <p className={`text-sm mb-4 ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}>
                    {feedback === "correct" ? "Correct!" : `Wrong! The answer is ${correctAnswer}`}
                  </p>
                  <Button onClick={nextQuestion}>
                    <RotateCcw className="w-4 h-4" /> Next Question
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
