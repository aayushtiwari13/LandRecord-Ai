import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, FileText, Target, Clock, Search, Filter, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyDocumentsApi } from '../services/api';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await getMyDocumentsApi();
      setDocuments(res.documents || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const stats = [
    { title: "Uploaded Records", value: documents.length.toString(), icon: <FileText className="w-5 h-5 text-stone-600" /> },
    { title: "Processed", value: documents.filter(d => d.status === 'PROCESSED').length.toString(), icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
    { title: "Pending", value: documents.filter(d => d.status !== 'PROCESSED').length.toString(), icon: <Clock className="w-5 h-5 text-amber-600" /> },
    { title: "System Accuracy", value: "95%", icon: <Target className="w-5 h-5 text-orange-600" /> },
  ];

  const validationData = [
    { name: 'Auto-Validated', value: 88, color: '#16a34a' },
    { name: 'Needs Review', value: 9, color: '#d97706' },
    { name: 'Rejected', value: 3, color: '#dc2626' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Initializing Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-stone-800 font-sans">
      <div className="border-b border-stone-300 pb-3 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">System Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-semibold">Real-time Digitization Metrics</p>
        </div>
        <button 
          onClick={fetchDocs} 
          className="flex items-center text-xs border border-stone-300 px-3 py-1.5 rounded bg-white hover:bg-stone-50 font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dashboardData.stats.map((stat, index) => (
          <div key={index} className="bg-white border border-stone-300 p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-xl font-bold text-stone-900">{stat.value}</h3>
            </div>
            <div className="bg-stone-100 p-2 border border-stone-200">
              {icons[index]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-300 p-4 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">AI Validation Output</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboardData.validationData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {dashboardData.validationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-stone-300 p-4 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">Geographic Throughput</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.stateData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{fill: '#57534e', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#57534e', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f5f5f4'}} contentStyle={{ borderRadius: '0', fontSize: '12px' }} />
                <Bar dataKey="records" fill="#ea580c" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Backend Data Table */}
      <div className="bg-white border border-stone-300 shadow-sm flex flex-col w-full">
        <div className="px-4 py-2 border-b border-stone-300 flex justify-between items-center bg-stone-50">
          <h2 className="text-sm font-bold text-stone-800">Uploaded Documents (Live Database)</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1.5 text-stone-400" />
              <input type="text" placeholder="Search..." className="pl-7 pr-2 py-1 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-amber-500 w-48" />
            </div>
            <button className="p-1 border border-stone-300 rounded-sm bg-white hover:bg-stone-100"><Filter className="w-3.5 h-3.5 text-stone-600" /></button>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-300 text-[10px] font-bold text-stone-600 uppercase tracking-widest divide-x divide-stone-300">
                <th className="px-3 py-2 w-20">Doc ID</th>
                <th className="px-3 py-2">Filename</th>
                <th className="px-3 py-2 w-32">Status</th>
                <th className="px-3 py-2 w-36">Upload Time</th>
                <th className="px-3 py-2 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-stone-500 italic">
                    {loading ? "Loading documents..." : "No documents found. Please upload one!"}
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-amber-50/50 divide-x divide-stone-100">
                    <td className="px-3 py-1.5 font-mono text-stone-900 font-bold">#{doc.id}</td>
                    <td className="px-3 py-1.5 text-stone-800 truncate max-w-xs">{doc.original_filename}</td>
                    <td className="px-3 py-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                        doc.status === 'PROCESSED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 font-mono text-stone-500 text-[11px]">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      <Link 
                        to={`/dashboard/record/${doc.id}`}
                        className="inline-block text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-white border border-amber-300 px-2 py-0.5 rounded-sm hover:bg-amber-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}