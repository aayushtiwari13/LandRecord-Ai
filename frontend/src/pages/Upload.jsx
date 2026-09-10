import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { uploadDocumentApi, extractDocumentApi } from '../services/api';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(''); // 'Uploading...' ya 'AI Extracting...'
  
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a PDF, JPG, or PNG.");
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // REAL API PIPELINE CALL
  const handleProcessDocument = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Upload file to backend
      setUploadStage("Uploading document...");
      const uploadRes = await uploadDocumentApi(file);
      const docId = uploadRes.document_id;

      // Step 2: Trigger AI extraction
      setUploadStage("Extracting land data via AI...");
      await extractDocumentApi(docId);

      // Step 3: Redirect to dashboard or details
      setIsUploading(false);
      navigate('/dashboard');
    } catch (err) {
      setIsUploading(false);
      setError(err.message || "Failed to process document. Make sure you are logged in!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3E2723]">Upload Land Record</h1>
        <p className="text-sm text-[#5D4037] mt-1">Ingest legacy documents for AI-powered digitization.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-100">
        
        {!file ? (
          <div 
            className={`relative border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors ${
              dragActive ? "border-orange-500 bg-orange-50/50" : "border-gray-300 hover:border-orange-400 bg-gray-50/30"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              accept=".pdf, .jpg, .jpeg, .png" 
              onChange={handleChange}
            />
            
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-orange-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-[#3E2723] mb-1">Drag & Drop Document</h3>
            <p className="text-sm text-[#5D4037] mb-6">or</p>
            
            <button 
              onClick={onButtonClick}
              className="px-6 py-2.5 bg-white border border-orange-200 text-orange-700 font-semibold rounded-lg hover:bg-orange-50 transition-colors shadow-sm"
            >
              Browse Files
            </button>
            
            <p className="text-xs text-gray-400 mt-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
          </div>
        ) : (
          <div className="border border-orange-200 rounded-lg p-6 bg-orange-50/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                  <File className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3E2723] truncate max-w-xs">{file.name}</h4>
                  <p className="text-xs text-[#5D4037]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={removeFile} className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors" disabled={isUploading}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleProcessDocument}
                disabled={isUploading}
                className={`px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center ${
                  isUploading ? "bg-orange-400 cursor-not-allowed" : "bg-[#3E2723] hover:bg-[#2D1B15] hover:-translate-y-0.5"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploadStage || "Processing..."}
                  </>
                ) : (
                  <>
                    Process Document <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}