import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiMap, FiCheckCircle } from 'react-icons/fi';

const UploadArea = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        score: 84,
        soilType: 'Clay Loam',
        drainage: 'Moderate',
        recommendation: 'Add mulching for better moisture retention on slopes.'
      });
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Land Suitability Analysis</h1>
        <p className="text-lg text-slate-600">Upload a photo of your soil/terrain, and our AI will estimate hydroseeding viability instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Column */}
        <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center">
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUploadCloud className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Drag & Drop Image Here</h3>
              <p className="text-slate-500 mb-4">or click to browse from your device</p>
              <span className="text-xs text-slate-400">Supported formats: JPG, PNG, HEIC</span>
            </div>
          ) : (
            <div className="w-full">
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6 shadow-md">
                <img src={URL.createObjectURL(file)} alt="Uploaded land" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setFile(null); setResult(null); }}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white text-slate-700"
                >
                  ✕
                </button>
              </div>
              {!result && (
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all flex justify-center items-center gap-2"
                >
                  {isAnalyzing ? (
                    <><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> Analyzing Terrain...</>
                  ) : (
                    'Run AI Analysis'
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className={`glass p-8 rounded-3xl transition-opacity duration-500 ${result ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiCheckCircle className="text-primary-500" /> Analysis Results
          </h3>
          
          {result ? (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Suitability Score</span>
                <div className="text-5xl font-black text-primary-600 my-2">{result.score}<span className="text-2xl text-slate-400">/100</span></div>
                <p className="text-green-600 font-medium bg-green-100 inline-block px-3 py-1 rounded-full text-sm">Highly Suitable</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">Detected Soil Type</span>
                  <span className="font-bold text-slate-800">{result.soilType}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">Drainage Estimate</span>
                  <span className="font-bold text-slate-800">{result.drainage}</span>
                </div>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-800 mb-2">AI Recommendation</h4>
                <p className="text-blue-700 text-sm leading-relaxed">{result.recommendation}</p>
              </div>

              <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-md transition-all">
                Find Contractors for this Land
              </button>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <FiMap className="text-6xl mb-4 opacity-20" />
                <p>Upload an image and run analysis to see insights here.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UploadArea;
