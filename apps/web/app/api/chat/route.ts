import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
  type UIMessage,
  type ToolSet,
  type InferUITools,
  type UIDataTypes,
} from "ai";
import { z } from "zod";

export const maxDuration = 30;

const TRIPY_SYSTEM_PROMPT = `Tu es Tripy, l'assistant voyage intelligent de HeyTripy. Tu aides les utilisateurs à planifier leurs voyages de manière conversationnelle et amicale.

## Ta personnalité
- Tu tutoies toujours l'utilisateur
- Tu es enthousiaste, chaleureux et positif
- Tu es concis dans tes réponses (évite les pavés de texte)
- Tu utilises des emojis avec parcimonie (1-2 max par message)
- Tu es expert en voyage mais accessible

## Ton rôle
- Aider à choisir une destination selon les envies, le budget et les dates
- Suggérer des activités, restaurants et expériences locales
- Donner des conseils pratiques (visa, météo, devise, coutumes)
- Proposer des itinéraires jour par jour
- Aider à trouver des vols et hôtels adaptés

## CRITIQUE - Utilisation des outils

### RÈGLE ABSOLUE
Quand on te demande de planifier des jours de voyage, tu DOIS utiliser l'outil planDayItinerary.
NE PAS juste décrire les activités en texte - APPELLE L'OUTIL pour chaque jour.

### planDayItinerary (OBLIGATOIRE pour les itinéraires)
Déclencheurs :
- "Planifie-moi X jours à [ville]"
- "Que faire à [ville] ?"
- "Organise mon voyage"
- "Donne-moi un itinéraire"
- Toute demande d'activités sur plusieurs jours

Tu DOIS appeler planDayItinerary pour CHAQUE jour avec :
- dayNumber: numéro du jour (1, 2, 3...)
- destination: "Barcelone" (la ville)
- activities: TABLEAU de 4-5 objets avec TOUTES les propriétés :
  {
    name: "Nom du lieu",
    latitude: coordonnée (ex: 41.4036),
    longitude: coordonnée (ex: 2.1744),
    type: "activity",
    description: "Description courte",
    duration: durée en minutes (ex: 120),
    startTime: "09:00",
    price: prix en euros (ex: 26),
    category: "CULTURE" | "NATURE" | "FOOD" | etc.
  }

### showOnMap (usage limité)
UNIQUEMENT pour ajouter UN SEUL lieu quand l'utilisateur dit :
- "Montre-moi [lieu]"
- "Où est [lieu] ?"

### Coordonnées GPS (OBLIGATOIRES)
Barcelone :
- Sagrada Familia: lat 41.4036, lng 2.1744
- Park Güell: lat 41.4145, lng 2.1527
- La Rambla: lat 41.3797, lng 2.1746
- Casa Batlló: lat 41.3916, lng 2.1649
- Barceloneta Beach: lat 41.3784, lng 2.1925
- Camp Nou: lat 41.3809, lng 2.1228
- Gothic Quarter: lat 41.3833, lng 2.1777
- La Boqueria: lat 41.3816, lng 2.1718
- Montjuïc: lat 41.3636, lng 2.1586
- Picasso Museum: lat 41.3853, lng 2.1806

Paris :
- Tour Eiffel: lat 48.8584, lng 2.2945
- Louvre: lat 48.8606, lng 2.3376
- Notre-Dame: lat 48.8530, lng 2.3499
- Montmartre: lat 48.8867, lng 2.3431
- Champs-Élysées: lat 48.8698, lng 2.3078

## Comment tu réponds
- Pose des questions pour mieux comprendre les besoins
- Propose 2-3 options quand c'est pertinent
- Donne des informations concrètes et utiles
- Si tu ne connais pas quelque chose, dis-le honnêtement

## Exemples de style
- "Super choix ! Barcelone est magnifique en mai 🌞"
- "Tu préfères plutôt plage ou culture ?"
- "Je te prépare ça tout de suite !"

## Langue
- Tu parles français par défaut
- Tu peux passer à l'anglais si l'utilisateur écrit en anglais`;

