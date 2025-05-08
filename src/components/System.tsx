import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { database } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

export default function System() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    camera: 'offline',
    yolo: 'offline',
    mode: 'automatic'
  });
  const [events, setEvents] = useState<Array<{ timestamp: string; message: string }>>([]);

  // Listen to system status changes
  useEffect(() => {
    const statusRef = ref(database, 'trafficLight/system');
    
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSystemStatus(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Add event to log
  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [...prev, { timestamp, message }].slice(-10)); // Keep last 10 events
  };

  // Handle camera toggle
  const handleCameraToggle = async () => {
    const newStatus = !cameraActive;
    setCameraActive(newStatus);
    addEvent(`Camera ${newStatus ? 'activated' : 'deactivated'}`);
    
    try {
      const statusRef = ref(database, 'trafficLight/system');
      await update(statusRef, {
        camera: newStatus ? 'online' : 'offline'
      });
    } catch (error) {
      console.error('Error updating camera status:', error);
    }
  };

  // Handle simulation toggle
  const handleSimulationToggle = () => {
    setIsSimulating(!isSimulating);
    addEvent(`Simulation mode ${!isSimulating ? 'activated' : 'deactivated'}`);
  };

  // Handle emergency mode
  const handleEmergencyMode = async () => {
    try {
      const statusRef = ref(database, 'trafficLight/system');
      await update(statusRef, {
        mode: 'emergency'
      });
      addEvent('Emergency mode activated');
    } catch (error) {
      console.error('Error activating emergency mode:', error);
    }
  };

  // Handle reset
  const handleReset = async () => {
    try {
      const statusRef = ref(database, 'trafficLight/system');
      await update(statusRef, {
        mode: 'automatic',
        camera: 'offline',
        yolo: 'offline'
      });
      setCameraActive(false);
      setIsSimulating(false);
      addEvent('System reset to default state');
    } catch (error) {
      console.error('Error resetting system:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Control</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Camera Input</h2>
                <button
                  onClick={handleCameraToggle}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    cameraActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {cameraActive ? 'Stop Camera' : 'Start Camera'}
                </button>
              </div>
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                {cameraActive ? (
                  <p className="text-gray-400">Camera Feed</p>
                ) : (
                  <p className="text-gray-400">Camera Offline</p>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">YOLO Detection Output</h2>
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Detection Results</p>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Simulation Mode</span>
                  <button
                    onClick={handleSimulationToggle}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isSimulating ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                  </button>
                </div>

                <button
                  onClick={handleEmergencyMode}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Activate Emergency Mode
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Reset System
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Camera Status</span>
                  <span className={`px-2 py-1 rounded ${
                    systemStatus.camera === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {systemStatus.camera.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">YOLO Detection</span>
                  <span className={`px-2 py-1 rounded ${
                    systemStatus.yolo === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {systemStatus.yolo.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">System Mode</span>
                  <span className="px-2 py-1 rounded bg-blue-500">
                    {systemStatus.mode.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.map((event, index) => (
                  <p key={index} className="text-sm text-gray-400">
                    [{event.timestamp}] {event.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 