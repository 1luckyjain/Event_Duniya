import React from 'react';
import { ArrowRight, Music2, Users, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-snug md:leading-tight">
              Where Art Comes <span className="text-purple-500">Alive</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-[600px] mx-auto md:mx-0">
              Experience the magic of live performances, art exhibitions, and cultural events.
            </p>
            <div className="flex flex-col md:flex-row justify-center md:justify-start gap-3 md:gap-4">
              <Link 
                to="/events"
                className="bg-purple-500 text-white px-5 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-purple-600 transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Explore Events <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link 
                to="/artist"
                className="border border-white text-white px-5 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-black transition flex items-center justify-center text-sm md:text-base"
              >
                Meet Artists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
<section className="py-12 md:py-24 bg-black">
  <div className="container mx-auto px-4 md:px-6">
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
      {/* Image Section */}
      <div className="relative group order-2 md:order-1">
        <div className="relative rounded-2xl overflow-hidden aspect-square before:absolute before:inset-0 before:bg-purple-500/10 before:z-10">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Live event crowd"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-1/2 h-1/2 border-4 border-purple-500/30 rounded-xl z-0 hidden md:block"></div>
      </div>

      {/* Content Section */}
      <div className="order-1 md:order-2 space-y-6 md:space-y-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
          Revolutionizing Event Experiences
        </h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          At Event Duniya, we're redefining how you experience live entertainment. 
          Our platform bridges the gap between passionate artists and eager audiences, 
          creating unforgettable moments that resonate.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-gray-100 font-medium">Curated Artist Selection</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-gray-100 font-medium">360° Event Management</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-gray-100 font-medium">Audience Engagement Tools</span>
          </div>
        </div>
        <Link 
          to="/artist"
          className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
        >
          Explore Our Network
        </Link>
      </div>
    </div>
  </div>
</section>
      {/* Features Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
        {[{
          icon: <Music2 className="h-10 w-10 md:h-12 md:w-12 text-purple-500" />, 
          title: "Live Performances",
          description: "Experience soul-stirring live music from world-renowned artists."
        }, {
          icon: <Users className="h-10 w-10 md:h-12 md:w-12 text-purple-500" />, 
          title: "Artist Showcases",
          description: "Discover emerging talents and established artists in our curated showcases."
        }, {
          icon: <Calendar className="h-10 w-10 md:h-12 md:w-12 text-purple-500" />, 
          title: "Regular Events",
          description: "Join our weekly events celebrating various art forms and cultures."
        }].map((feature, index) => (
          <div key={index} className="bg-gray-500 bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 md:p-10 rounded-2xl hover:-translate-y-2 transition-transform shadow-lg hover:shadow-xl">
            <div className="mb-5">{feature.icon}</div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-base md:text-lg">{feature.description}</p>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Stay Updated</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Subscribe to our newsletter for the latest events, artist announcements, and exclusive offers.
            </p>
            <form className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 md:px-6 md:py-4 rounded-full bg-gray-900 border border-gray-800 focus:ring-2 focus:ring-purple-500 outline-none text-sm md:text-base text-white"
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-purple-600 transition text-sm md:text-base whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
