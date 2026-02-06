"use client";

import type { UIMessage } from "ai";
import type { FormEvent, ChangeEvent, ReactNode } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";

type ChatContainerProps = {
  messages: UIMessage[];
  input: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  onQuickReply?: (text: string) => void;
  actionsSlot?: ReactNode;
  className?: string;
};

export function ChatContainer({
  messages,
  input,
  onInputChange,
  onSubmit,
  isLoading,
  onQuickReply,
  actionsSlot,
  className,
}: ChatContainerProps) {
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <ChatHeader />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onQuickReply={onQuickReply}
      />
      {actionsSlot}
      <ChatInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
