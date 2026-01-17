export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  country: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  budgetTotal?: number;
  currency: string;
  flights: Flight[];
  hotels: Hotel[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export type TripStatus = 
  | 'PLANNING' 
  | 'READY' 
  | 'ONGOING' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Flight {
  id: string;
  tripId: string;
  type: 'OUTBOUND' | 'RETURN' | 'INTERNAL';
  airline: string;
  flightNumber?: string;
  departureAirport: string;
  departureCity: string;
  departureTime: Date;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: Date;
  duration: number;
  price?: number;
  currency: string;
  status: ItemStatus;
}

export interface Hotel {
  id: string;
  tripId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  stars?: number;
  rating?: number;
  imageUrl?: string;
  checkinDate: Date;
  checkoutDate: Date;
  nights: number;
  pricePerNight?: number;
  priceTotal?: number;
  currency: string;
  status: ItemStatus;
}

export interface Activity {
  id: string;
  tripId: string;
  name: string;
  description?: string;
  category: ActivityCategory;
  address?: string;
  latitude?: number;
  longitude?: number;
  date?: Date;
  startTime?: string;
  duration?: number;
  price?: number;
  currency: string;
  imageUrl?: string;
  status: ItemStatus;
}

export type ItemStatus = 
  | 'SUGGESTED' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'BOOKED';

export type ActivityCategory =
  | 'CULTURE'
  | 'NATURE'
  | 'FOOD'
  | 'ADVENTURE'
  | 'RELAXATION'
  | 'NIGHTLIFE'
  | 'SHOPPING'
  | 'TRANSPORT'
  | 'OTHER';