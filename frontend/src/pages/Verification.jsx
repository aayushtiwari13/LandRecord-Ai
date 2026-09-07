import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, ArrowRight } from 'lucide-react';

export default function Verification() {
  // Mock data specifically for records that NEED human review
  const pendingRecords = [
    { id: "LR-8822-Y", khasra: "451/1", village: "Sitapur", issue: "Area Mismatch (0.2 Ac)", date: "2026-09-08 10:30 AM" },
    { id: "LR-8824-A", khasra: "12/4", village: "Karnal", issue: "Illegible Signature", date: "2026-09-08 11:15 AM" },
    { id: "LR-8826-C", khasra: "102", village: "Rohtak", issue: "Khata Not Found", date: "2026-09-08 01:45 PM" },
    { id: "LR-8829-M", khasra: "77/1", village: "Meerut", issue: "Blurred Boundary Map", date: "2026-09-08 02:10 PM" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-stone-800 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Verification Queue</h1>
        <p className="text-sm text-stone-500 mt-1">Review and resolve AI-flagged land records.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search by ID or Village..." 
                className="pl-9 pr-3 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-amber-500 w-72"
              />
            </div>
            <button className="px-3 py-1.5 border border-stone-300 rounded-md bg-white text-sm font-medium hover:bg-stone-100 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
          <div className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
            {pendingRecords.length} Records Pending
          </div>
        </div>

        {/* List of Pending Records */}
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
                    <span><strong className="text-stone-500 font-medium">Khasra:</strong> {record.khasra}</span>
                    <span><strong className="text-stone-500 font-medium">Village:</strong> {record.village}</span>
                    <span><strong className="text-stone-500 font-medium">Time:</strong> {record.date}</span>
                  </div>
                </div>
              </div>

              <div>
                <Link 
                  to={`/dashboard/record/${record.id}`}
                  className="flex items-center px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-md hover:bg-stone-900 transition-colors"
                >
                  Resolve <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

            </div>
          ))}

          {/* Empty State Fallback (If no records) */}
          {pendingRecords.length === 0 && (
            <div className="p-12 text-center text-stone-500">
              <p className="text-lg font-semibold">Queue is empty</p>
              <p className="text-sm">All AI-flagged records have been resolved.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}