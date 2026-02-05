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
