import React, { useState, useEffect } from 'react';
import { Train as TrainIcon, Clock, Users, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, Train } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const TrainBooking: React.FC = () => {
  const { user } = useAuth();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingTrain, setBookingTrain] = useState<Train | null>(null);
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trains')
      .select('*')
      .order('departure_time', { ascending: true });

    if (!error && data) {
      setTrains(data);
    }
    setLoading(false);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const diff = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBooking = async () => {
    if (!bookingTrain || !user) return;

    setBookingLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        booking_type: 'train',
        item_id: bookingTrain.id,
        travel_date: travelDate,
        passenger_count: passengers,
        total_price: bookingTrain.price * passengers,
        status: 'confirmed',
        passenger_details: {
          name: passengerName,
          email: passengerEmail,
          phone: passengerPhone,
        },
      });

      if (!error) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingTrain(null);
          resetForm();
        }, 3000);
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const resetForm = () => {
    setTravelDate('');
    setPassengers(1);
    setPassengerName('');
    setPassengerEmail('');
    setPassengerPhone('');
  };

  const filteredTrains = trains.filter(train => {
    const matchesFrom = !fromStation || train.departure_station.toLowerCase().includes(fromStation.toLowerCase());
    const matchesTo = !toStation || train.arrival_station.toLowerCase().includes(toStation.toLowerCase());
    return matchesFrom && matchesTo;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Trains</h1>
          <p className="text-gray-600">Find and book train tickets</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="From station..."
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <input
            type="text"
            placeholder="To station..."
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <div key={train.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mr-4">
                      <TrainIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{train.train_name}</h3>
                      <p className="text-sm text-gray-600">{train.train_number}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">From</p>
                      <p className="font-bold text-lg">{train.departure_station}</p>
                      <p className="text-sm text-gray-600">{formatDateTime(train.departure_time)}</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">
                        {calculateDuration(train.departure_time, train.arrival_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">To</p>
                      <p className="font-bold text-lg">{train.arrival_station}</p>
                      <p className="text-sm text-gray-600">{formatDateTime(train.arrival_time)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-sm rounded-full font-medium capitalize">
                      {train.class_type}
                    </span>
                    <span className="text-sm text-gray-600">
                      {train.available_seats} seats available
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 text-right">
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">₹{train.price.toLocaleString()}</span>
                    <span className="text-gray-600 text-sm block">per person</span>
                  </div>
                  <button
                    onClick={() => setBookingTrain(train)}
                    className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium w-full md:w-auto"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTrains.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No trains found</p>
          </div>
        )}
      </div>

      {bookingTrain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your train ticket has been successfully booked.</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-lg mb-2">{bookingTrain.train_name} - {bookingTrain.train_number}</h3>
                  <p className="text-gray-600 text-sm">
                    {bookingTrain.departure_station} → {bookingTrain.arrival_station}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Users className="w-4 h-4 inline mr-1" />
                      Number of Passengers
                    </label>
                    <input
                      type="number"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                      min="1"
                      max={bookingTrain.available_seats}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Name</label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Email</label>
                    <input
                      type="email"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Phone</label>
                    <input
                      type="tel"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">
                      ₹{(bookingTrain.price * passengers).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setBookingTrain(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || !travelDate || !passengerName || !passengerEmail || !passengerPhone}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
