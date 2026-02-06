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
  Train,
  Car,
  Ship,
  type LucideIcon,
} from "lucide-react";
import type { ActivityCategory, LocationType, TransportMode, QuickAction } from "./types";

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

// --- Multi-city data ---

export const TRANSPORT_ICONS: Record<TransportMode, LucideIcon> = {
  plane: Plane,
  train: Train,
  car: Car,
  bus: Bus,
  ferry: Ship,
};

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  plane: "Vol",
  train: "Train",
  car: "Voiture",
  bus: "Bus",
  ferry: "Ferry",
};

export const TRANSPORT_EMOJIS: Record<TransportMode, string> = {
  plane: "✈️",
  train: "🚂",
  car: "🚗",
  bus: "🚌",
  ferry: "⛴️",
};

export const POST_GENERATION_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "cheaper",
    emoji: "💰",
    label: "Moins cher",
    prompt: "Propose-moi des alternatives moins chères pour ce voyage",
  },
  {
    id: "no-flights",
    emoji: "🚫",
    label: "Sans vols",
    prompt: "Refais l'itinéraire sans prendre l'avion",
  },
  {
    id: "add-cities",
    emoji: "🏙️",
    label: "Ajouter villes",
    prompt: "Ajoute une ville supplémentaire à cet itinéraire",
  },
  {
    id: "restaurants",
    emoji: "🍽️",
    label: "Restaurants",
    prompt: "Ajoute des recommandations de restaurants pour chaque ville",
  },
  {
    id: "change-hotel",
    emoji: "🏨",
    label: "Changer hôtel",
    prompt: "Propose-moi d'autres options d'hôtels",
  },
];

export const LOADING_STEPS_CONFIG = [
  { id: "init", label: "Analyse de ton voyage..." },
  { id: "flights", label: "Recherche des vols..." },
  { id: "hotels", label: "Sélection des hôtels..." },
  { id: "activities", label: "Planification des activités..." },
  { id: "optimize", label: "Optimisation de l'itinéraire..." },
];

export const MAP_CONFIG_COMPACT = {
  defaultCenter: [2.3522, 48.8566] as [number, number],
  defaultZoom: 4,
  fitBoundsOptions: {
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
    maxZoom: 14,
  },
};
