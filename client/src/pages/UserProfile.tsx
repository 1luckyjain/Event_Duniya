import React, { useEffect, useState } from 'react';
import {
  User,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Heart,
  MapPin,
  Calendar,
  Plus,
  X,
  Save,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/auth-context';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function UserProfile() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // State for modal visibility
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  // State for form submission status
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null as string | null,
  });

  // Basic profile info
  const userProfile = {
    name: user?.username || "Your Name",
    email: user?.email || "you@example.com",
    joinDate: "January 2025",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300",
  };

  const userId = user?._id;

  // Axios configuration with token header
  const axiosConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // State for upcoming events (booked events)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  // State for queries (if the user is an artist)
  const [queries, setQueries] = useState<any[]>([]);
  const [bookedTickets, setBookedTickets] = useState<any[]>([]);

  // Fetch upcoming events for the user
  useEffect(() => {
    async function fetchBookedEvents() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        // 1. Fetch all events from the API.
        const allEventsResponse = await axios.get(
          `${API_URL}/api/events`,
          axiosConfig
        );
        const allEvents = Array.isArray(allEventsResponse.data)
          ? allEventsResponse.data
          : [];

        // 2. Fetch booked event IDs for the user.
        const eventIdsResponse = await axios.post(
          `${API_URL}/api/user/events`,
          { userId },
          axiosConfig
        );
        const bookedEventIds = Array.isArray(eventIdsResponse.data.eventIds)
          ? eventIdsResponse.data.eventIds
          : [];
        console.log("Booked event IDs:", bookedEventIds);

        // 3. Filter all events using the booked event IDs.
        const filteredEvents = allEvents.filter((event: any) =>
          bookedEventIds.includes(event._id)
        );
        setUpcomingEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching booked events:", error);
      }
    }

    if (userId) {
      fetchBookedEvents();
    }
  }, [userId]);

  // If the user is an artist, fetch the queries sent to them.
  useEffect(() => {
    async function fetchQueries() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        const response = await axios.get(
          `${API_URL}/api/contact?artistId=${userId}`,
          axiosConfig
        );
        if (Array.isArray(response.data)) {
          setQueries(response.data);
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    }
    if (userId && user.role === 'Artist') {
      fetchQueries();
    }
  }, [userId, user]);

  // Add this function to handle logout
  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      
      // 1. Log the user out from the server side
      console.log("Sending logout request...");
      await axios({
        method: 'post',
        url: `${API_URL}/api/auth/logout`,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Logout request complete");
      
      // 2. Clear client-side auth state
      logout();
      
      // 3. Clear any localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expiresAt');
      
      // 4. Navigate to home
      navigate('/', { replace: true });
      
      // 5. Force reload the page to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state and redirect
      logout();
      localStorage.clear();
      window.location.href = '/';
    }
  };

  useEffect(() => {
    async function fetchBookedEvents() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        
        // First get the booked event IDs
        const eventIdsResponse = await axios.post(
          `${API_URL}/api/user/events`,
          { userId },
          axiosConfig
        );
        const bookedEventIds = Array.isArray(eventIdsResponse.data.eventIds)
          ? eventIdsResponse.data.eventIds
          : [];

        // Then fetch the actual event details
        const eventsResponse = await axios.get(
          `${API_URL}/api/events`,
          axiosConfig
        );
        const allEvents = Array.isArray(eventsResponse.data)
          ? eventsResponse.data
          : [];

        // Filter events to get only booked ones
        const bookedEvents = allEvents.filter(event => 
          bookedEventIds.includes(event._id)
        );

        console.log('Booked events:', bookedEvents);
        setBookedTickets(bookedEvents);
      } catch (error) {
        console.error("Error fetching booked events:", error);
      }
    }

    if (userId) {
      fetchBookedEvents();
    }
  }, [userId, token]);

  useEffect(() => {
    // Update form data when user changes
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, success: false, error: null });
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      
      // Make sure userId is a string
      const userIdString = userId?.toString();
      console.log(`Sending update request for user: ${userIdString}`);
      
      const response = await axios.put(
        `${API_URL}/api/user/${userIdString}`,
        formData,
        axiosConfig
      );
      
      // Update the user in context
      updateUser({ ...user, ...response.data });
      
      setUpdateStatus({ loading: false, success: true, error: null });
      
      // Close modal after success
      setTimeout(() => {
        setShowSettingsModal(false);
        setUpdateStatus(prev => ({ ...prev, success: false }));
      }, 2000);
    } catch (error: any) {
      console.error('Profile update error:', error.response?.data || error);
      setUpdateStatus({ 
        loading: false, 
        success: false, 
        error: error.response?.data?.error || "Failed to update profile" 
      });
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchUserPayments = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
          const { data } = await axios.get(`${API_URL}/api/payment/user/${userId}`, axiosConfig);

          if (data.success && data.payments) {
            const now = new Date();
            // Keep only events whose date is not yet passed
            const futurePayments = data.payments.filter((payment: any) => {
              const eventDate = new Date(payment.eventId.date);
              return eventDate >= now;
            });
            setBookedTickets(futurePayments);
          }
        } catch (error) {
          console.error('Error fetching user payments:', error);
        }
      };
      fetchUserPayments();
    }
  }, [userId, token]);

  // Fetch contact data sent to the artist
  useEffect(() => {
    async function fetchContactData() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        const response = await axios.get(
          `${API_URL}/api/contact?artistId=${userId}`,
          axiosConfig
        );
        if (Array.isArray(response.data)) {
          setQueries(response.data);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    }
    if (userId && user.role === 'Artist') {
      fetchContactData();
    }
  }, [userId, user]);

  return (
    <div className="bg-black min-h-screen py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 xl:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative group mb-4">
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/30 hover:border-purple-500/50 transition-all"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-500/20 transition-all" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                  {userProfile.name}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Member since {userProfile.joinDate}
                </p>
              </div>
              
              <nav className="space-y-1.5">
                {[
                  { icon: User, label: 'Profile', active: true },
                  { icon: Ticket, label: 'Create Events', path: '/create-event' },
                  { icon: Bell, label: 'Notifications' },
                  { 
                    icon: Settings, 
                    label: 'Settings', 
                    onClick: () => setShowSettingsModal(true) 
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      item.active 
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                      }
                      if (item.onClick) {
                        item.onClick();
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
                <Link
                  to="/create-event"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Plus className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Create Event</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 xl:space-y-8">
            {/* Booked Tickets */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="h-6 w-6 text-purple-400" />
                <span>Booked Tickets</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {bookedTickets.length > 0 ? (
                  bookedTickets.map((payment: any) => {
                    const event = payment.eventId || {};
                    const tier = (event.ticketTiers || []).find((t: any) => t._id === payment.ticketTierId);
                    return (
                      <div key={payment._id} className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Tier:</strong> {tier?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Quantity:</strong> {payment.quantity}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Total Price:</strong> {payment.amount}
                            </div>
                            <div className="text-sm text-purple-400 mt-1">
                              Type: {event.type}
                            </div>
                            <Link
                              to={`/events/${event._id}`}
                              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all block text-center"
                            >
                              View Event Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">No booked events</div>
                    <p className="text-sm text-gray-500">
                      Your booked events will appear here once you book one
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Contact Data */}
            {user.role === 'Artist' && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-purple-400" />
                  <span>Contact Requests</span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {queries.length > 0 ? (
                    queries.map((query: any) => (
                      <div key={query._id} className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col">
                          <div className="p-4">
                            <h4 className="font-semibold text-lg">{query.subject}</h4>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Name:</strong> {query.name}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Email:</strong> {query.email}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Phone:</strong> {query.phone}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Message:</strong> {query.message}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              <strong>Budget:</strong> {query.budget}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">No contact requests</div>
                      <p className="text-sm text-gray-500">
                        Contact requests will appear here once someone contacts you.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="johndoe123"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="New York, USA"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              {updateStatus.error && (
                <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">
                  {updateStatus.error}
                </div>
              )}
              
              {updateStatus.success && (
                <div className="text-green-500 text-sm p-2 bg-green-500/10 rounded">
                  Profile updated successfully!
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatus.loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 disabled:opacity-50"
                >
                  {updateStatus.loading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
