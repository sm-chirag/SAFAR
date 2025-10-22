/*
  # SAFAR Travel Planner Database Schema

  ## Overview
  Complete database schema for SAFAR travel planning platform with authentication and multi-modal booking system.

  ## New Tables Created

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, FK to auth.users)
  - `email` (text)
  - `full_name` (text)
  - `phone` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `hotels`
  Hotel listings for booking
  - `id` (uuid, primary key)
  - `name` (text)
  - `location` (text)
  - `city` (text)
  - `description` (text)
  - `price_per_night` (numeric)
  - `rating` (numeric)
  - `amenities` (text array)
  - `image_url` (text)
  - `available_rooms` (integer)
  - `created_at` (timestamptz)

  ### 3. `flights`
  Flight listings for booking
  - `id` (uuid, primary key)
  - `airline` (text)
  - `flight_number` (text)
  - `departure_city` (text)
  - `arrival_city` (text)
  - `departure_time` (timestamptz)
  - `arrival_time` (timestamptz)
  - `price` (numeric)
  - `available_seats` (integer)
  - `class_type` (text) - economy, business, first
  - `created_at` (timestamptz)

  ### 4. `cars`
  Car rental options
  - `id` (uuid, primary key)
  - `model` (text)
  - `brand` (text)
  - `location` (text)
  - `city` (text)
  - `price_per_day` (numeric)
  - `available` (boolean)
  - `features` (text array)
  - `image_url` (text)
  - `created_at` (timestamptz)

  ### 5. `trains`
  Train listings
  - `id` (uuid, primary key)
  - `train_name` (text)
  - `train_number` (text)
  - `departure_station` (text)
  - `arrival_station` (text)
  - `departure_time` (timestamptz)
  - `arrival_time` (timestamptz)
  - `price` (numeric)
  - `available_seats` (integer)
  - `class_type` (text) - sleeper, AC, general
  - `created_at` (timestamptz)

  ### 6. `buses`
  Bus service listings
  - `id` (uuid, primary key)
  - `operator` (text)
  - `bus_number` (text)
  - `departure_city` (text)
  - `arrival_city` (text)
  - `departure_time` (timestamptz)
  - `arrival_time` (timestamptz)
  - `price` (numeric)
  - `available_seats` (integer)
  - `bus_type` (text) - AC, non-AC, sleeper
  - `created_at` (timestamptz)

  ### 7. `metro_routes`
  Metro route information
  - `id` (uuid, primary key)
  - `city` (text)
  - `line_name` (text)
  - `start_station` (text)
  - `end_station` (text)
  - `price` (numeric)
  - `duration_minutes` (integer)
  - `created_at` (timestamptz)

  ### 8. `bookings`
  Universal bookings table for all transport types
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `booking_type` (text) - hotel, flight, car, train, bus, metro
  - `booking_reference` (text, unique)
  - `item_id` (uuid) - references the specific booking item
  - `booking_date` (timestamptz)
  - `travel_date` (timestamptz)
  - `return_date` (timestamptz, nullable)
  - `passenger_count` (integer)
  - `total_price` (numeric)
  - `status` (text) - confirmed, pending, cancelled
  - `passenger_details` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only read public travel data (hotels, flights, etc.)
  - Users can only manage their own profiles and bookings
  - Authenticated access required for all booking operations

  ## Important Notes
  1. All price fields use numeric type for precision
  2. Timestamps use timestamptz for timezone awareness
  3. JSONB used for flexible passenger details storage
  4. Booking reference auto-generated for tracking
  5. All tables have created_at timestamps
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  description text,
  price_per_night numeric NOT NULL DEFAULT 0,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  amenities text[] DEFAULT '{}',
  image_url text,
  available_rooms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hotels"
  ON hotels FOR SELECT
  TO authenticated
  USING (true);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airline text NOT NULL,
  flight_number text NOT NULL,
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  available_seats integer DEFAULT 0,
  class_type text DEFAULT 'economy',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flights"
  ON flights FOR SELECT
  TO authenticated
  USING (true);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL,
  brand text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  price_per_day numeric NOT NULL DEFAULT 0,
  available boolean DEFAULT true,
  features text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cars"
  ON cars FOR SELECT
  TO authenticated
  USING (true);

-- Create trains table
CREATE TABLE IF NOT EXISTS trains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_name text NOT NULL,
  train_number text NOT NULL,
  departure_station text NOT NULL,
  arrival_station text NOT NULL,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  available_seats integer DEFAULT 0,
  class_type text DEFAULT 'sleeper',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trains"
  ON trains FOR SELECT
  TO authenticated
  USING (true);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator text NOT NULL,
  bus_number text NOT NULL,
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  available_seats integer DEFAULT 0,
  bus_type text DEFAULT 'AC',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view buses"
  ON buses FOR SELECT
  TO authenticated
  USING (true);

-- Create metro_routes table
CREATE TABLE IF NOT EXISTS metro_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  line_name text NOT NULL,
  start_station text NOT NULL,
  end_station text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE metro_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view metro routes"
  ON metro_routes FOR SELECT
  TO authenticated
  USING (true);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_type text NOT NULL,
  booking_reference text UNIQUE NOT NULL DEFAULT concat('SAFAR-', upper(substring(gen_random_uuid()::text, 1, 8))),
  item_id uuid NOT NULL,
  booking_date timestamptz DEFAULT now(),
  travel_date timestamptz NOT NULL,
  return_date timestamptz,
  passenger_count integer DEFAULT 1,
  total_price numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'confirmed',
  passenger_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_flights_departure_city ON flights(departure_city);
CREATE INDEX IF NOT EXISTS idx_flights_arrival_city ON flights(arrival_city);
CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city);
CREATE INDEX IF NOT EXISTS idx_trains_departure_station ON trains(departure_station);
CREATE INDEX IF NOT EXISTS idx_buses_departure_city ON buses(departure_city);
CREATE INDEX IF NOT EXISTS idx_metro_city ON metro_routes(city);