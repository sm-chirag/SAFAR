import React, { useState, useEffect } from 'react';
import { Gauge, Clock, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, MetroRoute } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const MetroBooking: React.FC = () => {
  const { user } = useAuth();
  const [metroRoutes, setMetroRoutes] = useState<MetroRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingMetro, setBookingMetro] = useState<MetroRoute | null>(null);
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchMetroRoutes();
  }, []);

  const fetchMetroRoutes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('metro_routes')
      .select('*')
      .order('city', { ascending: true });

    if (!error && data) {
      setMetroRoutes(data);
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!bookingMetro || !user) return;

    setBookingLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        booking_type: 'metro',
        item_id: bookingMetro.id,
        travel_date: travelDate,
        passenger_count: passengers,
        total_price: bookingMetro.price * passengers,
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
          setBookingMetro(null);
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

  const filteredMetroRoutes = searchCity
    ? metroRoutes.filter(metro => metro.city.toLowerCase().includes(searchCity.toLowerCase()))
    : metroRoutes;

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Metro Tickets</h1>
          <p className="text-gray-600">Book metro tickets for quick city travel</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetroRoutes.map((metro) => (
            <div key={metro.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center mr-4">
                  <Gauge className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{metro.line_name}</h3>
                  <p className="text-sm text-gray-600">{metro.city}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">From:</span>
                  <span className="font-semibold">{metro.start_station}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">To:</span>
                  <span className="font-semibold">{metro.end_station}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Duration:
                  </span>
                  <span className="font-semibold">{metro.duration_minutes} mins</span>
                </div>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{metro.price}</span>
                  <span className="text-gray-600 text-sm block">per ticket</span>
                </div>
                <button
                  onClick={() => setBookingMetro(metro)}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMetroRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No metro routes found</p>
          </div>
        )}
      </div>

      {bookingMetro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your metro ticket has been successfully booked.</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-lg mb-2">{bookingMetro.line_name}</h3>
                  <p className="text-gray-600 text-sm">
                    {bookingMetro.start_station} → {bookingMetro.end_station} ({bookingMetro.city})
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
                      Number of Tickets
                    </label>
                    <input
                      type="number"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                      min="1"
                      max="10"
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

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-slate-600">
                      ₹{(bookingMetro.price * passengers).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setBookingMetro(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || !travelDate || !passengerName || !passengerEmail || !passengerPhone}
                    className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
