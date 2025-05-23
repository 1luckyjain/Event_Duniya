import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';
import { useNavigate } from 'react-router-dom';
import TicketSelectionModal from '../components/TicketSelectionModal';
import { IEvent } from './createEvent';

// Add new ImageCarousel component
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
    <div className="relative aspect-video overflow-hidden rounded-t-2xl">
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

function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [bookedEvents, setBookedEvents] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [ticketTiers, setTicketTiers] = useState<ITicketTier[]>([]);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [API_URL]);

  useEffect(() => {
    if (user?._id && token) {
      fetchUserBookedEvents();
    }
  }, [user?._id, token]);

  const fetchUserBookedEvents = async () => {
    if (!user?._id) return;
    
    try {
      const response = await axios.get(
        `${API_URL}/api/bookings/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const bookings = response.data;
      setBookedEvents(bookings.map((booking: any) => booking.event._id));
    } catch (error) {
      console.error('Error fetching booked events:', error);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleBookTicket = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent click handler
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch ticket tiers for the selected event
    const event = events.find(e => e._id === eventId);
    if (event) {
      setSelectedEventId(eventId);
      setTicketTiers(event.ticketTiers); // Ensure ticket tiers are set
      setShowTicketSelection(true);
    }
  };

  const handlePaymentSuccess = async (ticketTierId: string, quantity: number) => {
    if (!selectedEventId || !user?._id) {
      console.error('Missing eventId or userId');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/bookticket/${selectedEventId}`,
        {
          userId: user._id,
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
        setBookedEvents(prev => [...prev, selectedEventId]);
        // Show success message
        alert('Booking successful! Redirecting to your profile...');
        // Navigate to profile page
        navigate('/profile');
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsModalOpen(false);
      setSelectedEventId(null);
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

  // Add this helper function to collect all available images from an event
  const getEventImages = (event: any): string[] => {
    const images = [event.image];
    
    // Add additional images if they exist
    if (event.image1) images.push(event.image1);
    if (event.image2) images.push(event.image2);
    
    return images;
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Payment Modal */}
      {isModalOpen && selectedEventId && (
        <PaymentModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEventId(null);
            setSelectedTier(null);
          }}
          eventId={selectedEventId}
          selectedTier={selectedTier}
          quantity={selectedQuantity}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      {showTicketSelection && (
        <TicketSelectionModal
          isOpen={showTicketSelection}
          onClose={() => setShowTicketSelection(false)}
          ticketTiers={ticketTiers}
          onConfirm={handleTicketSelect}
        />
      )}

      {/* Hero Section */}
      <section className="relative py-6 md:py-14 bg-gradient-to-b from-purple-900/30 to-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Upcoming Experiences
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Immerse yourself in unforgettable moments of art and culture
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              
          <div
              key="bollyverse-2025"
              onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      window.open(
                        "https://forms.gle/z4NK7Nn1YNNSEq3r6",
                        "_blank"
                      );}}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl min-h-[450px] flex flex-col"
            >
              <ImageCarousel
                images={[
                  "/mani2.jpg", // Replace with actual image URLs
                  "mani1.jpg",
                  "/mani3.jpg",
                ]}
              />
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h3 className="text-xl font-semibold mb-1">SUKOON</h3>
                <p className="text-gray-400 mb-2 line-clamp-2">
                An Exlusive Rooftop Affair - a rooftop DJ party like no other.
                </p>

                {/* Event details */}
                <div className="mb-3 text-gray-300">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>June 6th, Friday</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span>Merlot & Co, Jaipur
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span>7:00 PM - 12:00 Midnight
                    </span>
                  </div>
                </div>

                {/* Show ticket tiers */}
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-1">
                    🎟️ EARLY BIRD TICKETS:
                  </p>
                  <div className="text-sm flex justify-between text-gray-300">
                    <span>Female Stag</span>
                    <span>₹749</span>
                  </div>
                  <div className="text-sm flex justify-between text-gray-300">
                    <span>Male Stag</span>
                    <span>₹749</span>
                  </div>
                  <div className="text-sm flex justify-between text-gray-300">
                    <span>Couple Pass</span>
                    <span>₹1299</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-purple-500 font-semibold">
                    {/* From ₹400 */}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      window.open(
                        "https://forms.gle/z4NK7Nn1YNNSEq3r6",
                        "_blank"
                      );
                    }}
                    className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            {events.map((event) => {
              const lowestPrice = event.ticketTiers?.length
                ? Math.min(...event.ticketTiers.map((t: any) => t.price))
                : 'N/A';
              return (
                <div
                  key={event._id}
                  onClick={() => handleEventClick(event._id)}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl min-h-[450px] flex flex-col"
                >
                  {/* Use the helper function to get all images */}
                  <ImageCarousel images={getEventImages(event)} />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                    <p className="text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                    
                    {/* Show ticket tiers */}
                    <div className="mb-2">
                      <p className="text-sm text-gray-400 mb-1">Ticket Tiers:</p>
                      {event.ticketTiers.map((tier: any) => (
                        <div key={tier._id} className="text-sm flex justify-between text-gray-300">
                          <span>{tier.name}</span>
                          <span>₹{tier.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-purple-500 font-semibold">
                        From ₹{lowestPrice}
                      </span>
                      <button
                        onClick={(e) => handleBookTicket(event._id, e)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          bookedEvents.includes(event._id)
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                        disabled={bookedEvents.includes(event._id)}
                      >
                        {bookedEvents.includes(event._id) ? 'Booked' : 'Select Tickets'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/30 rounded-3xl p-8 md:p-16 text-center backdrop-blur-lg border border-purple-900/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">
              Never Miss a Moment
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Sync with our event calendar and plan your cultural journey
            </p>
            <button className="bg-white/90 text-purple-900 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all hover:shadow-lg hover:shadow-purple-900/20 flex items-center gap-2 mx-auto">
              <Calendar className="h-5 w-5" />
              View Full Calendar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Events;