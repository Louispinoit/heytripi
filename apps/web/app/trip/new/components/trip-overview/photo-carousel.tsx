"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoCarouselProps {
  imageUrls: string[];
  cityName: string;
}

export function PhotoCarousel({ imageUrls, cityName }: PhotoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (imageUrls.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 260;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="group relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide"
      >
        {imageUrls.map((url, i) => (
          <div
            key={i}
            className="h-32 w-56 shrink-0 overflow-hidden rounded-xl bg-muted"
          >
            <img
              src={url}
              alt={`${cityName} ${i + 1}`}
              className="size-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {imageUrls.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 z-10 size-7 -translate-y-1/2 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 z-10 size-7 -translate-y-1/2 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}
