import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, Users, CreditCard, MapPin, X } from 'lucide-react';
import { supabase, Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (!error) {
      await fetchBookings();
    }
    setCancellingId(null);
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return '🏨';
      case 'flight':
        return '✈️';
      case 'car':
        return '🚗';
      case 'train':
        return '🚆';
      case 'bus':
        return '🚌';
      case 'metro':
        return '🚇';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredBookings = filterType === 'all'
    ? bookings
    : bookings.filter(b => b.booking_type === filterType);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">View and manage all your travel bookings</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {['all', 'hotel', 'flight', 'car', 'train', 'bus', 'metro'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-lg font-medium transition capitalize ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type === 'all' ? 'All Bookings' : type}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-gray-600 text-lg">No bookings found</p>
            <p className="text-gray-500 mt-2">Start booking your next adventure!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">{getBookingIcon(booking.booking_type)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 capitalize">
                        {booking.booking_type} Booking
                      </h3>
                      <p className="text-sm text-gray-600">{booking.booking_reference}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">Travel Date: </span>
                      {formatDate(booking.travel_date)}
                      {booking.return_date && (
                        <>
                          <br />
                          <span className="font-medium">Return Date: </span>
                          {formatDate(booking.return_date)}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <span>
                      <span className="font-medium">Passengers: </span>
                      {booking.passenger_count}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                    <span>
                      <span className="font-medium">Total: </span>
                      ₹{booking.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    View Details
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === booking.id ? (
                        <>
                          <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Booking'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-3">{getBookingIcon(selectedBooking.booking_type)}</span>
                  <div>
                    <h3 className="text-xl font-bold capitalize">{selectedBooking.booking_type} Booking</h3>
                    <p className="text-gray-600">{selectedBooking.booking_reference}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booked On</p>
                  <p className="font-medium">{formatDate(selectedBooking.booking_date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Travel Date</p>
                  <p className="font-medium">{formatDate(selectedBooking.travel_date)}</p>
                </div>
                {selectedBooking.return_date && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Return Date</p>
                    <p className="font-medium">{formatDate(selectedBooking.return_date)}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Passengers</p>
                  <p className="font-medium">{selectedBooking.passenger_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="font-bold text-xl text-blue-600">
                    ₹{selectedBooking.total_price.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedBooking.passenger_details && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Passenger Details</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">
                      {selectedBooking.passenger_details.name || 'N/A'}
                    </p>
                    {selectedBooking.passenger_details.email && (
                      <p className="text-gray-600 text-sm mt-1">
                        {selectedBooking.passenger_details.email}
                      </p>
                    )}
                    {selectedBooking.passenger_details.phone && (
                      <p className="text-gray-600 text-sm">
                        {selectedBooking.passenger_details.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
