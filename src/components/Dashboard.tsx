import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../firebase';
import { ref, onValue, update, set } from 'firebase/database';

import BoxDiagram from './BoxDiagram';
import TrafficDashboard from './TrafficDashboard';
import TrafficLightDisplay from './TrafficLightDisplay';



// Add new interface for green light durations
interface GreenLightDurations {
  northSouth: number;
  eastWest: number;
  lastChange: string;
}

// Mock data for demonstration
const mockStations = [
  { 
    id: 1, 
    name: 'Downtown Intersection', 
    status: 'operational', 
    trafficLevel: 'medium', 
    location: { lat: 40.7128, lng: -74.0060 },
    counts: {
      vehicles: { north: 45, south: 38, east: 52, west: 41 },
      pedestrians: { north: 12, south: 15, east: 8, west: 10 },
      waitTime: { north: 35, south: 42, east: 38, west: 40 }
    }
  },
  { 
    id: 2, 
    name: 'Westside Junction', 
    status: 'maintenance', 
    trafficLevel: 'low', 
    location: { lat: 40.7589, lng: -73.9851 },
    counts: {
      vehicles: { north: 25, south: 22, east: 28, west: 24 },
      pedestrians: { north: 8, south: 6, east: 9, west: 7 },
      waitTime: { north: 28, south: 32, east: 30, west: 29 }
    }
  },
  { 
    id: 3, 
    name: 'Eastside Crossing', 
    status: 'operational', 
    trafficLevel: 'high', 
    location: { lat: 40.7282, lng: -73.7949 },
    counts: {
      vehicles: { north: 65, south: 58, east: 72, west: 61 },
      pedestrians: { north: 18, south: 22, east: 15, west: 20 },
      waitTime: { north: 55, south: 62, east: 58, west: 60 }
    }
  },
  { 
    id: 4, 
    name: 'North Bridge', 
    status: 'operational', 
    trafficLevel: 'medium', 
    location: { lat: 40.7829, lng: -73.9654 },
    counts: {
      vehicles: { north: 42, south: 38, east: 45, west: 40 },
      pedestrians: { north: 10, south: 12, east: 9, west: 11 },
      waitTime: { north: 38, south: 42, east: 40, west: 39 }
    }
  },
];

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState(mockStations);

  const [currentLight] = useState<'red' | 'yellow' | 'green'>('green');
  const [manualOverride] = useState(false);
  const [greenLightDurations, setGreenLightDurations] = useState<GreenLightDurations>({
    northSouth: 0,
    eastWest: 0,
    lastChange: new Date().toISOString()
  });
 
  

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 60,
    network: 85,
    status: 'healthy'
  });
  const [trafficData] = useState<{
    state: string;
    group: 'NS' | 'EW';
    counts: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  } | null>(null);

  // Listen to traffic light status changes from Firebase
 

  // Listen to locations changes from Firebase
 

  // Initialize test data in Firebase if no locations exist
  useEffect(() => {
    const locationsRef = ref(database, 'trafficLight/locations');
    
    onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Add test locations if none exist
        const testLocations = {
          'loc1': {
            name: 'Downtown Intersection',
            address: '123 Main St, Lusaka',
            coordinates: {
              latitude: -15.4167,
              longitude: 28.2833
            },
            installationDate: '2024-02-01',
            status: 'operational',
            description: 'Main intersection near city center',
            createdAt: new Date().toISOString()
          },
          'loc2': {
            name: 'Westside Junction',
            address: '456 West Ave, Lusaka',
            coordinates: {
              latitude: -15.4267,
              longitude: 28.2733
            },
            installationDate: '2024-02-05',
            status: 'maintenance',
            description: 'Busy junction near shopping district',
            createdAt: new Date().toISOString()
          },
          'loc3': {
            name: 'Eastside Crossing',
            address: '789 East Rd, Lusaka',
            coordinates: {
              latitude: -15.4067,
              longitude: 28.2933
            },
            installationDate: '2024-02-10',
            status: 'operational',
            description: 'Major crossing near residential area',
            createdAt: new Date().toISOString()
          }
        };

        set(locationsRef, testLocations).catch(error => {
          console.error('Error initializing test data:', error);
        });
      }
    });
  }, []);

  // Update traffic light status in Firebase
  const updateTrafficLightStatus = async (newLight: 'red' | 'yellow' | 'green') => {
    try {
      const statusRef = ref(database, 'trafficLight/status');
      const now = new Date();
      
      // Calculate duration for the previous green light
      if (currentLight === 'green') {
        const lastChange = new Date(greenLightDurations.lastChange);
        const duration = Math.floor((now.getTime() - lastChange.getTime()) / 1000 / 60); // Convert to minutes
        
        // Determine which direction was green based on the current traffic data
        const isNorthSouth = trafficData?.group === 'NS';
        
        setGreenLightDurations(prev => ({
          ...prev,
          northSouth: isNorthSouth ? duration : prev.northSouth,
          eastWest: !isNorthSouth ? duration : prev.eastWest,
          lastChange: now.toISOString()
        }));
      }

      await update(statusRef, {
        currentLight: newLight,
        lastUpdate: now.toISOString(),
        mode: manualOverride ? 'manual' : 'automatic'
      });
    } catch (error) {
      console.error('Error updating traffic light status:', error);
    }
  };

  // Add effect to update durations in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLight === 'green') {
        const now = new Date();
        const lastChange = new Date(greenLightDurations.lastChange);
        const duration = Math.floor((now.getTime() - lastChange.getTime()) / 1000 / 60);
        
        const isNorthSouth = trafficData?.group === 'NS';
        
        setGreenLightDurations(prev => ({
          ...prev,
          northSouth: isNorthSouth ? duration : prev.northSouth,
          eastWest: !isNorthSouth ? duration : prev.eastWest
        }));
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [currentLight, greenLightDurations.lastChange, trafficData?.group]);

  // Simulate traffic light changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!manualOverride) {
        const newLight = currentLight === 'red' ? 'green' : 
                        currentLight === 'green' ? 'yellow' : 'red';
        updateTrafficLightStatus(newLight);
      }
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [currentLight, manualOverride]);

  // Handle manual override toggle


  // Handle manual light change


  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStations(prevStations => 
        prevStations.map(station => ({
          ...station,
          trafficLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          counts: {
            ...station.counts,
            vehicles: {
              north: Math.floor(Math.random() * 70) + 20,
              south: Math.floor(Math.random() * 70) + 20,
              east: Math.floor(Math.random() * 70) + 20,
              west: Math.floor(Math.random() * 70) + 20,
            },
            pedestrians: {
              north: Math.floor(Math.random() * 25) + 5,
              south: Math.floor(Math.random() * 25) + 5,
              east: Math.floor(Math.random() * 25) + 5,
              west: Math.floor(Math.random() * 25) + 5,
            }
          }
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate system health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(30, prev.memory + (Math.random() * 8 - 4))),
        network: Math.min(100, Math.max(50, prev.network + (Math.random() * 6 - 3))),
        status: prev.cpu > 80 || prev.memory > 90 ? 'warning' : 'healthy'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);





  const getTotalVehicles = (station: typeof mockStations[0]) => {
    return Object.values(station.counts.vehicles).reduce((a, b) => a + b, 0);
  };

  const getTotalPedestrians = (station: typeof mockStations[0]) => {
    return Object.values(station.counts.pedestrians).reduce((a, b) => a + b, 0);
  };

  const getAverageWaitTime = (station: typeof mockStations[0]) => {
    const times = Object.values(station.counts.waitTime);
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  const systemArchitecture = {
    title: "System Architecture",
    description: "Overview of the traffic management system components",
    boxes: [
      {
        title: "Frontend",
        description: "React-based user interface",
        icon: "🌐",
        color: "border-blue-500",
        children: (
          <>
            <div className="text-sm text-gray-400">• Dashboard</div>
            <div className="text-sm text-gray-400">• Analytics</div>
            <div className="text-sm text-gray-400">• System Control</div>
          </>
        )
      },
      {
        title: "Backend",
        description: "Node.js server and API",
        icon: "⚙️",
        color: "border-green-500",
        children: (
          <>
            <div className="text-sm text-gray-400">• REST API</div>
            <div className="text-sm text-gray-400">• WebSocket</div>
            <div className="text-sm text-gray-400">• Authentication</div>
          </>
        )
      },
      {
        title: "Database",
        description: "Firebase Realtime Database",
        icon: "🗄️",
        color: "border-yellow-500",
        children: (
          <>
            <div className="text-sm text-gray-400">• Traffic Data</div>
            <div className="text-sm text-gray-400">• User Data</div>
            <div className="text-sm text-gray-400">• System Logs</div>
          </>
        )
      }
    ]
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Logout */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">🚦 Smart Traffic Control</h1>
            <div className="hidden sm:flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm text-gray-400">System {systemHealth.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-400 hidden sm:block">
              Welcome, {currentUser?.email}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
              <AnimatePresence>
                {showLogoutConfirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl p-4 z-50"
                  >
                    <p className="text-white mb-4">Are you sure you want to logout? 👋</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleLogout}
                        className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
                      >
                        No
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* System Health Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💻</span>
              <h3 className="text-lg font-semibold text-white">CPU Usage</h3>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-blue-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${systemHealth.cpu}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{systemHealth.cpu.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧠</span>
              <h3 className="text-lg font-semibold text-white">Memory</h3>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-purple-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${systemHealth.memory}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{systemHealth.memory.toFixed(1)}%</p>
          </div>
        </motion.div>

        {/* Traffic Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <TrafficDashboard />
          </div>
          <div>
            <TrafficLightDisplay />
          </div>
        </motion.div>

        {/* System Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BoxDiagram {...systemArchitecture} />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Total Vehicles</h3>
                <p className="text-2xl font-bold text-blue-500">
                  {stations.reduce((sum, station) => sum + getTotalVehicles(station), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚶</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Pedestrians</h3>
                <p className="text-2xl font-bold text-purple-500">
                  {stations.reduce((sum, station) => sum + getTotalPedestrians(station), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Avg Wait Time</h3>
                <p className="text-2xl font-bold text-yellow-500">
                  {Math.round(stations.reduce((sum, station) => sum + getAverageWaitTime(station), 0) / stations.length)}s
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Active Stations</h3>
                <p className="text-2xl font-bold text-green-500">
                  {stations.filter(s => s.status === 'operational').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Update Green Light Duration Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⬆️⬇️</span>
              <div>
                <h3 className="text-lg font-semibold text-white">North-South Green Duration</h3>
                <p className="text-2xl font-bold text-green-500">
                  {greenLightDurations.northSouth} min
                </p>
                <p className="text-sm text-gray-400">
                  Last changed: {new Date(greenLightDurations.lastChange).toLocaleTimeString()}
                </p>
                {trafficData?.group === 'NS' && currentLight === 'green' && (
                  <p className="text-sm text-green-400 mt-1">Currently Active</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⬅️➡️</span>
              <div>
                <h3 className="text-lg font-semibold text-white">East-West Green Duration</h3>
                <p className="text-2xl font-bold text-green-500">
                  {greenLightDurations.eastWest} min
                </p>
                <p className="text-sm text-gray-400">
                  Last changed: {new Date(greenLightDurations.lastChange).toLocaleTimeString()}
                </p>
                {trafficData?.group === 'EW' && currentLight === 'green' && (
                  <p className="text-sm text-green-400 mt-1">Currently Active</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 