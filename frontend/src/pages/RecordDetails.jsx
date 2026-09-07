import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, AlertTriangle, CheckCircle2, Save, Database } from 'lucide-react';

export default function RecordDetails() {
  const { id } = useParams(); // Gets the ID from the URL (e.g., LR-8822-Y)

  // Simulated state for editing low-confidence fields
  const [areaValue, setAreaValue] = useState("2.50");
  const [isSaving, setIsSaving] = useState(false);

  // Mock Data for the specific record
  const record = {
    id: id || "LR-8822-Y",
    documentType: "Khasra / Khatauni",
    language: "Hindi",
    uploadDate: "2026-09-08 10:24 AM",
    fields: [
      { key: "owner_name", label: "Owner / Entity", extracted: "Suresh Singh", confidence: 98.4, status: "high" },
      { key: "khasra_no", label: "Khasra Number", extracted: "451/1", confidence: 96.2, status: "high" },
      { key: "khata_no", label: "Khata Number", extracted: "112", confidence: 91.0, status: "high" },
      { key: "area", label: "Total Area (Acres)", extracted: "2.50", confidence: 61.2, status: "low", issue: "DILRMP Mismatch: Expected 2.30" },
      { key: "village", label: "Village", extracted: "Sitapur", confidence: 99.1, status: "high" },
    ]
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[1600px] mx-auto text-stone-800 font-sans -m-8">
      
      {/* Top Toolbar */}
      <div className="bg-white border-b border-stone-300 px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-1.5 border border-stone-300 rounded-sm hover:bg-stone-100 text-stone-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-stone-900 leading-tight">Verification: {record.id}</h1>
            <p className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider">{record.documentType} • {record.language}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-sm">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Human Verification Required
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-1.5 bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm hover:bg-stone-900 transition-colors"
          >
            {isSaving ? "Saving..." : <><Save className="w-3.5 h-3.5 mr-1.5" /> Commit to DILRMP</>}
          </button>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex flex-1 overflow-hidden bg-stone-100">
        
        {/* Left Pane: Document Viewer */}
        <div className="w-1/2 flex flex-col border-r border-stone-300 bg-stone-200 relative">
          
          {/* Viewer Toolbar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-stone-300 shadow-sm rounded-sm flex items-center p-1 z-10 space-x-1">
            <button className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-600"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-[10px] font-mono px-2 font-bold text-stone-500">100%</span>
            <button className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-600"><ZoomIn className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-stone-300 mx-1"></div>
            <button className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-600"><Maximize className="w-4 h-4" /></button>
          </div>

          {/* Simulated Document Image Area */}
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div className="w-full max-w-lg aspect-[1/1.4] bg-white shadow-md border border-stone-300 flex flex-col relative">
              {/* Mock Document Content */}
              <div className="p-8 border-b-2 border-double border-stone-300">
                <h2 className="text-center text-xl font-serif font-bold text-stone-800 mb-6">राजस्व विभाग, उत्तर प्रदेश</h2>
                <div className="space-y-4 font-serif text-sm text-stone-700">
                  <div className="flex justify-between border-b border-stone-200 pb-1">
                    <span>खाता संख्या: 112</span>
                    <span>ग्राम: सीतापुर</span>
                  </div>
                  <p className="leading-relaxed">
                    प्रमाणित किया जाता है कि खसरा संख्या <span className="bg-yellow-200/50 px-1 border border-yellow-400 font-bold">451/1</span> का स्वामित्व श्री सुरेश सिंह के नाम पर दर्ज है।
                  </p>
                  <p className="leading-relaxed relative">
                    उक्त भूमि का कुल क्षेत्रफल 
                    {/* Simulated OCR Bounding Box overlay */}
                    <span className="absolute -inset-1 border-2 border-amber-500 bg-amber-500/10 z-10"></span>
                    <span className="relative z-0 px-2">2.50</span> 
                    एकड़ है।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Extraction & Validation Form */}
        <div className="w-1/2 flex flex-col bg-white overflow-y-auto">
          
          <div className="p-6 border-b border-stone-200 bg-stone-50/50">
            <h2 className="text-sm font-bold text-stone-800 mb-1">AI Extraction Results</h2>
            <p className="text-xs text-stone-500">Review low-confidence fields before committing to the database.</p>
          </div>

          <div className="p-6 space-y-6">
            {record.fields.map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between items-end mb-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">{field.label}</label>
                  
                  {/* Confidence Badge */}
                  <div className="flex items-center text-[10px] font-mono font-bold">
                    <span className="text-stone-400 mr-2">CONF:</span>
                    <span className={`${field.status === 'high' ? 'text-green-600' : 'text-amber-600'}`}>
                      {field.confidence}%
                    </span>
                  </div>
                </div>

                {field.status === 'high' ? (
                  /* High Confidence - Read Only */
                  <div className="flex items-center w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm font-semibold text-stone-800 font-mono">{field.extracted}</span>
                  </div>
                ) : (
                  /* Low Confidence - Editable Input */
                  <div className="flex flex-col space-y-2">
                    <div className="relative flex items-center">
                      <div className="absolute left-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <input 
                        type="text" 
                        value={areaValue}
                        onChange={(e) => setAreaValue(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm font-semibold font-mono text-stone-900 border-2 border-amber-300 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-amber-50/30"
                      />
                    </div>
                    {/* Database Cross-reference Warning */}
                    <div className="flex items-start p-2 bg-red-50 border border-red-100 rounded-sm">
                      <Database className="w-3.5 h-3.5 text-red-500 mr-1.5 mt-0.5 shrink-0" />
                      <p className="text-[11px] font-semibold text-red-700 leading-tight">
                        {field.issue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}