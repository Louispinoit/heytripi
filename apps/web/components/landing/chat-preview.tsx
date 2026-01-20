"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  {
    id: 1,
    type: "bot",
    text: "Hey ! Où veux-tu partir ? Dis-moi tout sur ton voyage idéal !",
    delay: 500,
  },
  {
    id: 2,
    type: "user",
    text: "Je veux partir à Barcelone en mars, 5 jours, budget 800€",
    delay: 2000,
  },
  {
    id: 3,
    type: "bot",
    text: "Super choix ! 🎉 Barcelone en mars c'est parfait, 18°C en moyenne. J'ai trouvé 3 vols et 5 hôtels dans ton budget. On regarde ça ensemble ?",
    delay: 3500,
  },
];

export function ChatPreview() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingId, setCurrentTypingId] = useState<number | null>(null);

  useEffect(() => {
    const showMessages = async () => {
      for (const message of messages) {
        if (message.type === "bot") {
          // Show avatar + typing dots first
          setVisibleMessages((prev) => [...prev, message.id]);
          setIsTyping(true);
          setCurrentTypingId(message.id);
          await new Promise((resolve) => setTimeout(resolve, 1200));
          // Then show the text (avatar stays)
          setIsTyping(false);
          setCurrentTypingId(null);
        } else {
          // Small delay before user messages
          await new Promise((resolve) => setTimeout(resolve, 800));
          setVisibleMessages((prev) => [...prev, message.id]);
        }

        // Wait before next message
        await new Promise((resolve) => setTimeout(resolve, message.delay));
      }
    };

    const timer = setTimeout(showMessages, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <Card className="overflow-hidden border-2 bg-card shadow-2xl pt-0 shadow-primary/10">
        <div className="flex items-center gap-3 border-b bg-muted/50 px-6 py-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Bot className="size-5" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">Tripy</span>
            <Badge variant="outline" className="text-xs">
              <span className="mr-1.5 inline-block size-2 animate-pulse rounded-full bg-green-500" />
              En ligne
            </Badge>
          </div>
        </div>
        <CardContent className="min-h-[280px] space-y-6 p-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => {
              const isVisible = visibleMessages.includes(message.id);
              const showTyping = isTyping && currentTypingId === message.id;

              if (!isVisible) return null;

              if (message.type === "bot") {
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex gap-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Bot className="size-5" />
                    </div>
                    <div className="max-w-md rounded-2xl rounded-tl-none bg-muted px-5 py-3">
                      <AnimatePresence mode="wait">
                        {showTyping ? (
                          <motion.div
                            key="typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TypingDots />
                          </motion.div>
                        ) : (
                          <motion.p
                            key="text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm leading-relaxed"
                          >
                            {message.text}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex justify-end gap-4"
                >
                  <div className="max-w-md rounded-2xl rounded-tr-none bg-primary px-5 py-3 text-primary-foreground">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-muted-foreground/50"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
