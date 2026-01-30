import type { LucideIcon } from "lucide-react";

export type PlaceType = "home" | "culture" | "nature" | "food";

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  icon: LucideIcon;
  lng: number;
  lat: number;
  duration?: string;
}

export interface MapAction {
  type: "addPlace";
  placeId: string;
  alsoPush?: string;
}

export interface ChatMessage {
  id: number;
  type: "bot" | "user";
  text: string;
  mapAction: MapAction | null;
}

export interface RouteSegment {
  id: string;
  coords: [number, number][];
}

export type ChecklistCategory = string;

export interface ChecklistItem {
  id: string;
  text: string;
  category: ChecklistCategory;
  isAiGenerated: boolean;
}

// Collab types
export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export type VoteType = "up" | "down" | null;

export interface ActivityVote {
  odavid: VoteType;
  osophie: VoteType;
  othomas: VoteType;
}

export interface CollabActivity {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  votes: ActivityVote;
  comments: CollabComment[];
}

export interface CollabComment {
  id: string;
  participantId: string;
  text: string;
  timestamp: string;
}
