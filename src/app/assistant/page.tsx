"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { AssistantResponse } from "@/components/features/assistant-response";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AssistantReply } from "@/lib/api/assistant-engine";

interface Message {
  role: "user" | "assistant";
  content?: string;
  reply?: AssistantReply;
}

const SUGGESTIONS = [
  "Tell me about Japan",
  "Compare France and Germany",
  "Largest countries by population",
  "What currency does Brazil use?",
  "Countries in Europe",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      reply: {
        blocks: [
          { type: "title", content: "Welcome to Country Assistant" },
          {
            type: "text",
            content:
              "Ask about any country, compare nations, or explore rankings. Answers are built from verified live data — an LLM helps understand your question when configured.",
          },
        ],
      },
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reply = (await res.json()) as AssistantReply;
      setMessages((prev) => [...prev, { role: "assistant", reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          reply: {
            blocks: [
              { type: "title", content: "Something went wrong" },
              {
                type: "text",
                content: "Could not process your question. Please try again in a moment.",
              },
            ],
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="size-8 text-accent" />
          <h1 className="font-serif text-4xl font-bold">Country Assistant</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Powered by OpenRouter LLM for understanding your questions — every answer is built from verified country data
        </p>
      </motion.div>

      <Card className="!p-0 overflow-hidden flex flex-col h-[640px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="size-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                  <Bot className="size-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[88%] rounded-xl px-4 py-3 ${
                  msg.role === "user" ? "gradient-bg text-primary-foreground text-sm" : "glass"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : msg.reply ? (
                  <AssistantResponse blocks={msg.reply.blocks} />
                ) : null}
              </div>
              {msg.role === "user" && (
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-lg gradient-bg flex items-center justify-center">
                <Bot className="size-4 text-primary-foreground" />
              </div>
              <div className="glass rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="size-2 rounded-full bg-accent animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full glass hover:bg-muted/30 transition-colors text-muted-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about any country..."
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={() => handleSend()} disabled={loading || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
