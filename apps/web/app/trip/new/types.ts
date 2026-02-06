export type LocationType = "destination" | "hotel" | "activity" | "restaurant" | "airport";

export type ActivityCategory =
  | "CULTURE"
  | "NATURE"
  | "FOOD"
  | "ADVENTURE"
  | "RELAXATION"
  | "NIGHTLIFE"
  | "SHOPPING"
  | "TRANSPORT"
  | "OTHER";

export interface WalkingSegment {
  distanceMeters: number;
  durationMinutes: number;
  coordinates: [number, number][];
}

export interface DayActivity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: LocationType;
  category?: ActivityCategory;
  description?: string;
  duration?: number; // Minutes
  startTime?: string; // "09:00"
  price?: number;
  currency?: string;
  imageUrl?: string;
  walkingInfo?: WalkingSegment;
}

export interface TripDay {
  dayNumber: number;
  date?: string; // "2024-03-15"
  activities: DayActivity[];
  totalWalkingMinutes?: number;
  totalWalkingMeters?: number;
}

export interface Itinerary {
  destination: string;
  days: TripDay[];
}

export interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: LocationType;
  description?: string;
  dayNumber?: number;
}

export interface MapRouteData {
  id: string;
  name: string;
  stops: Array<{ name: string; latitude: number; longitude: number }>;
}

// --- Multi-city trip types ---

export type TransportMode = "plane" | "train" | "car" | "bus" | "ferry";

export interface CityTransport {
  mode: TransportMode;
  fromCity: string;
  toCity: string;
  fromIATA?: string;
  toIATA?: string;
  duration?: string;
  price?: number;
}

export interface FlightSuggestion {
  fromIATA: string;
  toIATA: string;
  duration: string;
  stops: number;
  price: number;
  airline?: string;
}

export interface HotelSuggestion {
  name: string;
  stars: number;
  rating: number;
  reviews: number;
  imageUrl?: string;
  pricePerNight: number;
  aiReason?: string;
}

export interface LogisticsSuggestion {
  type: string;
  description: string;
  price?: number;
  duration?: string;
}

export interface TripDayEnhanced extends TripDay {
  title?: string;
  weatherEmoji?: string;
  temperatureHigh?: number;
  cityId?: string;
}

export interface CitySection {
  id: string;
  cityName: string;
  description?: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  startDate?: string;
  endDate?: string;
  flight?: FlightSuggestion;
  hotel?: HotelSuggestion;
  logistics: LogisticsSuggestion[];
  days: TripDayEnhanced[];
}

export interface MultiCityItinerary {
  tripName: string;
  originCity: string;
  cities: CitySection[];
  transports: CityTransport[];
  totalBudget?: number;
}

export type TripPhase = "chatting" | "building" | "viewing";

export interface LoadingStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
}

export interface QuickAction {
  id: string;
  emoji: string;
  label: string;
  prompt: string;
}
