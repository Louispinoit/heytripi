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

export const maxDuration = 60;

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

## CRITIQUE - Workflow de planification multi-villes

### ÉTAPE 1 : initTrip (OBLIGATOIRE - toujours en premier)
Quand l'utilisateur demande de planifier un voyage, tu DOIS d'abord appeler initTrip avec :
- tripName: nom du voyage
- originCity: ville de départ
- cities: liste des villes à visiter (nom, lat, lng, dates, nombre de jours)
- transports: mode de transport entre chaque ville

Déclencheurs :
- "Planifie-moi un voyage..."
- "Road trip Italie Portugal"
- "2 semaines à Barcelone et Madrid"
- "Organise mon voyage"
- Toute demande de planification multi-jours

### ÉTAPE 2 : planCityOverview (pour CHAQUE ville)
Après initTrip, appelle planCityOverview pour chaque ville avec :
- cityId: identifiant unique (ex: "barcelona", "lisbon")
- cityName: nom de la ville
- description: 2-3 phrases sur la ville
- imageUrls: 3 URLs d'images (utilise des URLs Unsplash avec le format https://images.unsplash.com/photo-XXXX?w=800)
- flight: suggestion de vol (IATA codes, durée, prix)
- hotel: suggestion d'hôtel (nom, étoiles, rating, prix)
- logistics: conseils logistiques (transport local, etc.)

### ÉTAPE 3 : planDayItinerary (pour CHAQUE jour de CHAQUE ville)
Ensuite appelle planDayItinerary pour chaque jour avec les champs enrichis :
- dayNumber, destination, activities (comme avant)
- PLUS : dayTitle (titre poétique du jour), weatherEmoji, temperatureHigh, cityId

### RÈGLE ABSOLUE
Pour une planification complète : initTrip → planCityOverview × N → planDayItinerary × N
NE PAS juste décrire en texte - APPELLE LES OUTILS dans l'ordre.
Entre chaque étape, tu peux ajouter un court message pour informer l'utilisateur de ta progression.

### showOnMap (usage limité)
UNIQUEMENT pour ajouter UN SEUL lieu quand l'utilisateur dit :
- "Montre-moi [lieu]"
- "Où est [lieu] ?"

