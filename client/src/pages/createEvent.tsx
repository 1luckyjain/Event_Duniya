// CreateEvent.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Music,
  Tag,
  Users,
} from 'lucide-react';

export interface IEvent {
  image: string;
  image1?: string;
  image2?: string;
  title: string;
  date: Date;
  location: string;
  city: string;
  time: string;
  description: string;
  type: string;
  capacity: number;
  genere: string;
  ticketTiers: TicketTier[];
}

interface TicketTier {
  name: string;
  price: number;
  description?: string;
  maxQuantity: number;
  availableQuantity: number;
}

const CreateEvent: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Set up form state; date is kept as a string for the input and later converted
  const [formData, setFormData] = useState({
    image: '',
    image1: '',
    image2: '',
    fees: '',
    title: '',
    date: '',
    location: '',
    city: '',
    time: '',
    description: '',
    type: '',
    capacity: '',
    genere: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle text/number input changes for non-file fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to upload a file and return the image URL
  const uploadFile = async (
    file: File,
    field: 'image' | 'image1' | 'image2'
  ): Promise<string> => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
    try {
      const res = await fetch(`${API_URL}/api/image/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          imageName: file.name,
          imageType: file.type,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data = await res.json();
      if (!data.uploadUrl) {
        throw new Error('Could not get upload URL');
      }

      // Upload file directly to S3
      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      // Set the image URL in form data
      setFormData(prev => ({ ...prev, [field]: data.imageUrl }));
      return data.imageUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Error uploading image');
      throw err;
    }
  };

  // Handler for file input changes
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'image' | 'image1' | 'image2'
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const imageUrl = await uploadFile(file, field);
        setFormData(prev => ({ ...prev, [field]: imageUrl }));
      } catch (err) {
        console.error('Error handling image upload:', err);
        setError('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.image) {
        throw new Error('Primary image is required');
      }

      // Validate ticket tiers
      if (ticketTiers.length === 0) {
        throw new Error('At least one ticket tier is required');
      }

      for (const tier of ticketTiers) {
        if (!tier.name || tier.price < 0 || tier.maxQuantity <= 0) {
          throw new Error('Please fill all required ticket tier fields with valid values');
        }
      }

      // Validate date
      const eventDate = new Date(formData.date);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date');
      }

      // Validate capacity
      const capacity = Number(formData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        throw new Error('Invalid capacity');
      }

      // Build payload without fees field
      const payload = {
        image: formData.image,
        image1: formData.image1,
        image2: formData.image2,
        title: formData.title,
        date: eventDate,
        location: formData.location,
        city: formData.city,
        time: formData.time,
        description: formData.description,
        type: formData.type,
        capacity: capacity,
        genere: formData.genere,
        ticketTiers: ticketTiers.map(tier => ({
          ...tier,
          availableQuantity: tier.maxQuantity
        }))
      };

      console.log('Submitting payload:', payload); // Add this for debugging

      const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
      
      // Add credentials option and remove unnecessary headers
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        credentials: 'include', // Add this
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData); // Debug log

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create event');
      }

      setSuccess('Event created successfully!');
      setIsLoading(false); // Stop loading before navigation
      navigate('/events'); // Remove setTimeout and navigate immediately

    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Something went wrong');
      setIsLoading(false); // Make sure to stop loading on error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddTicketTier = () => {
    setTicketTiers([...ticketTiers, {
      name: '',
      price: 0,
      description: '',
      maxQuantity: 0,
      availableQuantity: 0
    }]);
  };

  const handleTicketTierChange = (index: number, field: keyof TicketTier, value: string | number) => {
    const updatedTiers = [...ticketTiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value,
      availableQuantity: field === 'maxQuantity' ? Number(value) : updatedTiers[index].availableQuantity
    };
    setTicketTiers(updatedTiers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/50 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Create New Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 p-4 rounded-lg flex items-center gap-3 text-red-400 border border-red-500/30">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 p-4 rounded-lg flex items-center gap-3 text-green-400 border border-green-500/30">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Image Upload Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Primary Image (required)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  required
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Primary"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Secondary Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image1')}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                />
                {formData.image1 && (
                  <img
                    src={formData.image1}
                    alt="Secondary"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tertiary Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image2')}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                />
                {formData.image2 && (
                  <img
                    src={formData.image2}
                    alt="Tertiary"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>
            </div>

            {/* Other Event Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<Tag className="h-5 w-5 text-gray-400" />}
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Summer Music Festival"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<Clock className="h-5 w-5 text-gray-400" />}
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="18:30"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Central Park Amphitheater"
                required
              />
              <InputField
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                required
              />
            </div>

            <InputField
              icon={<Tag className="h-5 w-5 text-gray-400" />}
              label="Event Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Concert, Exhibition, etc."
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<Users className="h-5 w-5 text-gray-400" />}
                label="Capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="500"
                required
              />
              <InputField
                icon={<Music className="h-5 w-5 text-gray-400" />}
                label="Genre"
                name="genere"
                value={formData.genere}
                onChange={handleChange}
                placeholder="Rock, Classical, etc."
                required
              />
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Ticket Tiers</h3>
                <button
                  type="button"
                  onClick={handleAddTicketTier}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <span>Add Ticket Tier</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              
              {ticketTiers.length === 0 && (
                <div className="text-center py-8 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">No ticket tiers added yet. Add a tier to start selling tickets!</p>
                </div>
              )}

              {ticketTiers.map((tier, index) => (
                <div key={index} className="bg-gray-800/50 p-6 rounded-lg space-y-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-purple-400">Ticket Tier {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newTiers = [...ticketTiers];
                        newTiers.splice(index, 1);
                        setTicketTiers(newTiers);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Tier Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., VIP, Regular, Early Bird"
                        value={tier.name}
                        onChange={(e) => handleTicketTierChange(index, 'name', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g., 1000"
                        value={tier.price}
                        onChange={(e) => handleTicketTierChange(index, 'price', Number(e.target.value))}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Maximum Tickets Available *
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g., 100"
                        value={tier.maxQuantity}
                        onChange={(e) => handleTicketTierChange(index, 'maxQuantity', Number(e.target.value))}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Includes meet & greet, front row seats"
                        value={tier.description || ''}
                        onChange={(e) => handleTicketTierChange(index, 'description', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/20 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                rows={5}
                placeholder="Describe your event in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:scale-[1.02]'
              } text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-white text-lg">Creating your event...</span>
            <span className="text-gray-400 text-sm">Please wait, this may take a moment</span>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

// Reusable Input Component for text/number/date fields
interface InputFieldProps {
  icon?: React.ReactNode;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-700/20 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500`}
      />
    </div>
  </div>
);

export default CreateEvent;
