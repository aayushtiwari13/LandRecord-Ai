import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, AlertTriangle, CheckCircle2, Save, Database, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function RecordDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // States
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [areaValue, setAreaValue] = useState("");

  // API call to fetch record details
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await apiService.getRecordById(id);
        setRecord(response.data);
        
        // Low confidence field ki value state mein set karo taaki edit ho sake
        const areaField = response.data.fields.find(f => f.key === 'area');
        if (areaField) setAreaValue(areaField.extracted);
        
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  // Handle Save Action
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call to save updated data
      await apiService.updateRecord(id, { area: areaValue });
      alert("Record Successfully Verified & Saved to Database!"); // Temporary alert, baad mein toast lagayenge
      navigate('/dashboard/verification'); // Wapas queue par bhej do
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save record.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Loading Document Details...</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[1600px] mx-auto text-stone-800 font-sans -m-8">
      
      {/* Top Toolbar */}
      <div className="bg-white border-b border-stone-300 px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/verification" className="p-1.5 border border-stone-300 rounded-sm hover:bg-stone-100 text-stone-600 transition-colors">
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
            className={`flex items-center px-4 py-1.5 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm transition-colors ${
              isSaving ? "bg-stone-500 cursor-not-allowed" : "bg-stone-800 hover:bg-stone-900"
            }`}
          >
            {isSaving ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-3.5 h-3.5 mr-1.5" /> Commit to DILRMP</>
            )}
          </button>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex flex-1 overflow-hidden bg-stone-100">
        
        {/* Left Pane: Document Viewer */}
        <div className="w-1/2 flex flex-col border-r border-stone-300 bg-stone-200 relative">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-stone-300 shadow-sm rounded-sm flex items-center p-1 z-10 space-x-1">
            <button className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-600"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-[10px] font-mono px-2 font-bold text-stone-500">100%</span>
            <button className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-600"><ZoomIn className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-stone-300 mx-1"></div>
            <button className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-600"><Maximize className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div className="w-full max-w-lg aspect-[1/1.4] bg-white shadow-md border border-stone-300 flex flex-col relative">
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
                    <span className="absolute -inset-1 border-2 border-amber-500 bg-amber-500/10 z-10"></span>
                    <span className="relative z-0 px-2">25.0</span> 
                    एकड़ है।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Form */}
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
                  <div className="flex items-center text-[10px] font-mono font-bold">
                    <span className="text-stone-400 mr-2">CONF:</span>
                    <span className={`${field.status === 'high' ? 'text-green-600' : 'text-amber-600'}`}>
                      {field.confidence}%
                    </span>
                  </div>
                </div>

                {field.status === 'high' ? (
                  <div className="flex items-center w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm font-semibold text-stone-800 font-mono">{field.extracted}</span>
                  </div>
                ) : (
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