import React from 'react';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Choose Account Type</h2>
          <p className="mt-2 text-gray-400">Select how you want to join EventDuniya</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/signup/user"
            className="w-full block p-6 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-xl font-semibold text-white">Join as User</h3>
            <p className="mt-2 text-gray-400">Discover and book amazing events</p>
          </Link>

          <Link
            to="/artistsignup"
            className="w-full block p-6 bg-purple-900 rounded-xl hover:bg-purple-800 transition-colors"
          >
            <h3 className="text-xl font-semibold text-white">Join as Artist</h3>
            <p className="mt-2 text-purple-200">Showcase your talent and create events</p>
          </Link>
        </div>

        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-500 hover:text-purple-400">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
