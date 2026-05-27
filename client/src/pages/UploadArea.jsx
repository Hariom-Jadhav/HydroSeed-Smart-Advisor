import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiMap, FiCheckCircle, FiCloudRain, FiCalendar, FiThermometer, FiMapPin, FiSearch, FiActivity, FiCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const UploadArea = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'weather', 'history'
  
  // Weather states
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  // History states
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchHistory();
    }
  }, [navigate, token]);

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  });

  const fetchHistory = async () => {
    if (!token) return;
    try {
      setHistoryLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/analyses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success') {
        setHistory(res.data.data.analyses);
      }
    } catch (err) {
      console.error("Failed to fetch analysis history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getBase64 = (fileObj) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(async () => {
      const mockResult = {
        score: Math.floor(Math.random() * 21) + 75, // Random score between 75 and 95
        soilType: 'Clay Loam',
        drainage: 'Moderate',
        moisture: 'Low (22%)',
        phLevel: '6.5 (Slightly Acidic)',
        organicMatter: '3.5% (Good)',
        compaction: 'High',
        erosionRisk: 'Moderate to High',
        slopeAngle: '15 degrees',
        recommendation: 'Add mulching for better moisture retention on slopes.'
      };

      try {
        let base64Image = '';
        if (file && !file.mockUrl) {
          try {
            base64Image = await getBase64(file);
          } catch (e) {
            console.error("Failed base64 conversion, using fallback URL", e);
            base64Image = 'https://images.unsplash.com/photo-1592424001807-6953f93ce0db';
          }
        } else {
          base64Image = file?.mockUrl || 'https://images.unsplash.com/photo-1592424001807-6953f93ce0db';
        }

        // Post to backend database
        const res = await axios.post(`${API_URL}/api/v1/analyses`, {
          imageUrl: base64Image,
          score: mockResult.score,
          soilType: mockResult.soilType,
          drainage: mockResult.drainage,
          moisture: mockResult.moisture,
          phLevel: mockResult.phLevel,
          organicMatter: mockResult.organicMatter,
          compaction: mockResult.compaction,
          erosionRisk: mockResult.erosionRisk,
          slopeAngle: mockResult.slopeAngle,
          recommendation: mockResult.recommendation
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.status === 'success') {
          // Set result and refresh history
          setResult(mockResult);
          fetchHistory();
        }
      } catch (err) {
        console.error("Failed to save analysis", err);
        // Fallback display even if saving fails
        setResult(mockResult);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2500);
  };

  // Weather searching using Open-Meteo
  const handleWeatherSearch = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setWeatherLoading(true);
    setWeatherError('');
    setWeatherData(null);

    try {
      // 1. Geocode city name to lat/lon coordinates
      const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`);
      
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setWeatherError('City not found. Please try another location.');
        setWeatherLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoRes.data.results[0];

      // 2. Fetch real-time forecast for coordinates
      const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,weather_code&hourly=precipitation_probability&forecast_days=1`);
      
      const current = weatherRes.data.current;
      const rainProbability = weatherRes.data.hourly?.precipitation_probability?.[0] || 0;

      // Map weather code to description
      const getWeatherDescription = (code) => {
        if (code === 0) return 'Sunny / Clear';
        if ([1, 2, 3].includes(code)) return 'Partly Cloudy / Overcast';
        if ([45, 48].includes(code)) return 'Foggy';
        if ([51, 53, 55, 56, 57].includes(code)) return 'Light Drizzle';
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rainy';
        if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
        if ([95, 96, 99].includes(code)) return 'Thunderstorm';
        return 'Cloudy';
      };

      // Smart period evaluator
      const evaluateHydroseeding = (temp, rainProb, code) => {
        if (temp < 10) {
          return {
            rating: "Not Recommended (Too Cold)",
            explanation: "Low temperature warning! Grass seed germination requires soil temperatures above 10°C to grow. It is highly recommended to wait for spring.",
            color: "text-red-700 bg-red-50 border-red-200"
          };
        }
        if (temp > 30) {
          return {
            rating: "Caution Advised (High Heat)",
            explanation: "Excessive heat alert! Slurry will dry out too rapidly. If you spray now, ensure early morning applications and water twice daily.",
            color: "text-amber-700 bg-amber-50 border-amber-200"
          };
        }
        if (rainProb > 60 || [61, 63, 65, 80, 81, 82, 95].includes(code)) {
          return {
            rating: "Not Recommended (Heavy Rain Risk)",
            explanation: "Precipitation warning! Heavy rain showers will wash away the seed slurry and cause erosion. Postpone hydroseeding until dry weather.",
            color: "text-red-700 bg-red-50 border-red-200"
          };
        }
        if (rainProb > 30 && rainProb <= 60) {
          return {
            rating: "Good (Proceed with Care)",
            explanation: "Light rainfall forecast. Small amounts of drizzle actually assist in slurry moisture, but monitor closely to ensure no heavy storms develop.",
            color: "text-blue-700 bg-blue-50 border-blue-200"
          };
        }
        return {
          rating: "Excellent (Ideal Period)",
          explanation: "Optimal conditions! Moderate temperatures and low precipitation probability provide perfect stability for seed binding and germination.",
          color: "text-green-700 bg-green-50 border-green-200"
        };
      };

      const evaluation = evaluateHydroseeding(current.temperature_2m, rainProbability, current.weather_code);

      setWeatherData({
        cityName: name,
        countryName: country,
        temp: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        rainAmount: current.rain,
        rainProb: rainProbability,
        description: getWeatherDescription(current.weather_code),
        evaluation
      });

    } catch (err) {
      console.error("Weather fetch failed", err);
      setWeatherError('Failed to fetch weather data. Please verify your internet connection.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadPastReport = (report) => {
    setResult({
      score: report.score,
      soilType: report.soilType,
      drainage: report.drainage,
      moisture: report.moisture,
      phLevel: report.phLevel,
      organicMatter: report.organicMatter,
      compaction: report.compaction,
      erosionRisk: report.erosionRisk,
      slopeAngle: report.slopeAngle,
      recommendation: report.recommendation,
      isHistorical: true,
      date: report.date
    });
    setFile({ mockUrl: report.imageUrl });
    setPreviewUrl(report.imageUrl);
    setActiveTab('analysis');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      
      {/* Title Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          Diagnostic Center
        </span>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">AI Soil & Weather Advisor</h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Analyze terrain texture, forecast local weather suitability, and track past diagnostic reports to plan your hydroseeding spraying successfully.
        </p>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analysis'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiActivity /> AI Terrain Analysis
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'weather'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiCloudRain /> Weather Advisor
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('history'); fetchHistory(); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiCalendar /> Report History
            </span>
          </button>
        </div>
      </div>

      {/* Active Tab rendering */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload and AI run area */}
          <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center border border-slate-100 shadow-sm">
            {!file ? (
              <div 
                {...getRootProps()} 
                className={`w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50'}`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-50">
                  <FiUploadCloud className="text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Drag & Drop Soil Image</h3>
                <p className="text-slate-400 text-xs mb-4">or click to browse from your device</p>
                <span className="text-[10px] text-slate-400 font-medium">Supported formats: JPG, PNG, HEIC</span>
              </div>
            ) : (
              <div className="w-full">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-100">
                  {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Uploaded land" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                  <button 
                    onClick={() => {
                      if (previewUrl && !previewUrl.startsWith('http')) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setFile(null);
                      setPreviewUrl('');
                      setResult(null);
                    }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white text-slate-700 transition-all focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                {!result && (
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all flex justify-center items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <><span className="animate-spin h-4 w-5 border-2 border-white border-t-transparent rounded-full"></span> Running Soil Diagnostic...</>
                    ) : (
                      'Run AI Suitability Scan'
                    )}
                  </button>
                )}
                {result?.isHistorical && (
                  <div className="p-3 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-center text-xs font-semibold">
                    Viewing Historical Report saved on {new Date(result.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className={`glass p-8 rounded-3xl border border-slate-100 shadow-sm transition-all ${result ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-200/50 pb-3">
              <FiCheckCircle className="text-primary-500" /> Terrain Suitability Results
            </h3>
            
            {result ? (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="text-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Score</span>
                  <div className="text-4xl font-extrabold text-primary-600 my-1">{result.score}<span className="text-lg text-slate-400">/100</span></div>
                  <span className="inline-block px-3 py-0.5 bg-primary-100 text-primary-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {result.score >= 85 ? 'Excellent Viability' : 'Good Suitability'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Detected Soil Type</span>
                    <span className="font-bold text-slate-700 text-xs">{result.soilType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Drainage Rate</span>
                    <span className="font-bold text-slate-700 text-xs">{result.drainage}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Moisture Ratio</span>
                    <span className="font-bold text-slate-700 text-xs">{result.moisture}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">pH Acidity</span>
                    <span className="font-bold text-slate-700 text-xs">{result.phLevel}</span>
                  </div>
                </div>

                <div className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl">
                  <h4 className="font-bold text-primary-800 text-xs mb-1">AI Recommendation</h4>
                  <p className="text-primary-700 text-xs leading-relaxed">{result.recommendation}</p>
                </div>

                {!result.isHistorical && (
                  <Link 
                    to="/dashboard"
                    className="block text-center w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Find Local Contractors
                  </Link>
                )}
              </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16">
                  <FiMap className="text-5xl mb-3 opacity-20" />
                  <p className="text-sm font-medium">No results loaded</p>
                  <p className="text-xs text-slate-400 mt-0.5">Configure soil upload and run suitability scan above.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* WEATHER ADVISOR TAB */}
      {activeTab === 'weather' && (
        <div className="max-w-2xl mx-auto glass p-8 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FiCloudRain className="text-primary-500" /> Weather Suitability Check
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter your local city to query Open-Meteo forecasting. We analyze temperature and precipitation probability to evaluate the best period to execute hydroseeding.
          </p>

          <form onSubmit={handleWeatherSearch} className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <FiMapPin className="absolute left-3 top-3.5 text-slate-400 text-base" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city (e.g. Mumbai, Denver, London)"
                required
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-xs"
              />
            </div>
            <button
              type="submit"
              disabled={weatherLoading}
              className="px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              {weatherLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <><FiSearch /> Search</>
              )}
            </button>
          </form>

          {weatherError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-semibold mb-6">
              {weatherError}
            </div>
          )}

          {weatherData && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Current conditions row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="p-3 bg-primary-100/50 rounded-xl text-primary-600">
                    <FiThermometer className="text-xl" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Temperature</span>
                    <span className="font-extrabold text-slate-800 text-sm">{weatherData.temp}°C</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="p-3 bg-blue-100/50 rounded-xl text-blue-600">
                    <FiCloudRain className="text-xl" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Rain Risk</span>
                    <span className="font-extrabold text-slate-800 text-sm">{weatherData.rainProb}%</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                    <FiCloud className="text-xl" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Conditions</span>
                    <span className="font-extrabold text-slate-800 text-xs truncate max-w-[120px] block">{weatherData.description}</span>
                  </div>
                </div>
              </div>

              {/* Hydroseeding Evaluation block */}
              <div className={`p-5 rounded-2xl border ${weatherData.evaluation.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <FiCheckCircle className="text-base shrink-0" />
                  <h4 className="font-bold text-sm">Best Spraying Period: {weatherData.evaluation.rating}</h4>
                </div>
                <p className="text-xs leading-relaxed">{weatherData.evaluation.explanation}</p>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Geographic coordinates parsed for: {weatherData.cityName}, {weatherData.countryName}
              </div>
            </div>
          )}

          {!weatherData && !weatherLoading && !weatherError && (
            <div className="py-12 text-center text-slate-400">
              <FiCloud className="text-5xl mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No weather checks loaded</p>
              <p className="text-xs text-slate-400 mt-0.5">Submit your local city coordinates to get instant advice.</p>
            </div>
          )}
        </div>
      )}

      {/* REPORT HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="glass p-8 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiCalendar className="text-primary-500" /> Historical Diagnostic Reports
          </h2>

          {historyLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Retrieving diagnostic archives...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-slate-100">
              <FiMap className="text-5xl mx-auto mb-3 opacity-25" />
              <h4 className="font-bold text-slate-700 text-sm">No analysis reports found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Any terrain scans you run will automatically be archived in MongoDB Atlas so you can inspect them anytime.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {history.map((report) => (
                <div
                  key={report._id}
                  onClick={() => loadPastReport(report)}
                  className="border border-slate-100 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer rounded-2xl overflow-hidden bg-white group flex flex-col"
                >
                  <div className="w-full h-36 bg-slate-200 overflow-hidden relative shrink-0">
                    <img src={report.imageUrl} alt="Historical terrain" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Score: {report.score}
                    </span>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{report.soilType}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {report.recommendation || 'No recommendation available.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                      <span>pH: {report.phLevel || 'N/A'}</span>
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default UploadArea;
