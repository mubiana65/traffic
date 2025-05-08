import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface TrafficLightData {
  state: 'red' | 'yellow' | 'green' | 'all_red';
  group: 'NS' | 'EW';
  timestamp: number;
  counts?: {
    north: number;
    south: number;
    east: number;
    west: number;
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
  };
}

function SingleTrafficLight({ currentState, direction, counts }: SingleTrafficLightProps) {
  const getLightColor = (light: 'red' | 'yellow' | 'green') => {
    if (currentState === 'all_red') return 'bg-gray-700';
    return currentState === light ? `bg-${light}-500` : 'bg-gray-700';
  };

  const getGlowEffect = (light: 'red' | 'yellow' | 'green') => {
    if (currentState === 'all_red') return '';
    return currentState === light ? `shadow-${light}-500/50 shadow-lg` : '';
  };

  const getVehicleCount = (dir: 'north' | 'south' | 'east' | 'west') => {
    return counts?.[dir] || 0;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Traffic Light Housing */}
      <div className="relative w-32 h-80 bg-gray-900 rounded-2xl p-4 flex flex-col items-center">
        {/* Mounting Bracket */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-700 rounded-t-lg" />
        
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

      {/* Vehicle Counts */}
      {counts && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {direction === 'NS' ? (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-400">North</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('north')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">South</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('south')}</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-400">East</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('east')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">West</p>
                <p className="text-lg font-bold text-white">{getVehicleCount('west')}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrafficLightDisplay() {
  const [trafficData, setTrafficData] = useState<TrafficLightData>({
    state: 'red',
    group: 'NS',
    timestamp: Date.now()
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
          counts: data.counts
        });
        setLastUpdate(new Date());
      }
    }, (error) => {
      console.error('Error fetching traffic light data:', error);
    });

    return () => unsubscribe();
  }, []);

  // Determine which light should be active based on the current state and group
  const getNSState = () => {
    if (trafficData.state === 'all_red') return 'red';
    return trafficData.group === 'NS' ? trafficData.state : 'red';
  };

  const getEWState = () => {
    if (trafficData.state === 'all_red') return 'red';
    return trafficData.group === 'EW' ? trafficData.state : 'red';
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-6">Traffic Light Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* North/South Traffic Light */}
          <SingleTrafficLight
            currentState={getNSState()}
            direction="NS"
            counts={trafficData.counts}
          />

          {/* East/West Traffic Light */}
          <SingleTrafficLight
            currentState={getEWState()}
            direction="EW"
            counts={trafficData.counts}
          />
        </div>

        {/* Last Update Time */}
        <p className="text-sm text-gray-500 mt-6">
          Last Update: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
} 