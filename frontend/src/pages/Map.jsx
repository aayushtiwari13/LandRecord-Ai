import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Layers, Search, MapPin } from 'lucide-react';

export default function MapPage() {
  // Center of our mock map (Meerut region)
  const mapCenter = [28.9845, 77.7064];

  // Mock Cadastral Boundary (Khasra 125/2)
  const khasraPolygon = [
    [28.9850, 77.7060],
    [28.9855, 77.7062],
    [28.9852, 77.7070],
    [28.9848, 77.7068],
  ];

  const [activeKhasra, setActiveKhasra] = useState(null);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-[1600px] mx-auto text-stone-800 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center">
            <MapIcon className="w-6 h-6 mr-2 text-amber-600" /> Spatial GIS Viewer
          </h1>
          <p className="text-sm text-stone-500 mt-1">Real-time cadastral boundary mapping and verification.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2 text-stone-400" />
            <input type="text" placeholder="Search Khasra or Village..." className="pl-9 pr-3 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-amber-500 w-64 bg-white" />
          </div>
          <button className="px-3 py-1.5 border border-stone-300 rounded-md bg-white text-sm font-medium hover:bg-stone-100 flex items-center shadow-sm">
            <Layers className="w-4 h-4 mr-2" /> Base Layers
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 bg-white border border-stone-300 rounded-lg shadow-sm overflow-hidden relative flex">
        
        {/* Left Side: Map */}
        <div className="flex-1 relative z-0">
          <MapContainer center={mapCenter} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            {/* OpenStreetMap Satellite/Street View Hybrid (Mock) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Cadastral Polygon (Boundary of the land) */}
            <Polygon 
              positions={khasraPolygon} 
              pathOptions={{ color: '#ea580c', fillColor: '#fbd38d', fillOpacity: 0.4, weight: 3 }}
              eventHandlers={{ click: () => setActiveKhasra('125/2') }}
            >
              <Tooltip sticky>Khasra No: 125/2</Tooltip>
            </Polygon>
          </MapContainer>
        </div>

        {/* Right Side: Floating Data Panel */}
        {activeKhasra && (
          <div className="w-80 bg-white border-l border-stone-300 p-5 shadow-[-4px_0_15px_rgba(0,0,0,0.05)] z-10 flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h2 className="text-lg font-bold text-stone-800">Plot Details</h2>
              <button onClick={() => setActiveKhasra(null)} className="text-stone-400 hover:text-stone-600 font-bold text-xl">&times;</button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Khasra Number</p>
                <p className="text-lg font-mono font-bold text-amber-700">{activeKhasra}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Owner</p>
                <p className="text-sm font-semibold text-stone-800">Ramesh Kumar</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Total Area</p>
                <p className="text-sm font-semibold text-stone-800">2.50 Acres</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Status</p>
                <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-sm border border-green-200">
                  Verified & Digitized
                </span>
              </div>
            </div>

            <button className="w-full py-2 bg-stone-800 text-white text-sm font-bold rounded-md hover:bg-stone-900 transition-colors mt-4">
              View Digital Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}