### Coordonnées GPS
Utilise des coordonnées GPS précises pour toutes les villes et activités.

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
  initTrip: tool({
    description:
      "Initialise un voyage multi-villes. TOUJOURS appeler en premier quand l'utilisateur demande de planifier un voyage.",
    inputSchema: z.object({
      tripName: z.string().describe("Nom du voyage (ex: Road trip Italie-Portugal)"),
      originCity: z.string().describe("Ville de départ de l'utilisateur (ex: Paris)"),
      cities: z
        .array(
          z.object({
            id: z.string().describe("ID unique de la ville (ex: barcelona)"),
            name: z.string().describe("Nom de la ville"),
            latitude: z.number().describe("Latitude"),
            longitude: z.number().describe("Longitude"),
            startDate: z.string().optional().describe("Date de début (YYYY-MM-DD)"),
            endDate: z.string().optional().describe("Date de fin (YYYY-MM-DD)"),
            nights: z.number().describe("Nombre de nuits"),
          })
        )
        .describe("Liste des villes à visiter dans l'ordre"),
      transports: z
        .array(
          z.object({
            mode: z.enum(["plane", "train", "car", "bus", "ferry"]).describe("Mode de transport"),
            fromCity: z.string().describe("Ville de départ"),
            toCity: z.string().describe("Ville d'arrivée"),
            fromIATA: z.string().optional().describe("Code IATA départ"),
            toIATA: z.string().optional().describe("Code IATA arrivée"),
            duration: z.string().optional().describe("Durée du trajet (ex: 2h30)"),
            price: z.number().optional().describe("Prix estimé en euros"),
          })
        )
        .describe("Transports entre les villes"),
      totalBudget: z.number().optional().describe("Budget total estimé en euros"),
    }),
    execute: async ({ tripName, originCity, cities, transports, totalBudget }) => {
      return {
        success: true,
        message: `Voyage "${tripName}" initialisé : ${cities.length} villes au programme !`,
        trip: { tripName, originCity, cities, transports, totalBudget },
      };
    },
  }),
  planCityOverview: tool({
    description:
      "Planifie l'aperçu d'une ville : description, vol, hôtel, logistique. Appeler après initTrip pour chaque ville.",
    inputSchema: z.object({
      cityId: z.string().describe("ID de la ville (doit correspondre à l'ID dans initTrip)"),
      cityName: z.string().describe("Nom de la ville"),
      description: z.string().describe("Description de la ville (2-3 phrases)"),
      imageUrls: z
        .array(z.string())
        .describe("3 URLs d'images de la ville (Unsplash)"),
      flight: z
        .object({
          fromIATA: z.string().describe("Code IATA départ"),
          toIATA: z.string().describe("Code IATA arrivée"),
          duration: z.string().describe("Durée du vol (ex: 2h15)"),
          stops: z.number().describe("Nombre d'escales (0 = direct)"),
          price: z.number().describe("Prix en euros"),
          airline: z.string().optional().describe("Compagnie aérienne"),
        })
        .optional()
        .describe("Suggestion de vol (si pertinent)"),
      hotel: z
        .object({
          name: z.string().describe("Nom de l'hôtel"),
          stars: z.number().describe("Nombre d'étoiles (1-5)"),
          rating: z.number().describe("Note (ex: 8.7)"),
          reviews: z.number().describe("Nombre d'avis"),
          imageUrl: z.string().optional().describe("URL image hôtel"),
          pricePerNight: z.number().describe("Prix par nuit en euros"),
          aiReason: z.string().optional().describe("Pourquoi Tripy recommande cet hôtel"),
        })
        .optional()
        .describe("Suggestion d'hôtel"),
      logistics: z
        .array(
          z.object({
            type: z.string().describe("Type (ex: Metro, Bus, Taxi)"),
            description: z.string().describe("Description du conseil"),
            price: z.number().optional().describe("Prix estimé"),
            duration: z.string().optional().describe("Durée"),
          })
        )
        .optional()
        .describe("Conseils logistiques"),
    }),
    execute: async ({ cityId, cityName, description, imageUrls, flight, hotel, logistics }) => {
      return {
        success: true,
        message: `Aperçu de ${cityName} planifié`,
        cityOverview: { cityId, cityName, description, imageUrls, flight, hotel, logistics },
      };
    },
  }),
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
      "Planifie un itinéraire complet pour un jour donné avec plusieurs activités. Utilise cet outil pour chaque jour de chaque ville.",
    inputSchema: z.object({
      dayNumber: z.number().describe("Numéro du jour (1, 2, 3...)"),
      destination: z.string().describe("Nom de la ville/destination"),
      dayTitle: z.string().optional().describe("Titre poétique du jour (ex: Balade dans le Barri Gòtic)"),
      weatherEmoji: z.string().optional().describe("Emoji météo (ex: ☀️, 🌤️, 🌧️)"),
      temperatureHigh: z.number().optional().describe("Température max prévue en °C"),
      cityId: z.string().optional().describe("ID de la ville (correspondant à initTrip)"),
      activities: z.array(activitySchema).describe("Liste des activités du jour, ordonnées chronologiquement"),
    }),
    execute: async ({ dayNumber, destination, dayTitle, weatherEmoji, temperatureHigh, cityId, activities }) => {
      return {
        success: true,
        message: `Jour ${dayNumber} à ${destination} planifié avec ${activities.length} activités`,
        day: { dayNumber, destination, dayTitle, weatherEmoji, temperatureHigh, cityId, activities },
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
    model: groq("moonshotai/kimi-k2-instruct-0905"),
    system: TRIPY_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(15),
  });

  return result.toUIMessageStreamResponse();
}
