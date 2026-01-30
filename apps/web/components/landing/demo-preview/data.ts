import { Home, Landmark, TreePine, UtensilsCrossed } from "lucide-react";
import type { ChatMessage, ChecklistItem, Place } from "./types";

export const DEMO_PLACES: Place[] = [
  {
    id: "home",
    name: "Ton hôtel",
    type: "home",
    icon: Home,
    lng: 2.1686,
    lat: 41.3874,
  },
  {
    id: "sagrada",
    name: "Sagrada Familia",
    type: "culture",
    icon: Landmark,
    lng: 2.1744,
    lat: 41.4036,
    duration: "25 min",
  },
  {
    id: "guell",
    name: "Park Güell",
    type: "nature",
    icon: TreePine,
    lng: 2.1527,
    lat: 41.4145,
    duration: "35 min",
  },
  {
    id: "boqueria",
    name: "La Boqueria",
    type: "food",
    icon: UtensilsCrossed,
    lng: 2.1718,
    lat: 41.3816,
    duration: "20 min",
  },
];

export const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    type: "bot",
    text: "Hey ! Où veux-tu partir ? Dis-moi tout sur ton voyage idéal !",
    mapAction: null,
  },
  {
    id: 2,
    type: "user",
    text: "Barcelone en mars, 5 jours, budget 800€",
    mapAction: null,
  },
  {
    id: 3,
    type: "bot",
    text: "Super choix ! Je te place dans le quartier Gothic, c'est central et abordable.",
    mapAction: { type: "addPlace", placeId: "home" },
  },
  {
    id: 4,
    type: "user",
    text: "Parfait ! Qu'est-ce que tu me conseilles pour le jour 1 ?",
    mapAction: null,
  },
  {
    id: 5,
    type: "bot",
    text: "Commence par la Sagrada Familia le matin, 25 min à pied de ton hôtel.",
    mapAction: { type: "addPlace", placeId: "sagrada" },
  },
  {
    id: 6,
    type: "user",
    text: "Et après ?",
    mapAction: null,
  },
  {
    id: 7,
    type: "bot",
    text: "Direction Park Güell pour la vue ! Puis La Boqueria pour déjeuner.",
    mapAction: { type: "addPlace", placeId: "guell", alsoPush: "boqueria" },
  },
];

export const MAP_CONFIG = {
  center: [2.164, 41.398] as [number, number],
  zoom: 12.5,
  theme: "light" as const,
};

export const ANIMATION_TIMING = {
  typingDuration: 1200,
  userMessageDelay: 800,
  placeAddDelay: 300,
  botMessagePause: 1400,
  userMessagePause: 1000,
  initialDelay: 600,
  routeDrawDuration: 800,
  checklistItemDelay: 400,
};

export const DEMO_CHECKLIST: ChecklistItem[] = [
  // Documents
  { id: "doc-1", text: "Carte d'identité", category: "documents", isAiGenerated: true },
  { id: "doc-2", text: "Carte européenne d'assurance maladie", category: "documents", isAiGenerated: true },
  // Valise
  { id: "lug-1", text: "Chaussures de marche", category: "luggage", isAiGenerated: true },
  { id: "lug-2", text: "Crème solaire", category: "luggage", isAiGenerated: true },
  // Santé
  { id: "hea-1", text: "Médicaments personnels", category: "health", isAiGenerated: true },
  // Tech
  { id: "tec-1", text: "Chargeur de téléphone", category: "tech", isAiGenerated: true },
  { id: "tec-2", text: "Batterie externe", category: "tech", isAiGenerated: false },
];

export const CHECKLIST_CATEGORIES = {
  documents: { label: "Documents", emoji: "📄" },
  luggage: { label: "Valise", emoji: "🧳" },
  health: { label: "Santé", emoji: "💊" },
  tech: { label: "Tech", emoji: "🔌" },
} as const;
