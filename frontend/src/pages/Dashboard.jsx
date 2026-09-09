import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle2, FileText, Target, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getDashboardStats();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to load dashboard telemetry", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Initializing Telemetry...</p>
      </div>
    );
  }

  // Icons array mapping for the stats loop
  const icons = [
    <FileText className="w-5 h-5 text-stone-600" />,
    <CheckCircle2 className="w-5 h-5 text-green-600" />,
    <Clock className="w-5 h-5 text-amber-600" />,
    <Target className="w-5 h-5 text-orange-600" />
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-stone-800 font-sans">
      <div className="border-b border-stone-300 pb-3 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">System Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-semibold">Real-time Digitization Metrics</p>
        </div>
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

      <div className="bg-white border border-stone-300 shadow-sm flex flex-col w-full">
        <div className="px-4 py-2 border-b border-stone-300 flex justify-between items-center bg-stone-50">
          <h2 className="text-sm font-bold text-stone-800">Recent Ingestions</h2>
        </div>
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-300 text-[10px] font-bold text-stone-600 uppercase tracking-widest divide-x divide-stone-300">
                <th className="px-3 py-2 w-32">Record ID</th>
                <th className="px-3 py-2 w-24">Khasra No.</th>
                <th className="px-3 py-2 w-48">Owner Entity</th>
                <th className="px-3 py-2 w-40">AI Confidence</th>
                <th className="px-3 py-2">System Flag</th>
                <th className="px-3 py-2 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {dashboardData.recentRecords.map((record, index) => (
                <tr key={index} className="hover:bg-amber-50/50 divide-x divide-stone-100">
                  <td className="px-3 py-1.5 font-mono text-stone-900">{record.id}</td>
                  <td className="px-3 py-1.5 font-mono font-semibold text-stone-700">{record.khasra}</td>
                  <td className="px-3 py-1.5 text-stone-800">{record.owner}</td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center">
                      <span className="font-mono w-10 text-[11px]">{record.confidence}%</span>
                      <div className="flex-1 h-1 bg-stone-200 ml-2">
                        <div className={`h-full ${record.confidence > 90 ? 'bg-green-500' : record.confidence > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${record.confidence}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    {record.status === 'Verified' ? (
                      <span className="text-stone-500 flex items-center text-[11px] font-semibold"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500"/> Verified</span>
                    ) : (
                      <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-sm ${
                        record.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {record.issue}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    {record.status !== 'Verified' && (
                      <Link to={`/dashboard/record/${record.id}`} className="inline-block text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-white border border-amber-300 px-2 py-0.5 rounded-sm hover:bg-amber-50">
                        Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}