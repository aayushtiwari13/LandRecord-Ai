import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle2, FileText, Target, Clock, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Metric Data
  const stats = [
    { title: "Processed Today", value: "1,248", icon: <FileText className="w-5 h-5 text-stone-600" /> },
    { title: "Auto-Validated", value: "1,102", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
    { title: "Pending Review", value: "146", icon: <Clock className="w-5 h-5 text-amber-600" /> },
    { title: "System Accuracy", value: "94.6%", icon: <Target className="w-5 h-5 text-orange-600" /> },
  ];

  // Chart Data
  const validationData = [
    { name: 'Auto-Validated', value: 88, color: '#16a34a' },
    { name: 'Needs Review', value: 9, color: '#d97706' },
    { name: 'Rejected', value: 3, color: '#dc2626' },
  ];

  const stateData = [
    { state: 'DL', records: 820 },
    { state: 'UP', records: 650 },
    { state: 'HR', records: 430 },
    { state: 'RJ', records: 310 },
  ];

  // Table Data
  const verificationQueue = [
    { id: "LR-8821-X", khasra: "125/2", owner: "Ramesh Kumar", confidence: 98.4, issue: "None", status: "Verified" },
    { id: "LR-8822-Y", khasra: "451/1", owner: "Suresh Singh", confidence: 61.2, issue: "Area Mismatch (0.2 Ac)", status: "Review" },
    { id: "LR-8823-Z", khasra: "89", owner: "Amit Kumar", confidence: 96.1, issue: "None", status: "Verified" },
    { id: "LR-8824-A", khasra: "12/4", owner: "Rajesh Devi", confidence: 42.8, issue: "Illegible Signature", status: "Review" },
    { id: "LR-8825-B", khasra: "77/2", owner: "Sunita Sharma", confidence: 94.9, issue: "None", status: "Verified" },
    { id: "LR-8826-C", khasra: "102", owner: "Vikram Singh", confidence: 21.0, issue: "Khata Not Found", status: "Critical" },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-stone-800 font-sans">
      
      {/* Header */}
      <div className="border-b border-stone-300 pb-3 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">System Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-semibold">Real-time Digitization Metrics</p>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-stone-300 p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-xl font-bold text-stone-900">{stat.value}</h3>
            </div>
            <div className="bg-stone-100 p-2 border border-stone-200">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Validation Donut */}
        <div className="bg-white border border-stone-300 p-4 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">AI Validation Output</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={validationData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {validationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            {validationData.map((item, idx) => (
              <div key={idx} className="flex items-center text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                <div className="w-2 h-2 mr-1.5" style={{ backgroundColor: item.color }}></div>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* State Progress Bar */}
        <div className="lg:col-span-2 bg-white border border-stone-300 p-4 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">Geographic Throughput</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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

      {/* Ultra-Dense Data Table */}
      <div className="bg-white border border-stone-300 shadow-sm flex flex-col w-full">
        <div className="px-4 py-2 border-b border-stone-300 flex justify-between items-center bg-stone-50">
          <h2 className="text-sm font-bold text-stone-800">Manual Verification Queue</h2>
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
                <th className="px-3 py-2 w-32">Record ID</th>
                <th className="px-3 py-2 w-24">Khasra No.</th>
                <th className="px-3 py-2 w-48">Owner Entity</th>
                <th className="px-3 py-2 w-40">AI Confidence</th>
                <th className="px-3 py-2">System Flag</th>
                <th className="px-3 py-2 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {verificationQueue.map((record, index) => (
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
                      <Link 
                        to={`/dashboard/record/${record.id}`}
                        className="inline-block text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-white border border-amber-300 px-2 py-0.5 rounded-sm hover:bg-amber-50"
                      >
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