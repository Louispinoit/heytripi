"use client";

import { Fragment } from "react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Simple markdown parser for chat messages
// Supports: **bold**, *italic*, `code`, lists, and line breaks
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const parseInline = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        result.push(<strong key={key++}>{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text*
      const italicMatch = remaining.match(/^\*(.+?)\*/);
      if (italicMatch) {
        result.push(<em key={key++}>{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Code: `text`
      const codeMatch = remaining.match(/^`(.+?)`/);
      if (codeMatch) {
        result.push(
          <code key={key++} className="bg-muted-foreground/20 px-1 py-0.5 rounded text-xs">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Regular text until next special character
      const nextSpecial = remaining.search(/[\*`]/);
      if (nextSpecial === -1) {
        result.push(<Fragment key={key++}>{remaining}</Fragment>);
        break;
      } else if (nextSpecial === 0) {
        // Special char but no match, treat as regular text
        result.push(<Fragment key={key++}>{remaining[0]}</Fragment>);
        remaining = remaining.slice(1);
      } else {
        result.push(<Fragment key={key++}>{remaining.slice(0, nextSpecial)}</Fragment>);
        remaining = remaining.slice(nextSpecial);
      }
    }

    return result;
  };

  const parseBlock = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    const result: React.ReactNode[] = [];
    let currentList: { items: string[]; type: "ul" | "ol" } | null = null;
    let key = 0;

    const flushList = () => {
      if (currentList) {
        const ListTag = currentList.type === "ol" ? "ol" : "ul";
        result.push(
          <ListTag key={key++} className={currentList.type === "ol" ? "list-decimal" : "list-disc"} style={{ marginLeft: "1.25rem" }}>
            {currentList.items.map((item, i) => (
              <li key={i} className="text-sm">{parseInline(item)}</li>
            ))}
          </ListTag>
        );
        currentList = null;
      }
    };

    lines.forEach((line, index) => {
      // Numbered list: 1. item
      const olMatch = line.match(/^\d+\.\s+(.+)$/);
      if (olMatch && olMatch[1]) {
        if (!currentList || currentList.type !== "ol") {
          flushList();
          currentList = { items: [], type: "ol" };
        }
        currentList.items.push(olMatch[1]);
        return;
      }

      // Bullet list: - item or * item
      const ulMatch = line.match(/^[-*]\s+(.+)$/);
      if (ulMatch && ulMatch[1]) {
        if (!currentList || currentList.type !== "ul") {
          flushList();
          currentList = { items: [], type: "ul" };
        }
        currentList.items.push(ulMatch[1]);
        return;
      }

      // Regular line
      flushList();

      if (line.trim() === "") {
        // Empty line - add spacing
        if (index > 0 && index < lines.length - 1) {
          result.push(<div key={key++} className="h-2" />);
        }
      } else {
        result.push(
          <p key={key++} className="text-sm leading-relaxed">
            {parseInline(line)}
          </p>
        );
      }
    });

    flushList();
    return result;
  };

  return <div className={className}>{parseBlock(content)}</div>;
}
