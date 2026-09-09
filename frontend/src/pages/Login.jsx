import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2, Lock } from 'lucide-react';
import { apiService } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('admin@gov.in');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.login({ email, password });
      
      // Save the mock JWT token to browser storage
      localStorage.setItem('auth_token', response.data.token); 
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Secure connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center border-4 border-amber-500 mb-4 shadow-lg">
          <ShieldCheck className="w-10 h-10 text-amber-500" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Land Record AI System</h2>
        <p className="mt-2 text-sm text-stone-600 font-semibold uppercase tracking-widest">Authorized Personnel Only</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-stone-200 sm:rounded-lg sm:px-10">
          
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Lock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-amber-700 font-medium">
                  This is a secure government portal. All activities are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-stone-700">Official Email ID</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-stone-50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700">Secure Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-stone-50 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-700 text-xs font-bold bg-red-50 p-3 rounded border border-red-200">
                <AlertCircle className="w-4 h-4 mr-2" /> {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-stone-800 hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 uppercase tracking-wider transition-colors ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Authenticating...</>
                ) : (
                  "Secure Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}