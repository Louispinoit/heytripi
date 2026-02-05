"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type QuickRepliesProps = {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
};

export function QuickReplies({ suggestions, onSelect, disabled }: QuickRepliesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className={cn(
            "rounded-full border border-border bg-background px-3 py-1.5 text-sm",
            "transition-colors hover:bg-muted hover:border-primary/30",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
}
