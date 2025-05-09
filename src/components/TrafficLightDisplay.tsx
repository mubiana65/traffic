import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface TrafficLightData {
  state: 'red' | 'yellow' | 'green' | 'all_red';
  group: 'NS' | 'EW';
  timestamp: number;
  emergencyMode?: boolean;
  pedestrianSignal?: {
    NS: 'walk' | 'dont_walk' | 'flashing';
    EW: 'walk' | 'dont_walk' | 'flashing';
  };
  counts?: {
    north: number;
    south: number;
    east: number;
    west: number;
    pedestrians?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  systemStatus?: {
    mode: 'automatic' | 'manual' | 'emergency';
    lastMaintenance: string;
    nextMaintenance: string;
    batteryLevel: number;
  };
}

interface SingleTrafficLightProps {
  currentState: 'red' | 'yellow' | 'green' | 'all_red';
  direction: 'NS' | 'EW';
  counts?: {
    north?: number;
    south?: number;
    east?: number;
    west?: number;
    pedestrians?: {
      north?: number;
      south?: number;
      east?: number;
      west?: number;
    };
  };
  pedestrianSignal?: 'walk' | 'dont_walk' | 'flashing';
  emergencyMode?: boolean;
}

function PedestrianSignal({ state }: { state: 'walk' | 'dont_walk' | 'flashing' }) {
  return (
    <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 rounded-lg p-2">
      <div className="flex flex-col gap-2">
        <div className={`w-4 h-4 rounded-full ${state === 'walk' ? 'bg-green-500' : 'bg-gray-700'}`} />
        <div className={`w-4 h-4 rounded-full ${state === 'dont_walk' ? 'bg-red-500' : 'bg-gray-700'}`} />
        {state === 'flashing' && (
          <motion.div
            className="w-4 h-4 rounded-full bg-yellow-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}

function SingleTrafficLight({ currentState, direction, counts, pedestrianSignal, emergencyMode }: SingleTrafficLightProps) {
  const getLightColor = (light: 'red' | 'yellow' | 'green') => {
    if (currentState === 'all_red' || emergencyMode) return 'bg-gray-700';
    return currentState === light ? `bg-${light}-500` : 'bg-gray-700';
  };

  const getGlowEffect = (light: 'red' | 'yellow' | 'green') => {
    if (currentState === 'all_red' || emergencyMode) return '';
    return currentState === light ? `shadow-${light}-500/50 shadow-lg` : '';
  };

  const getVehicleCount = (dir: 'north' | 'south' | 'east' | 'west') => {
    return counts?.[dir] || 0;
  };

  const getPedestrianCount = (dir: 'north' | 'south' | 'east' | 'west') => {
    return counts?.pedestrians?.[dir] || 0;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Traffic Light Housing */}
      <div className="relative w-32 h-80 bg-gray-900 rounded-2xl p-4 flex flex-col items-center">
        {/* Mounting Bracket */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-700 rounded-t-lg" />
        
        {/* Emergency Mode Indicator */}
        {emergencyMode && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-600 px-4 py-2 rounded-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-white font-bold text-sm">EMERGENCY</span>
          </motion.div>
        )}
        
        {/* Lights Container */}
        <div className="w-full h-full flex flex-col justify-between py-6">
          {/* Red Light */}
          <motion.div
            className={`w-20 h-20 rounded-full ${getLightColor('red')} ${getGlowEffect('red')} transition-all duration-300`}
            animate={{
              scale: currentState === 'red' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: currentState === 'red' ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full rounded-full bg-black/20" />
          </motion.div>

          {/* Yellow Light */}
          <motion.div
            className={`w-20 h-20 rounded-full ${getLightColor('yellow')} ${getGlowEffect('yellow')} transition-all duration-300`}
            animate={{
              scale: currentState === 'yellow' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: currentState === 'yellow' ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full rounded-full bg-black/20" />
          </motion.div>

          {/* Green Light */}
          <motion.div
            className={`w-20 h-20 rounded-full ${getLightColor('green')} ${getGlowEffect('green')} transition-all duration-300`}
            animate={{
              scale: currentState === 'green' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: currentState === 'green' ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full rounded-full bg-black/20" />
          </motion.div>
        </div>

        {/* Direction Indicator */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-700 px-4 py-2 rounded-lg">
          <span className="text-white font-semibold">{direction}</span>
        </div>

        {/* Pedestrian Signal */}
        {pedestrianSignal && <PedestrianSignal state={pedestrianSignal} />}
      </div>

      {/* Status Text */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          {currentState === 'all_red' ? 'All Red' : currentState.toUpperCase()}
        </h3>
        <p className="text-gray-400">
          {direction === 'NS' ? 'North/South' : 'East/West'} Direction
        </p>
      </div>

      {/* Vehicle and Pedestrian Counts */}
      {counts && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {direction === 'NS' ? (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-400">North</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('north')}</p>
                <p className="text-xs text-gray-500">Ped: {getPedestrianCount('north')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">South</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('south')}</p>
                <p className="text-xs text-gray-500">Ped: {getPedestrianCount('south')}</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-400">East</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('east')}</p>
                <p className="text-xs text-gray-500">Ped: {getPedestrianCount('east')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">West</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('west')}</p>
                <p className="text-xs text-gray-500">Ped: {getPedestrianCount('west')}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SystemStatusPanel({ status }: { status?: TrafficLightData['systemStatus'] }) {
  if (!status) return null;

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Mode</p>
          <p className="text-white font-medium capitalize">{status.mode}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Battery Level</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
            <motion.div
              className={`h-2.5 rounded-full ${status.batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${status.batteryLevel}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-white text-sm mt-1">{status.batteryLevel}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Last Maintenance</p>
          <p className="text-white text-sm">{new Date(status.lastMaintenance).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Next Maintenance</p>
          <p className="text-white text-sm">{new Date(status.nextMaintenance).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function TrafficLightDisplay() {
  const [trafficData, setTrafficData] = useState<TrafficLightData>({
    state: 'red',
    group: 'NS',
    timestamp: Date.now(),
    emergencyMode: false,
    pedestrianSignal: {
      NS: 'dont_walk',
      EW: 'dont_walk'
    },
    systemStatus: {
      mode: 'automatic',
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      batteryLevel: 85
    }
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const trafficRef = ref(database, 'traffic');
    
    const unsubscribe = onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTrafficData({
          state: data.state || 'red',
          group: data.group || 'NS',
          timestamp: data.timestamp || Date.now(),
          emergencyMode: data.emergencyMode || false,
          pedestrianSignal: data.pedestrianSignal || {
            NS: 'dont_walk',
            EW: 'dont_walk'
          },
          counts: data.counts,
          systemStatus: data.systemStatus || {
            mode: 'automatic',
            lastMaintenance: new Date().toISOString(),
            nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            batteryLevel: 85
          }
        });
        setLastUpdate(new Date());
      }
    }, (error) => {
      console.error('Error fetching traffic light data:', error);
    });

    return () => unsubscribe();
  }, []);

  const getNSState = () => {
    if (trafficData.state === 'all_red' || trafficData.emergencyMode) return 'red';
    return trafficData.group === 'NS' ? trafficData.state : 'red';
  };

  const getEWState = () => {
    if (trafficData.state === 'all_red' || trafficData.emergencyMode) return 'red';
    return trafficData.group === 'EW' ? trafficData.state : 'red';
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Traffic Light Status</h2>
          {trafficData.emergencyMode && (
            <motion.div
              className="bg-red-600 px-4 py-2 rounded-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-white font-bold">EMERGENCY MODE</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* North/South Traffic Light */}
          <SingleTrafficLight
            currentState={getNSState()}
            direction="NS"
            counts={trafficData.counts}
            pedestrianSignal={trafficData.pedestrianSignal?.NS}
            emergencyMode={trafficData.emergencyMode}
          />

          {/* East/West Traffic Light */}
          <SingleTrafficLight
            currentState={getEWState()}
            direction="EW"
            counts={trafficData.counts}
            pedestrianSignal={trafficData.pedestrianSignal?.EW}
            emergencyMode={trafficData.emergencyMode}
          />
        </div>

        {/* System Status Panel */}
        <SystemStatusPanel status={trafficData.systemStatus} />

        {/* Last Update Time */}
        <p className="text-sm text-gray-500 mt-6">
          Last Update: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
} 