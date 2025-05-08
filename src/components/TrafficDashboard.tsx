import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { motion } from 'framer-motion';

interface TrafficData {
  state: string;
  group: string;
  counts: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  timestamp: number;
}

interface LightState {
  color: string;
  label: string;
}

const lightStates: Record<string, LightState> = {
  green: { color: 'bg-green-500', label: 'Green' },
  yellow: { color: 'bg-yellow-500', label: 'Yellow' },
  red: { color: 'bg-red-500', label: 'Red' },
  all_red: { color: 'bg-red-700', label: 'All Red' }
};

export default function TrafficDashboard() {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const trafficRef = ref(database, 'traffic');
    const unsubscribe = onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTrafficData(data);
        setLastUpdate(new Date());
      }
    });

    return () => unsubscribe();
  }, []);

  const getTotalVehicles = (direction: 'NS' | 'EW') => {
    if (!trafficData) return 0;
    return direction === 'NS' 
      ? trafficData.counts.north + trafficData.counts.south
      : trafficData.counts.east + trafficData.counts.west;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-white">Traffic Control Dashboard</h3>
        <div className="text-sm text-gray-400">
          Last Update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {trafficData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current State Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Current State</h4>
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${lightStates[trafficData.state].color}`} />
              <span className="text-white">{lightStates[trafficData.state].label}</span>
            </div>
            <div className="mt-2 text-gray-400">
              Active Group: {trafficData.group}
            </div>
          </motion.div>

          {/* Vehicle Counts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Vehicle Counts</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">North/South</div>
                <div className="text-2xl font-bold text-white">
                  {getTotalVehicles('NS')}
                </div>
                <div className="text-xs text-gray-500">
                  N: {trafficData.counts.north} | S: {trafficData.counts.south}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">East/West</div>
                <div className="text-2xl font-bold text-white">
                  {getTotalVehicles('EW')}
                </div>
                <div className="text-xs text-gray-500">
                  E: {trafficData.counts.east} | W: {trafficData.counts.west}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Traffic Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-gray-700 rounded-lg p-4"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Traffic Flow</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">North</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((trafficData.counts.north / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white">{trafficData.counts.north}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">South</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((trafficData.counts.south / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white">{trafficData.counts.south}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">East</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((trafficData.counts.east / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white">{trafficData.counts.east}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">West</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((trafficData.counts.west / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white">{trafficData.counts.west}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 