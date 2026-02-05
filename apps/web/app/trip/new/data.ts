import {
  MapPin,
  Hotel,
  Camera,
  UtensilsCrossed,
  Plane,
  Landmark,
  TreePine,
  Waves,
  Mountain,
  ShoppingBag,
  PartyPopper,
  Bus,
  type LucideIcon,
} from "lucide-react";
import type { ActivityCategory, LocationType } from "./types";

export const MARKER_COLORS: Record<LocationType, string> = {
  destination: "bg-primary",
  hotel: "bg-blue-500",
  activity: "bg-green-500",
  restaurant: "bg-orange-500",
  airport: "bg-purple-500",
};

export const MARKER_COLORS_HEX: Record<LocationType, string> = {
  destination: "#14B8A6",
  hotel: "#3B82F6",
  activity: "#22C55E",
  restaurant: "#F97316",
  airport: "#A855F7",
};

export const CATEGORY_ICONS: Record<ActivityCategory, LucideIcon> = {
  CULTURE: Landmark,
  NATURE: TreePine,
  FOOD: UtensilsCrossed,
  ADVENTURE: Mountain,
  RELAXATION: Waves,
  NIGHTLIFE: PartyPopper,
  SHOPPING: ShoppingBag,
  TRANSPORT: Bus,
  OTHER: Camera,
};

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  CULTURE: "bg-amber-500",
  NATURE: "bg-emerald-500",
  FOOD: "bg-orange-500",
  ADVENTURE: "bg-red-500",
  RELAXATION: "bg-cyan-500",
  NIGHTLIFE: "bg-purple-500",
  SHOPPING: "bg-pink-500",
  TRANSPORT: "bg-slate-500",
  OTHER: "bg-gray-500",
};

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  CULTURE: "Culture",
  NATURE: "Nature",
  FOOD: "Gastronomie",
  ADVENTURE: "Aventure",
  RELAXATION: "Détente",
  NIGHTLIFE: "Vie nocturne",
  SHOPPING: "Shopping",
  TRANSPORT: "Transport",
  OTHER: "Autre",
};

export const TYPE_ICONS: Record<LocationType, LucideIcon> = {
  destination: MapPin,
  hotel: Hotel,
  activity: Camera,
  restaurant: UtensilsCrossed,
  airport: Plane,
};

export const ROUTE_COLOR = "#F97316";
export const ROUTE_WIDTH = 4;
export const ROUTE_OPACITY = 0.9;

export const MAP_CONFIG = {
  defaultCenter: [2.3522, 48.8566] as [number, number],
  defaultZoom: 4,
  fitBoundsOptions: {
    padding: { top: 100, bottom: 50, left: 50, right: 350 },
    maxZoom: 16,
  },
};

export const ANIMATION_TIMING = {
  routeDrawDuration: 800,
  markerAppearDelay: 200,
  panelTransitionDuration: 300,
};
