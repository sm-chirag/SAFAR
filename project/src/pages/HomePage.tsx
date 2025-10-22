import React, { useState } from 'react';
import { Hotel, Plane, Car, Train, Bus, Gauge } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const bookingCategories = [
    {
      id: 'hotels',
      icon: Hotel,
      title: 'Hotels',
      description: 'Comfortable stays worldwide',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'flights',
      icon: Plane,
      title: 'Flights',
      description: 'Book domestic & international',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'cars',
      icon: Car,
      title: 'Car Rental',
      description: 'Self-drive adventures',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'trains',
      icon: Train,
      title: 'Trains',
      description: 'Convenient rail travel',
      color: 'from-orange-500 to-amber-500',
    },
    {
      id: 'buses',
      icon: Bus,
      title: 'Buses',
      description: 'Budget-friendly routes',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'metro',
      icon: Gauge,
      title: 'Metro',
      description: 'Quick city transport',
      color: 'from-slate-500 to-gray-600',
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    onNavigate(categoryId);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Journey Begins with SAFAR
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Book flights, hotels, trains, buses, car rentals, and metro tickets all in one place.
              Travel smarter, travel better.
            </p>
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-xl"
              >
                Start Your Journey
              </button>
            )}
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What would you like to book?
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our wide range of travel services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="p-8">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                    <div className="mt-6 flex items-center text-blue-600 font-medium">
                      <span>Book Now</span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 px-4 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose SAFAR?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  All-in-One Platform
                </h3>
                <p className="text-gray-300">
                  Book everything you need for your journey in one convenient place
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Best Prices
                </h3>
                <p className="text-gray-300">
                  Compare and get the best deals on all travel services
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-300">
                  Our dedicated team is always here to help you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
};
