import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock, Target } from 'lucide-react';

export default function Dashboard() {
  // 1. Mock Data for Top Cards
  const stats = [
    { title: "Total Documents", value: "1,248", icon: <FileText className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Validated", value: "1,102", icon: <CheckCircle className="text-green-600" />, bg: "bg-green-50" },
    { title: "Pending Review", value: "146", icon: <Clock className="text-yellow-600" />, bg: "bg-yellow-50" },
    { title: "AI Accuracy", value: "94.6%", icon: <Target className="text-orange-600" />, bg: "bg-orange-50" },
  ];

  // 2. Mock Data for Chart
  const chartData = [
    { state: 'Delhi', records: 820 },
    { state: 'UP', records: 650 },
    { state: 'Haryana', records: 430 },
    { state: 'Rajasthan', records: 310 },
  ];

  // 3. Mock Data for Recent Records Table
  const recentRecords = [
    { id: "LR-8821", owner: "Ramesh Kumar", village: "Rampur", status: "Validated" },
    { id: "LR-8822", owner: "Suresh Singh", village: "Sitapur", status: "Needs Review" },
    { id: "LR-8823", owner: "Amit Kumar", village: "Meerut", status: "Validated" },
    { id: "LR-8824", owner: "Rajesh Devi", village: "Karnal", status: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3E2723]">Dashboard Overview</h1>
        <p className="text-sm text-[#5D4037] mt-1">Real-time land record digitization metrics</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-[#3E2723]">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Bar Chart (Takes up 2 columns) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-[#3E2723] mb-4">State-wise Digitization Progress</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fee6dc" />
                <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{fill: '#5D4037'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5D4037'}} />
                <Tooltip cursor={{fill: '#fff7ed'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="records" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Recent Records Table (Takes up 1 column) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <h2 className="text-lg font-bold text-[#3E2723] mb-4">Recent Verifications</h2>
          <div className="space-y-4">
            {recentRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-orange-50/50 rounded-lg transition-colors border border-transparent hover:border-orange-100">
                <div>
                  <p className="text-sm font-bold text-[#4E342E]">{record.id}</p>
                  <p className="text-xs text-gray-500">{record.owner} • {record.village}</p>
                </div>
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    record.status === 'Validated' ? 'bg-green-100 text-green-700' : 
                    record.status === 'Needs Review' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}