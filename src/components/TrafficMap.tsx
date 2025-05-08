import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: 'operational' | 'maintenance' | 'offline';
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const TrafficMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: -15.4167, lng: 28.2833 }, // Lusaka coordinates
        zoom: 12,
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [{ invert_lightness: true }, { saturation: 10 }, { lightness: 30 }, { gamma: 0.5 }, { hue: '#00ffee' }]
          }
        ]
      });
      setMap(newMap);
    }
  };

  // Listen to locations changes from Firebase
  useEffect(() => {
    const locationsRef = ref(database, 'trafficLight/locations');
    
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locationsArray = Object.entries(data).map(([id, location]: [string, any]) => ({
          id,
          ...location
        }));
        setLocations(locationsArray);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    const markers = map.markers || [];
    markers.forEach((marker: any) => marker.setMap(null));

    // Add new markers
    const newMarkers = locations.map(location => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: location.coordinates.latitude,
          lng: location.coordinates.longitude
        },
        map,
        title: location.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: getStatusColor(location.status),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        setSelectedLocation(location.id);
      });

      return marker;
    });

    // Store markers in map object
    map.markers = newMarkers;
  }, [map, locations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#22c55e'; // green-500
      case 'maintenance': return '#eab308'; // yellow-500
      case 'offline': return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Traffic Map</h3>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Operational</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-400">Maintenance</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-400">Offline</span>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="h-full bg-gray-700 rounded-lg" />
      
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 right-8 bg-gray-800 rounded-lg p-4 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold">
                {locations.find(loc => loc.id === selectedLocation)?.name}
              </h4>
              <p className="text-sm text-gray-400">
                {locations.find(loc => loc.id === selectedLocation)?.address}
              </p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrafficMap; 