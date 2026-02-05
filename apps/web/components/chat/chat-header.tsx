"use client";

import { Bot, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatHeader() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Bot className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Tripy</h2>
          <p className="text-xs text-muted-foreground">Assistant voyage</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="size-8">
        <MoreVertical className="size-4" />
      </Button>
    </div>
  );
}
