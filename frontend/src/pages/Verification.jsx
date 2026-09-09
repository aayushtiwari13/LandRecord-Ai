import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { apiService } from '../services/api'; // api.js ko import kiya

export default function Verification() {
  // Data aur Loading ke liye state banayi
  const [pendingRecords, setPendingRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Page load hote hi API call hogi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getPendingVerifications();
        setPendingRecords(response.data);
      } catch (error) {
        console.error("Data fetch karne mein error:", error);
      } finally {
        setIsLoading(false); // Data aa gaya, loading band karo
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-stone-800 font-sans">
      
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Verification Queue</h1>
        <p className="text-sm text-stone-500 mt-1">Review and resolve AI-flagged land records.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-stone-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-3 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none w-72" />
            </div>
            <button className="px-3 py-1.5 border border-stone-300 rounded-md bg-white text-sm font-medium hover:bg-stone-100 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* CONDITION: Agar data load ho raha hai toh Spinner dikhao */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : (
          /* CONDITION: Data aa gaya toh List dikhao */
          <div className="divide-y divide-stone-100">
            {pendingRecords.map((record) => (
              <div key={record.id} className="p-5 hover:bg-stone-50 transition-colors flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-amber-100 text-amber-700 rounded-md">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-base font-bold text-stone-900 font-mono">{record.id}</h3>
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm">
                        {record.issue}
                      </span>
                    </div>
                    <div className="text-sm text-stone-600 flex space-x-4">
                      <span><strong className="text-stone-500">Khasra:</strong> {record.khasra}</span>
                      <span><strong className="text-stone-500">Village:</strong> {record.village}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Link to={`/dashboard/record/${record.id}`} className="flex items-center px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-md hover:bg-stone-900 transition-colors">
                    Resolve <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Empty State */}
            {pendingRecords.length === 0 && (
              <div className="p-12 text-center text-stone-500">
                <p className="text-lg font-semibold">Queue is empty</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}