const activitySchema = z.object({
  name: z.string().describe("Nom du lieu (ex: Sagrada Familia)"),
  latitude: z.number().describe("Latitude du lieu"),
  longitude: z.number().describe("Longitude du lieu"),
  type: z
    .enum(["destination", "hotel", "activity", "restaurant", "airport"])
    .describe("Type de lieu"),
  description: z.string().optional().describe("Description courte du lieu"),
  duration: z.number().optional().describe("Durée de visite en minutes (ex: 120 pour 2h)"),
  startTime: z.string().optional().describe("Heure de début suggérée (format HH:MM, ex: 09:00)"),
  price: z.number().optional().describe("Prix en euros (ex: 26)"),
  category: z
    .enum(["CULTURE", "NATURE", "FOOD", "ADVENTURE", "RELAXATION", "NIGHTLIFE", "SHOPPING", "TRANSPORT", "OTHER"])
    .optional()
    .describe("Catégorie d'activité"),
});

const tools = {
  showOnMap: tool({
    description:
      "Affiche un lieu sur la carte. Utilise cet outil chaque fois qu'une destination, ville, ou point d'intérêt est mentionné.",
    inputSchema: z.object({
      name: z.string().describe("Nom du lieu (ex: Paris, Tour Eiffel)"),
      latitude: z.number().describe("Latitude du lieu"),
      longitude: z.number().describe("Longitude du lieu"),
      type: z
        .enum(["destination", "hotel", "activity", "restaurant", "airport"])
        .describe("Type de lieu"),
      description: z.string().optional().describe("Description courte du lieu"),
      dayNumber: z.number().optional().describe("Numéro du jour dans l'itinéraire (1, 2, 3...)"),
      duration: z.number().optional().describe("Durée de visite en minutes (ex: 120 pour 2h)"),
      startTime: z.string().optional().describe("Heure de début suggérée (format HH:MM, ex: 09:00)"),
      price: z.number().optional().describe("Prix en euros (ex: 26)"),
      category: z
        .enum(["CULTURE", "NATURE", "FOOD", "ADVENTURE", "RELAXATION", "NIGHTLIFE", "SHOPPING", "TRANSPORT", "OTHER"])
        .optional()
        .describe("Catégorie d'activité"),
    }),
    execute: async ({ name, latitude, longitude, type, description, dayNumber, duration, startTime, price, category }) => {
      return {
        success: true,
        message: `${name} ajouté à la carte${dayNumber ? ` (Jour ${dayNumber})` : ""}`,
        location: { name, latitude, longitude, type, description, dayNumber, duration, startTime, price, category },
      };
    },
  }),
  planDayItinerary: tool({
    description:
      "Planifie un itinéraire complet pour un jour donné avec plusieurs activités. Utilise cet outil quand l'utilisateur demande de planifier un jour ou plusieurs jours.",
    inputSchema: z.object({
      dayNumber: z.number().describe("Numéro du jour (1, 2, 3...)"),
      destination: z.string().describe("Nom de la ville/destination"),
      activities: z.array(activitySchema).describe("Liste des activités du jour, ordonnées chronologiquement"),
    }),
    execute: async ({ dayNumber, destination, activities }) => {
      return {
        success: true,
        message: `Jour ${dayNumber} à ${destination} planifié avec ${activities.length} activités`,
        day: { dayNumber, destination, activities },
      };
    },
  }),
  addRoute: tool({
    description:
      "Affiche un itinéraire entre plusieurs villes sur la carte. Utilise cet outil quand tu proposes un roadtrip ou un trajet.",
    inputSchema: z.object({
      name: z.string().describe("Nom de l'itinéraire (ex: Roadtrip Côte d'Azur)"),
      stops: z
        .array(
          z.object({
            name: z.string(),
            latitude: z.number(),
            longitude: z.number(),
          })
        )
        .describe("Liste des étapes de l'itinéraire"),
    }),
    execute: async ({ name, stops }) => {
      return {
        success: true,
        message: `Itinéraire "${name}" avec ${stops.length} étapes ajouté`,
        route: { name, stops },
      };
    },
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: TRIPY_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
