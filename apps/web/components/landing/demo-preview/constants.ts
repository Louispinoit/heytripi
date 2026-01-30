import type { ChecklistCategory } from "./types";

// Category type for custom categories
export interface CategoryConfig {
  id: string;
  label: string;
  emoji: string;
  isCustom?: boolean;
}

// Default categories
export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { id: "documents", label: "Documents", emoji: "📄" },
  { id: "luggage", label: "Valise", emoji: "🧳" },
  { id: "health", label: "Santé", emoji: "💊" },
  { id: "tech", label: "Tech", emoji: "🔌" },
];

// Common emojis for picker
export const EMOJI_OPTIONS = [
  "📄", "🧳", "💊", "🔌", "🎒", "📷", "🎫", "💳",
  "🔑", "👕", "👟", "🧴", "🎧", "📱", "💻", "🎮",
  "📚", "✈️", "🏨", "🍽️", "🎭", "⛱️", "🏔️", "🚗"
];

// Keywords for intelligent category detection
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  documents: [
    "passeport", "carte", "billet", "visa", "permis", "assurance", "réservation",
    "identité", "ticket", "voucher", "confirmation", "papier", "document",
    "boarding", "pass", "certificat", "attestation",
  ],
  health: [
    "médicament", "médoc", "crème", "pharmacie", "santé", "médical", "pansement",
    "doliprane", "aspirine", "antiseptique", "pilule", "comprimé", "sirop",
    "thermomètre", "bandage", "désinfectant", "vitamine", "allergie", "ordonnance",
    "trousse", "premiers secours", "spray", "gel", "pommade", "ventoline",
  ],
  tech: [
    "chargeur", "batterie", "téléphone", "câble", "adaptateur", "écouteur",
    "casque", "appareil photo", "caméra", "ordinateur", "tablette", "ipad",
    "iphone", "android", "usb", "powerbank", "gopro", "montre", "watch",
    "kindle", "liseuse", "enceinte", "airpods", "laptop", "macbook",
  ],
  luggage: [
    "vêtement", "chaussure", "sac", "valise", "pantalon", "t-shirt", "short",
    "veste", "maillot", "lunette", "chapeau", "casquette", "serviette",
    "pull", "manteau", "jean", "robe", "jupe", "chemise", "sous-vêtement",
    "chaussette", "sandale", "basket", "pyjama", "écharpe", "gant", "bonnet",
    "parapluie", "sac à dos", "trousse toilette", "brosse", "dentifrice",
    "shampoing", "savon", "déodorant", "rasoir", "parfum", "maquillage",
  ],
};

export function detectCategory(text: string, categories: CategoryConfig[]): string {
  const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let bestMatch: { category: string; score: number } = { category: "luggage", score: 0 };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (!categories.find(c => c.id === category)) continue;

    for (const keyword of keywords) {
      const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalizedText.includes(normalizedKeyword)) {
        const score = normalizedKeyword.length;
        if (score > bestMatch.score) {
          bestMatch = { category, score };
        }
      }
    }
  }

  return bestMatch.category;
}
