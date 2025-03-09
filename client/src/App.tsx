// App.tsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Artist from './pages/Artist';
import Events from './pages/Events';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import ArtistProfile from './pages/ArtistProfile';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import ArtistSignup from './pages/ArtistSignup';
import CreateEvent from './pages/createEvent';
import Logout from './pages/Logout';
import UserSignup from './pages/UserSignup';
import TicketDetails from './pages/TicketDetails';
import EventDetails from './pages/EventDetails';
import { useAuth } from './context/auth-context';
import logo from '/logo2.png';

// PublicRoute component to prevent logged-in users from accessing public pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { token, user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav className="fixed w-full bg-black/40 backdrop-blur-xl z-50">
          <div className="container px-[10%] mx-auto  py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-purple-500">
              <img className="w-40 bg-transparent" src={logo} alt="" />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-purple-500 transition">
                Home
              </Link>
              <Link to="/artist" className="hover:text-purple-500 transition">
                Artists
              </Link>
              <Link to="/events" className="hover:text-purple-500 transition">
                Events
              </Link>
              <Link to="/contact" className="hover:text-purple-500 transition">
                Contact
              </Link>
              {token ? (
                <>
                  <Link
                    to="/create-event"
                    className="hover:text-purple-500 transition"
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/profile"
                    className="border border-purple-500 rounded-full px-2 hover:text-purple-500 transition"
                  >
                    {user.username}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="hover:text-purple-500 transition"
                  >
                    Signup
                  </Link>
                  <Link
                    to="/login"
                    className="hover:text-purple-500 transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-lg">
              <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col items-center space-y-6 text-lg">
                  <Link
                    to="/"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/artist"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Artists
                  </Link>
                  <Link
                    to="/events"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    to="/contact"
                    className="hover:text-purple-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/create-event"
                    className="hover:text-purple-500 transition"
                  >
                    Create Event
                  </Link>
                  {token ? (
                    <>
                      <Link
                        to="/profile"
                        className="border border-white rounded-full px-4 py-1 hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {user.username}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Signup
                      </Link>
                      <Link
                        to="/login"
                        className="hover:text-purple-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/ticket/:ticketId" element={<TicketDetails />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/artistsignup"
              element={
                <PublicRoute>
                  <ArtistSignup />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/user"
              element={
                <PublicRoute>
                  <UserSignup />
                </PublicRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black/90 text-white py-12 mt-20">
          <div className="container mx-auto px-[10%]">
            <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
              <div>
                <img className="w-40 mx-auto md:mx-0" src={logo} alt="" />
                <p className="text-gray-400">
                  Celebrating creativity and artistic expression through
                  unforgettable experiences.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-400 hover:text-purple-500"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/artist"
                      className="text-gray-400 hover:text-purple-500"
                    >
                      Artists
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="text-gray-400 hover:text-purple-500"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-purple-500"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Info</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Jaipur</li>
                  <li>Rajasthan, India</li>
                  <li>eventduniyaa@gmail.com</li>
                  <li>+91 8435308486</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a
                    href="https://www.instagram.com/eventduniyaofficial/"
                    className="text-gray-400 hover:text-purple-500"
                  >
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-500">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-500">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 EventDuniya. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
