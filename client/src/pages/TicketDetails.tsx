import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import axios from 'axios';
import { Calendar, Clock, MapPin, ArrowLeft, User, Ticket } from 'lucide-react';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { token } = useAuth();
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        const response = await axios.get(
          `${API_URL}/api/bookings/ticket/${ticketId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setTicketData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch ticket details');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId, token]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
    </div>;
  }

  if (error || !ticketData) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
      {error || 'Ticket not found'}
    </div>;
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <Link 
          to="/profile" 
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Profile
        </Link>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Ticket Details
            </h1>
            <Ticket className="h-8 w-8 text-purple-400" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Information</h2>
                <img 
                  src={ticketData.event.image} 
                  alt={ticketData.event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4" 
                />
                <h3 className="text-lg font-medium">{ticketData.event.title}</h3>
                <p className="text-gray-400 mt-2">{ticketData.event.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                  <span>{new Date(ticketData.event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 mr-3 text-purple-400" />
                  <span>{ticketData.event.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                  <span>{ticketData.event.location}, {ticketData.event.city}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Booking ID</label>
                    <p className="text-white font-mono">{ticketData._id}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Booked On</label>
                    <p className="text-white">
                      {new Date(ticketData.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Ticket Status</label>
                    <p className="text-emerald-400">Active</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Attendee Details</h2>
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-white">{ticketData.user.username}</p>
                      <p className="text-gray-400 text-sm">{ticketData.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
