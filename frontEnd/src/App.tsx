import React, { useState, useCallback, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { Satellite, AlertTriangle, Radio, Radar, Waypoints, Timer, Thermometer, Wind, History, Orbit, Rocket, Gauge, ChevronRight } from 'lucide-react';

function App() {
  const globeRef = useRef();
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [missionTime, setMissionTime] = useState('000:00:00:00');
  const [satelliteCount] = useState(Math.floor(Math.random() * 5) + 8);
  const [systemStatus] = useState({
    signalStrength: Math.floor(Math.random() * 20) + 80,
    systemLoad: Math.floor(Math.random() * 30) + 70,
    temperature: Math.floor(Math.random() * 10) + 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      
      // Update mission time from March 29, 2024 00:00:00
      const start = new Date('2024-03-29T00:00:00Z').getTime();
      const now = new Date().getTime();
      const diff = now - start;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setMissionTime(`${days.toString().padStart(3, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) return;

    const newMarker = {
      lat,
      lng,
      size: 0.5,
      color: '#ff5733',
      timestamp: new Date().toISOString(),
      temperature: (Math.random() * 30 + 10).toFixed(1),
      windSpeed: (Math.random() * 20 + 5).toFixed(1),
      signalStrength: (Math.random() * 100).toFixed(0)
    };

    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);

    if (globeRef.current) {
      globeRef.current.pointOfView({
        lat,
        lng,
        altitude: 2.5
      }, 1000);
    }
  }, [latitude, longitude, markers]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const Stats = ({ icon: Icon, label, value, unit }) => (
    <div className="flex items-center gap-2 bg-[#1c2834] px-3 py-2 rounded border border-[#2d3f50]">
      <Icon className="h-4 w-4 text-[#4a9eff]" />
      <span className="text-[#8ba1b7] text-sm font-mono">{label}:</span>
      <span className="text-white font-mono">{value}{unit}</span>
    </div>
  );

  const SystemStat = ({ icon: Icon, value, label, status = 'normal' }) => {
    const getStatusColor = () => {
      switch(status) {
        case 'critical': return 'text-red-500';
        case 'warning': return 'text-yellow-500';
        default: return 'text-[#4a9eff]';
      }
    };

    return (
      <div className="bg-[#1c2834] p-3 rounded border border-[#2d3f50]">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${getStatusColor()}`} />
          <div className="font-mono">
            <div className="text-lg font-bold text-white">{value}</div>
            <div className="text-xs text-[#8ba1b7] uppercase tracking-wider">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1219] text-white">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-[#1c2834] border-b border-[#2d3f50]">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="h-6 w-6 text-[#4a9eff]" />
              <h1 className="text-lg font-bold font-mono text-white">MISSION CONTROL</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-sm font-mono">SYSTEM NOMINAL</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Timer className="h-4 w-4 text-[#4a9eff]" />
                <span className="text-white">{time} UTC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Left Side Panel - System Status */}
      <div className="absolute top-16 left-8 z-10 w-80">
        <div className="bg-[#1c2834] p-4 rounded border border-[#2d3f50] mb-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d3f50]">
            <Satellite className="h-5 w-5 text-[#4a9eff]" />
            <h2 className="text-lg font-mono">SYSTEM STATUS</h2>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-[#8ba1b7]">MISSION TIME</span>
              <span className="text-2xl font-mono text-[#4a9eff]">{missionTime}</span>
            </div>
            <SystemStat 
              icon={Orbit} 
              value={satelliteCount}
              label="SATELLITES"
              status={satelliteCount < 10 ? 'warning' : 'normal'}
            />
            <SystemStat 
              icon={Gauge} 
              value={`${systemStatus.systemLoad}%`}
              label="SYSTEM LOAD"
              status={systemStatus.systemLoad > 90 ? 'critical' : systemStatus.systemLoad > 75 ? 'warning' : 'normal'}
            />
            <SystemStat 
              icon={Radio} 
              value={`${systemStatus.signalStrength}%`}
              label="SIGNAL"
              status={systemStatus.signalStrength < 85 ? 'warning' : 'normal'}
            />
          </div>
        </div>

        {/* Coordinate History */}
        <div className="bg-[#1c2834] p-4 rounded border border-[#2d3f50]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d3f50]">
            <History className="h-5 w-5 text-[#4a9eff]" />
            <h2 className="text-lg font-mono">COORDINATE HISTORY</h2>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {markers.map((marker, index) => (
              <div
                key={index}
                className="bg-[#151f28] p-2 rounded border border-[#2d3f50] cursor-pointer hover:border-[#4a9eff] transition-colors"
                onClick={() => {
                  setSelectedMarker(marker);
                  globeRef.current?.pointOfView({
                    lat: marker.lat,
                    lng: marker.lng,
                    altitude: 2.5
                  }, 1000);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">
                    <div className="text-[#8ba1b7]">
                      {marker.lat.toFixed(2)}°, {marker.lng.toFixed(2)}°
                    </div>
                    <div className="text-xs text-[#4d6275]">
                      {new Date(marker.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#4a9eff]" />
                </div>
              </div>
            ))}
            {markers.length === 0 && (
              <div className="text-center py-4">
                <p className="text-[#8ba1b7] font-mono text-sm">NO COORDINATES RECORDED</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side Panel - Telemetry */}
      <div className="absolute top-16 right-8 z-10 w-80">
        <div className="bg-[#1c2834] p-4 rounded border border-[#2d3f50]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d3f50]">
            <Radar className="h-5 w-5 text-[#4a9eff]" />
            <h2 className="text-lg font-mono">TELEMETRY DATA</h2>
          </div>
          {selectedMarker ? (
            <div className="space-y-3">
              <Stats 
                icon={Waypoints} 
                label="COORDINATES" 
                value={`${selectedMarker.lat.toFixed(2)}°, ${selectedMarker.lng.toFixed(2)}°`} 
                unit=""
              />
              <Stats 
                icon={Thermometer} 
                label="TEMPERATURE" 
                value={selectedMarker.temperature} 
                unit="°C"
              />
              <Stats 
                icon={Wind} 
                label="WIND SPEED" 
                value={selectedMarker.windSpeed} 
                unit=" m/s"
              />
              <Stats 
                icon={Radio} 
                label="SIGNAL" 
                value={selectedMarker.signalStrength} 
                unit="%"
              />
            </div>
          ) : (
            <div className="text-center py-6">
              <Radar className="h-16 w-16 text-[#2d3f50] mx-auto mb-3" />
              <p className="text-[#8ba1b7] font-mono text-sm">NO ACTIVE TELEMETRY</p>
              <p className="text-[#4d6275] text-xs mt-1">ENTER COORDINATES TO BEGIN</p>
            </div>
          )}
        </div>
      </div>

      {/* Globe Container */}
      <div className="absolute inset-0">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={markers}
          pointAltitude={0.1}
          pointColor="color"
          pointRadius="size"
          pointsMerge={true}
          atmosphereColor="#4a9eff"
          atmosphereAltitude={0.25}
        />
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-[#1c2834] p-4 rounded border border-[#2d3f50]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-mono mb-1 text-[#8ba1b7]">
                  LATITUDE
                </label>
                <input
                  type="text"
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151f28] rounded border border-[#2d3f50] focus:border-[#4a9eff] focus:outline-none font-mono text-white"
                  placeholder="-90 to 90"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-mono mb-1 text-[#8ba1b7]">
                  LONGITUDE
                </label>
                <input
                  type="text"
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151f28] rounded border border-[#2d3f50] focus:border-[#4a9eff] focus:outline-none font-mono text-white"
                  placeholder="-180 to 180"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4a9eff] hover:bg-[#3a8eff] text-white font-mono py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <Radar className="h-4 w-4" />
              ANALYZE LOCATION
            </button>
          </form>

          {markers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#2d3f50]">
              <div className="flex items-center gap-2 text-yellow-500 font-mono">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">
                  {markers.length} ANOMALY ZONE{markers.length === 1 ? '' : 'S'} DETECTED
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;