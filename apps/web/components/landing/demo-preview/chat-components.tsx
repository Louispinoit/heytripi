"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { TypingDots } from "./typing-dots";

export function ChatSubHeader() {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b bg-muted/30 px-4 py-2">
      <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Bot className="size-3.5" />
      </div>
      <span className="text-xs font-medium">Tripy</span>
      <span className="text-xs text-muted-foreground">• Assistant voyage</span>
    </div>
  );
}

export function BotMessage({ text, showTyping }: { text: string; showTyping: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Bot className="size-4" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-muted px-4 py-2.5">
        <AnimatePresence mode="wait">
          {showTyping ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TypingDots />
            </motion.div>
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm leading-relaxed"
            >
              {text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function UserMessage({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-primary px-4 py-2.5 text-primary-foreground">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
