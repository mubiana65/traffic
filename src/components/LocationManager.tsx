import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { database } from '../firebase';
import { ref, push, set, remove, onValue } from 'firebase/database';

interface Location {
  id?: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  installationDate: string;
  status: 'operational' | 'maintenance' | 'offline';
  description: string;
}

export default function LocationManager() {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<Omit<Location, 'id'>>({
    name: '',
    address: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    installationDate: new Date().toISOString().split('T')[0],
    status: 'operational',
    description: ''
  });
  const [locations, setLocations] = useState<Location[]>([]);

  // Fetch locations from Firebase
  React.useEffect(() => {
    const locationsRef = ref(database, 'trafficLight/locations');
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locationsArray = Object.entries(data).map(([id, location]: [string, any]) => ({
          id,
          ...location
        }));
        setLocations(locationsArray);
      } else {
        setLocations([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const locationsRef = ref(database, 'trafficLight/locations');
      const newLocationRef = push(locationsRef);
      await set(newLocationRef, {
        ...newLocation,
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      setNewLocation({
        name: '',
        address: '',
        coordinates: {
          latitude: 0,
          longitude: 0
        },
        installationDate: new Date().toISOString().split('T')[0],
        status: 'operational',
        description: ''
      });
      setIsAddingLocation(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'latitude' || name === 'longitude') {
      setNewLocation(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parseFloat(value)
        }
      }));
    } else {
      setNewLocation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Delete location function
  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      const locationRef = ref(database, `trafficLight/locations/${id}`);
      await remove(locationRef);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">Traffic Light Locations</h3>
        <button
          onClick={() => setIsAddingLocation(!isAddingLocation)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full sm:w-auto"
        >
          {isAddingLocation ? 'Cancel' : 'Add Location'}
        </button>
      </div>

      {isAddingLocation && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Location Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newLocation.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="e.g., Downtown Intersection"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={newLocation.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Full address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={newLocation.coordinates.latitude}
                onChange={handleChange}
                required
                step="any"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={newLocation.coordinates.longitude}
                onChange={handleChange}
                required
                step="any"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Longitude"
              />
            </div>
          </div>

          <div>
            <label htmlFor="installationDate" className="block text-sm font-medium text-gray-300 mb-2">
              Installation Date
            </label>
            <input
              type="date"
              id="installationDate"
              name="installationDate"
              value={newLocation.installationDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={newLocation.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newLocation.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Additional details about this location"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
          >
            Add Location
          </button>
        </motion.form>
      )}

      {/* Locations List */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {locations.map((location) => (
          <div key={location.id} className="bg-gray-700 rounded-lg p-4 flex flex-col gap-2 relative text-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white break-words max-w-xs">{location.name}</h4>
                <p className="text-gray-400 text-xs sm:text-sm break-words max-w-xs">{location.address}</p>
              </div>
              <button
                onClick={() => handleDelete(location.id)}
                className="mt-2 sm:mt-0 ml-0 sm:ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition-colors w-full sm:w-auto"
                title="Delete Location"
              >
                Delete
              </button>
            </div>
            <div className="text-gray-300 text-xs">
              Lat: {location.coordinates.latitude}, Lng: {location.coordinates.longitude}
            </div>
            <div className="text-gray-400 text-xs">Installed: {location.installationDate}</div>
            <div className="text-gray-400 text-xs">Status: {location.status}</div>
            {location.description && <div className="text-gray-400 text-xs break-words max-w-xs">{location.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
} 