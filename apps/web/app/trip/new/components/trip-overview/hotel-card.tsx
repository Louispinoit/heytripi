"use client";

import { Hotel, Star, MessageSquare, Sparkles } from "lucide-react";
import type { HotelSuggestion } from "../../types";

interface HotelCardProps {
  hotel: HotelSuggestion;
  nights?: number;
}

export function HotelCard({ hotel, nights }: HotelCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Hotel className="size-3.5" />
        <span>Hôtel recommandé</span>
      </div>
      <div className="flex gap-3">
        {hotel.imageUrl && (
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="size-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold">{hotel.name}</h4>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs font-medium text-primary">
              {hotel.rating}/10
            </span>
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MessageSquare className="size-2.5" />
              <span>{hotel.reviews.toLocaleString("fr-FR")}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {hotel.pricePerNight}€
              <span className="text-xs font-normal text-muted-foreground">
                /nuit
              </span>
            </p>
            {nights && (
              <p className="text-xs text-muted-foreground">
                Total : {hotel.pricePerNight * nights}€
              </p>
            )}
          </div>
        </div>
      </div>
      {hotel.aiReason && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/5 p-2.5">
          <Sparkles className="mt-0.5 size-3 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {hotel.aiReason}
          </p>
        </div>
      )}
    </div>
  );
}
