import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import axios from 'axios';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import TicketSelectionModal from '../components/TicketSelectionModal';

// Import or recreate the ImageCarousel component
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Event image ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImageIndex 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const EventDetails = () => {
  const { eventId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketTiers, setTicketTiers] = useState<any[]>([]);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        const response = await axios.get(
          `${API_URL}/api/events/${eventId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setEvent(response.data);
        setTicketTiers(response.data.ticketTiers);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, token]);

  const handlePaymentSuccess = async (ticketTierId: string, quantity: number) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      const response = await axios.post(
        `${API_URL}/api/bookticket/${eventId}`,
        {
          userId: event.userId,
          ticketTierId,
          quantity
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Booking successful! Redirecting to your profile...');
        navigate('/profile');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to book ticket');
    }
  };

  const handleTicketSelect = (ticketTierId: string, quantity: number) => {
    const tier = ticketTiers.find(t => t._id === ticketTierId);
    if (tier) {
      setSelectedTier(tier);
      setSelectedQuantity(quantity);
      setShowTicketSelection(false);
      setIsModalOpen(true);
    }
  };

  // Add this helper function to collect all available images
  const getEventImages = (event: any): string[] => {
    const images = [event.image];
    if (event.image1) images.push(event.image1);
    if (event.image2) images.push(event.image2);
    return images;
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
    </div>;
  }

  if (error || !event) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
      {error || 'Event not found'}
    </div>;
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 lg:px-[10%]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 space-y-8">
          {event && <ImageCarousel images={getEventImages(event)} />}
          <h1 className="text-3xl font-bold break-words">{event.title}</h1>
          
          <div className="grid md:grid-cols-3 gap-12 mt-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About Event</h2>
                <p className="text-gray-400 break-words overflow-hidden text-ellipsis">{event.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 mr-3 text-purple-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                  <span>{event.location}, {event.city}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Type</label>
                    <p className="text-white">{event.type}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Genre</label>
                    <p className="text-white">{event.genere}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Capacity</label>
                    <p className="text-white">{event.capacity} people</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-2">Available Ticket Tiers</h3>
                    <div className="space-y-2">
                      {ticketTiers.map((tier: any) => (
                        <div key={tier._id} className="flex justify-between items-center text-white">
                          <span>{tier.name}</span>
                          <span>₹{tier.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTicketSelection(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Select Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTicketSelection && (
        <TicketSelectionModal
          isOpen={showTicketSelection}
          onClose={() => setShowTicketSelection(false)}
          ticketTiers={ticketTiers}
          onConfirm={handleTicketSelect}
        />
      )}

      {isModalOpen && (
        <PaymentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventId={eventId}
          selectedTier={selectedTier}
          quantity={selectedQuantity}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default EventDetails;
