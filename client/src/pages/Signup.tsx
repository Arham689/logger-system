const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from 'axios';
import { AlertCircle, Eye, EyeOff, Lock, Mail, Scale, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setError('');

    if (!isSignIn) {
      try {
        const response = await axios.post(
          `${BASE_URL}/signup`,
          {
            name: username,
            email,
            password,
            age,
          },
          { withCredentials: true }
        );
        // Cookies.set('token', response.data.token, { expires: 7, secure: true });
        navigate('/home');
        console.log(response);
        // toast.success(response.data.message);
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Server error');
        } else {
          setError('Server error');
        }
        // toast.error(err.response?.data?.message || 'Server error');
      }
      console.log(email, username, password);
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}/login`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        console.log(response);
        //  , {withCredentials : true , headers : { "Content-Type" : "application/json" }}
        // Cookies.set('token', response.data.token, { expires: 7, secure: true });
        navigate('/home');
        // toast.success(response.data.message);
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Server error');
        } else {
          setError('Server error');
        }
        // toast.error(err.response?.data?.message || 'Server error');
      }

      console.log(email, password);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black from-50% to-[#1F4FD8] p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-light text-white">
            {!isSignIn ? (
              <>
                Create new <span className="font-medium text-blue-400">Account</span>
              </>
            ) : (
              <>
                Welcome <span className="font-medium text-blue-400">Back</span>
              </>
            )}
          </h1>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-700/50 bg-red-900/30 p-3 text-sm text-red-400">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {!isSignIn && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Username</label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Age</label>
                  <div className="relative">
                    <Scale className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-12 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div
              onClick={handleSubmit}
              className="mt-6 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
            >
              {isSignIn ? 'Login' : 'Create Account'}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
                setUsername('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-gray-400 transition-colors hover:text-blue-400"
            >
              {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
