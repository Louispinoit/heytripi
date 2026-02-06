"use client";

import { motion } from "framer-motion";
import type { QuickAction } from "../types";

interface QuickActionsBarProps {
  actions: QuickAction[];
  onAction: (prompt: string) => void;
}

export function QuickActionsBar({ actions, onAction }: QuickActionsBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide"
    >
      {actions.map((action, i) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onAction(action.prompt)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span>{action.emoji}</span>
          <span>{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
