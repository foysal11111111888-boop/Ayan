import React, { useState, FormEvent } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_NAME } from '../config';
import { User } from '../types';
import toast from 'react-hot-toast';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { users, dispatch } = useGlobalState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Admin Login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        toast.success(`Welcome back, Admin!`);
        const adminUser: User = {
          id: 'admin',
          name: 'Admin',
          email: ADMIN_EMAIL,
          credits: 9999,
          role: 'admin',
          status: 'active'
        };
        dispatch({ type: 'LOGIN', payload: adminUser });
        return;
      }

      // User Login
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        if (user.status === 'blocked') {
            toast.error('Your account has been blocked. Please contact support.');
            return;
        }
        toast.success(`Welcome back, ${user.name}!`);
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        toast.error('Invalid email or password.');
      }
    } else {
      // Sign Up
      if (users.some(u => u.email === email)) {
        toast.error('An account with this email already exists.');
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        credits: 10, // 10 free starter credits
        role: 'user',
        status: 'active'
      };

      toast.success(`Welcome, ${name}! You have received 10 free credits.`);
      dispatch({ type: 'SIGNUP', payload: newUser });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-400">{APP_NAME}</h1>
            <p className="text-gray-400 mt-2">The future of AI image generation.</p>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-3 text-center font-semibold transition-colors duration-300 ${isLogin ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'}`}
              aria-pressed={isLogin}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-3 text-center font-semibold transition-colors duration-300 ${!isLogin ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'}`}
              aria-pressed={!isLogin}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your Name"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isLogin ? 1 : 6}
                className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
