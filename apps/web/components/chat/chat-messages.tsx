"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./message-bubble";
import { QuickReplies } from "./quick-replies";

type ChatMessagesProps = {
  messages: UIMessage[];
  isLoading?: boolean;
  onQuickReply?: (text: string) => void;
};

const INITIAL_SUGGESTIONS = [
  "Je veux partir à Barcelone",
  "Un week-end romantique",
  "Roadtrip en Italie",
  "Où partir en mai ?",
];

function getMessageContent(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function ChatMessages({ messages, isLoading, onQuickReply }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showSuggestions = messages.length === 0 && !isLoading;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Welcome message when no messages */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Salut ! Je suis Tripy
            </h2>
            <p className="text-muted-foreground">
              Ton assistant voyage personnel. Dis-moi où tu veux aller,
              et je t'aide à tout planifier !
            </p>
            {showSuggestions && onQuickReply && (
              <div className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Essaie de dire :
                </p>
                <QuickReplies
                  suggestions={INITIAL_SUGGESTIONS}
                  onSelect={onQuickReply}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages list */}
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          role={message.role as "user" | "assistant"}
          content={getMessageContent(message)}
          isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
        />
      ))}

      {/* Typing indicator when loading and last message is from user */}
      {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
        <MessageBubble role="assistant" content="" isStreaming />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
