import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  description?: string;
  price_per_night: number;
  rating: number;
  amenities: string[];
  image_url?: string;
  available_rooms: number;
}

export interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  class_type: string;
}

export interface Car {
  id: string;
  model: string;
  brand: string;
  location: string;
  city: string;
  price_per_day: number;
  available: boolean;
  features: string[];
  image_url?: string;
}

export interface Train {
  id: string;
  train_name: string;
  train_number: string;
  departure_station: string;
  arrival_station: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  class_type: string;
}

export interface Bus {
  id: string;
  operator: string;
  bus_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  bus_type: string;
}

export interface MetroRoute {
  id: string;
  city: string;
  line_name: string;
  start_station: string;
  end_station: string;
  price: number;
  duration_minutes: number;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: string;
  booking_reference: string;
  item_id: string;
  booking_date: string;
  travel_date: string;
  return_date?: string;
  passenger_count: number;
  total_price: number;
  status: string;
  passenger_details: any;
  created_at: string;
  updated_at: string;
}
