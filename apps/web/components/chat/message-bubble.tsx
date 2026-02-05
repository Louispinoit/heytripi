"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { TypingIndicator } from "./typing-indicator";
import { MarkdownContent } from "./markdown-content";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const isAssistant = role === "assistant";

  if (isAssistant) {
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
          {isStreaming && !content ? (
            <TypingIndicator />
          ) : (
            <MarkdownContent content={content} />
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-primary px-4 py-2.5 text-primary-foreground">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
}
